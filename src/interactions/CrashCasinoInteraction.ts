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

interface CrashCasinoInteractionComponents {
    raise: ButtonBuilder
    stop: ButtonBuilder
}

interface CrashCasinoInteractionData {
    member: GuildMember
    balance: Balance
    bet: number
    multiplier: number
}

type LeaderboardInteractionAction = 'raise' | 'stop'

export default class CrashCasinoInteraction extends AbstractInteraction implements Interaction {
    public declare data: CrashCasinoInteractionData
    public lifetime = 300000
    protected components: CrashCasinoInteractionComponents
    protected props = interactions.CrashCasino[this.settings.language.interface]

    constructor(users: Array<string>, data: CrashCasinoInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.components = {
            raise: new ButtonBuilder()
                .setCustomId(`${this.id}-raise`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.raise.emoji)
                .setLabel(this.props.buttons.raise.label),
            stop: new ButtonBuilder()
                .setCustomId(`${this.id}-stop`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji(this.props.buttons.stop.emoji)
                .setLabel(this.props.buttons.stop.label)
                .setDisabled(true)
        }
        this.embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: data.member.displayAvatarURL()})
            .setDescription(this.props.embed.description)
            .addFields([
                {name: this.props.embed.bet, value: this.data.bet
                        .toLocaleString(this.settings.language.interface) + this.settings.moneysymb, inline: true},
                {name: this.props.embed.multiplier, value: 'x' + this.data.multiplier.toString(), inline: true},
                {name: this.props.embed.gain, value: this.data.bet
                        .toLocaleString(this.settings.language.interface)+ this.settings.moneysymb, inline: true}
            ])
    }

    public async execute(interaction: ButtonInteraction, action: LeaderboardInteractionAction): Promise<InteractionExecutionResult> {
        return this[action](interaction);
    }

    public async end() {
        await this.data.balance.reload().catch(() => null)
        this.data.balance.balance += this.data.bet;
        await this.data.balance.save()
    }

    private async raise(interaction: ButtonInteraction): Promise<InteractionExecutionResult> {
        this.components.stop.setDisabled(false);
        this.data.multiplier = Math.round((this.data.multiplier + 0.2)*10)/10;
        if(Math.round(Math.random()*10) > 2) {
            let gain = Math.round(this.data.bet * this.data.multiplier);
            this.embed.setFields([
                {name: this.props.embed.bet, value: this.data.bet
                        .toLocaleString(this.settings.language.interface) + this.settings.moneysymb, inline: true},
                {name: this.props.embed.multiplier, value: 'x' + this.data.multiplier.toString(), inline: true},
                {name: this.props.embed.gain,value: gain
                        .toLocaleString(this.settings.language.interface)+ this.settings.moneysymb,inline: true}])
            return {action: 'update', ended: false}
        }
        else {
            this.embed
                .setColor(this.constants.colors.error)
                .setDescription(`**${this.props.embed.result}:** -${this.data.bet}${this.settings.moneysymb}\n` +
                    `**${this.props.embed.currentBalance}:** ${this.data.balance.balance}${this.settings.moneysymb}`)
                .setFields([
                    {name: this.props.embed.bet, value: this.data.bet
                            .toLocaleString(this.settings.language.interface)+ this.settings.moneysymb, inline: true},
                    {name: this.props.embed.multiplier, value: 'x' + this.data.multiplier.toString(), inline: true},
                    {name: this.props.embed.gain, value: "0" + this.settings.moneysymb, inline: true}])
            return {action: 'update', ended: true}
        }
    }

    private async stop(interaction: ButtonInteraction): Promise<InteractionExecutionResult> {
        let gain = Math.round(this.data.bet * this.data.multiplier);
        await this.data.balance.reload().catch(() => null);
        this.data.balance.balance += gain;
        await this.data.balance.save();
        this.embed
            .setColor(this.constants.colors.success)
            .setDescription(`**${this.props.embed.result}:** +${gain}${this.settings.moneysymb}\n` +
                `**${this.props.embed.currentBalance}:** ${this.data.balance.balance}${this.settings.moneysymb}`)
            .setFields([
                {name: this.props.embed.bet, value: this.data.bet
                        .toLocaleString(this.settings.language.interface)+ this.settings.moneysymb, inline: true},
                {name: this.props.embed.multiplier, value: 'x' + this.data.multiplier.toString(), inline: true},
                {name: this.props.embed.gain, value: gain
                        .toLocaleString(this.settings.language.interface)+ this.settings.moneysymb, inline: true}])
        return {action: "update", ended: true}
    }
}