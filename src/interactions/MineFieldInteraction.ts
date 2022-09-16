import Discord, {
    ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    EmbedBuilder, Guild,
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

interface MineFieldInteractionComponents {
    one: ButtonBuilder
    two: ButtonBuilder
    three: ButtonBuilder
    stop: ButtonBuilder
}

interface MineFieldInteractionData {
    member: GuildMember
    balance: Balance
    bet: number
    multiplier: number
    step: number
    field: Array<Array<string>>
}

type MinefieldInteractionAction = '1' | '2' | '3' | 'stop'

export default class MineFieldInteraction extends AbstractInteraction implements Interaction {
    public declare data: MineFieldInteractionData
    public lifetime = 300000
    protected components: MineFieldInteractionComponents
    protected props = interactions.MineField[this.settings.language.interface]

    constructor(users: Array<string>, data: MineFieldInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.components = {
            one: new ButtonBuilder()
                .setCustomId(`${this.id}-1`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.up.emoji),
            two: new ButtonBuilder()
                .setCustomId(`${this.id}-2`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.up.emoji),
            three: new ButtonBuilder()
                .setCustomId(`${this.id}-3`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.up.emoji),
            stop: new ButtonBuilder()
                .setCustomId(`${this.id}-stop`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji(this.props.buttons.stop.emoji)
                .setDisabled(true),
        }
        this.embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: data.member.displayAvatarURL()})
            .setDescription(this.props.embed.description)
            .addFields([
                {name: this.props.embed.bet, value: this.data.bet.toString() + this.settings.moneysymb, inline: true},
                {name: this.props.embed.multiplier, value: 'x' + this.data.multiplier.toString(), inline: true},
                {name: this.props.embed.gain, value: this.data.bet.toString() + this.settings.moneysymb, inline: true},
                {name: this.props.embed.field, value: this.data.field.reverse().map(r => r.join(" ")).join("\n\n")}
            ])
    }

    public async execute(interaction: ButtonInteraction, action: MinefieldInteractionAction): Promise<InteractionExecutionResult> {
        if(action === "stop") return this.stop()
        this.components.stop.setDisabled(false)
        let cell = Number(action)-1;
        let emojis = ["💥", global.client.cache.emojis.one, global.client.cache.emojis.two]
        let multipliers = [0, 1, 2];
        let random = Math.round(Math.random() * 2);
        this.data.multiplier *= multipliers[random];
        let gain = this.data.bet * this.data.multiplier;
        this.data.field[4-this.data.step][cell] = emojis[random]
        this.embed
            .setFields([
                {name: this.props.embed.bet, value: this.data.bet.toString() + this.settings.moneysymb, inline: true},
                {name: this.props.embed.multiplier, value: 'x' + this.data.multiplier.toString(), inline: true},
                {name: this.props.embed.gain, value: gain.toString() + this.settings.moneysymb, inline: true},
                {name: this.props.embed.field, value: this.data.field.map(r => r.join(" ")).join("\n\n")}
            ])
        if(random === 0) {
            this.embed.setColor(global.constants.colors.error)
                .setDescription(`**${this.props.embed.result}:** -${this.data.bet}${this.settings.moneysymb}\n` +
                    `**${this.props.embed.currentBalance}:** ${this.data.balance.balance}${this.settings.moneysymb}`)
            return {action: "update", ended: true}
        }
        this.data.step++;
        if(this.data.step >= 5) return this.stop()
        return {action: "update", ended: false}
    }

    public async end() {
        await this.data.balance.reload()
        this.data.balance.balance += this.data.bet;
        await this.data.balance.save()
    }

    private async stop(): Promise<InteractionExecutionResult> {
        let gain = Math.round(this.data.bet * this.data.multiplier);
        await this.data.balance.reload();
        this.data.balance.balance += gain;
        await this.data.balance.save();
        this.embed
            .setColor(global.constants.colors.success)
            .setDescription(`**${this.props.embed.result}:** +${gain}${this.settings.moneysymb}\n` +
                `**${this.props.embed.currentBalance}:** ${this.data.balance.balance}${this.settings.moneysymb}`)
            .setFields([
                {name: this.props.embed.bet, value: this.data.bet.toString() + this.settings.moneysymb, inline: true},
                {name: this.props.embed.multiplier, value: 'x' + this.data.multiplier.toString(), inline: true},
                {name: this.props.embed.gain, value: gain + this.settings.moneysymb, inline: true},
                {name: this.props.embed.field, value: this.data.field.map(r => r.join(" ")).join("\n\n")}
            ])
        return {action: "update", ended: true}
    }
}