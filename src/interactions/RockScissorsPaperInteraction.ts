import {
    ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    EmbedBuilder,
    GuildMember,
    SelectMenuBuilder,
    SelectMenuInteraction,
    SnowflakeUtil
} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import Balance from "@/types/database/Balance";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";

interface RockScissorsPaperInteractionComponents {
    moneybag?: SelectMenuBuilder
    accept?: ButtonBuilder
}

interface RockScissorsPaperInteractionData {
    member: GuildMember,
    balance: Balance,
    bet: number,
    opponent?: GuildMember
    opponentBalance?: Balance
    accepted?: boolean
    choice?: 'rock' | 'scissors' | 'paper'
}

type RockScissorsPaperInteractionAction = 'rsp' | 'accept'

export default class RockScissorsPaperInteraction extends AbstractInteraction implements Interaction {
    public declare data: RockScissorsPaperInteractionData
    public lifetime = 300000
    protected components: RockScissorsPaperInteractionComponents
    protected props = interactions.RockScissorsPaper[this.settings.language.interface]

    constructor(users: Array<string>, data: RockScissorsPaperInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        if(!this.data.opponent) this.setEmbed();
        else {
            this.components = {
                accept: new ButtonBuilder()
                    .setCustomId(`${this.id}-accept`)
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(this.props.buttons.accept.label)
            }
            this.embed = new EmbedBuilder()
                .setColor(this.constants.colors.system)
                .setAuthor({name: this.props.embed.author, iconURL: data.member.displayAvatarURL()})
                .setDescription(this.props.embed.acceptDescription
                    .replace("{{opponent}}", this.data.opponent.toString())
                    .replace("{{bet}}", this.data.bet + this.settings.moneysymb)
                    .replace("{{member}}", this.data.member.toString())
                )
        }
    }

    public async execute(interaction: SelectMenuInteraction, action: RockScissorsPaperInteractionAction): Promise<InteractionExecutionResult> {
        if(action === "accept") return this.accept();
        if(this.data.opponent && !this.data.choice) {
            this.data.choice = interaction.values[0] as typeof this.data.choice;
            this.setEmbed()
            this.users = [this.data.opponent.id]
            return {action: "update"}
        }
        let choice = this.data.opponent ? interaction.values[0] as typeof this.data.choice :
            Object.keys(this.emojis)[Math.floor(Object.keys(this.emojis).length * Math.random())];
        await this.data.balance.reload()
        await this.data.opponentBalance?.reload()
        if(this.data.opponent) {
            this.embed.setColor(this.constants.colors.system)
            if(this.combinations[this.data.choice] === choice) {
                this.embed.setDescription(`**${this.props.embed.winner}:** ${this.data.member.toString()}\n` +
                `**${this.data.member.user.tag}:** +${this.data.bet
                    .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}\n` +
                `**${this.data.opponent.user.tag}:** -${this.data.bet
                    .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`)
                this.data.balance.balance += this.data.bet * 2;
            }
            else if(this.data.choice === choice) {
                this.embed.setDescription(this.props.embed.draw)
                this.data.balance.balance += this.data.bet;
                this.data.opponentBalance.balance += this.data.bet;
            }
            else {
                this.embed.setDescription(`**${this.props.embed.winner}:** ${this.data.opponent.toString()}\n` +
                    `**${this.data.opponent.user.tag}:** +${this.data.bet
                        .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}\n` +
                    `**${this.data.member.user.tag}:** -${this.data.bet
                        .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`)
                this.data.opponentBalance.balance += this.data.bet * 2;
            }
        }
        else {
            this.data.choice = interaction.values[0] as typeof this.data.choice;
            if(this.combinations[this.data.choice as keyof typeof this.combinations] === choice) {
                let gain = this.data.bet * 2
                this.embed
                    .setColor(this.constants.colors.success)
                    .setDescription(`**${this.props.embed.result}**: +${gain
                        .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`)
                this.data.balance.balance += gain;
            }
            else if(this.data.choice === choice) {
                this.embed
                    .setColor(this.constants.colors.warning)
                    .setDescription(`**${this.props.embed.result}**: ${this.props.embed.returnMoney}`)
                this.data.balance.balance += this.data.bet;
            }
            else {
                this.embed
                    .setColor(this.constants.colors.error)
                    .setDescription(`**${this.props.embed.result}**: -${this.data.bet
                        .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`)
            }
            this.embed.data.description +=
                `\n**${this.props.embed.currentBalance}:** ${this.data.balance.balance
                    .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`;
        }

        this.embed.addFields([
            {
                name: this.data.member.user.tag,
                value: this.emojis[this.data.choice as keyof typeof this.emojis],
                inline: true
            },
            {
                name: this.data.opponent?.user?.tag ?? this.client.user.tag,
                value: this.emojis[choice as keyof typeof this.emojis],
                inline: true
            }
        ])

        await this.data.balance.save()
        await this.data.opponentBalance?.save()

        return {action: "update", ended: true};
    }

    public async end() {
        await this.data.balance.reload()
        this.data.balance.balance += this.data.bet;
        await this.data.balance.save()
        if(this.data.opponent && this.data.accepted) {
            await this.data.opponentBalance.reload()
            this.data.opponentBalance.balance++;
            await this.data.opponentBalance.save()
        }
    }

    private async accept(): Promise<InteractionExecutionResult> {
        await this.data.opponentBalance.reload()
        if(this.data.opponentBalance.balance < this.data.bet) return {
            error: {
                type: "notEnoughMoney",
                options: {money: this.data.opponentBalance.balance}
            }
        }
        this.data.opponentBalance.balance -= this.data.bet;
        await this.data.opponentBalance.save();
        this.data.accepted = true;
        this.users = [this.data.member.id];
        this.setEmbed();
        return {action: "update"}
    }

    private setEmbed(): void {
        this.components = {
            moneybag: new SelectMenuBuilder()
                .setCustomId(`${this.id}-rsp`)
                .setPlaceholder(this.props.menu.placeholder)
                .addOptions(this.props.menu.options)
        }
        this.embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: this.data.member.displayAvatarURL()})
            .setDescription(this.props.embed.description)
        if(this.data.opponent) {
            if(this.data.choice) this.embed.data.description += `\n${this.props.embed.chooses}: ${this.data.opponent.toString()}`
            else this.embed.data.description += `\n${this.props.embed.chooses}: ${this.data.member.toString()}`
        }
    }

    private emojis = {
        rock: "\uD83D\uDC4A",
        scissors: "✌",
        paper: "✋"
    }

    private combinations = {
        rock: "scissors",
        scissors: "paper",
        paper: "rock"
    }
}