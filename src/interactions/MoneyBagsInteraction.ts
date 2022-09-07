import {
    ButtonInteraction,
    EmbedBuilder,
    GuildMember,
    SelectMenuBuilder,
    SelectMenuInteraction,
    SnowflakeUtil
} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/Interaction";
import Balance from "@/types/database/Balance";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";

interface MoneyBagsInteractionComponents {
    moneybag: SelectMenuBuilder
}

interface MoneyBagsInteractionData {
    member: GuildMember,
    balance: Balance,
    low: number
    high: number
}

export default class MoneyBagsInteraction extends AbstractInteraction implements Interaction {
    public declare data: MoneyBagsInteractionData
    public lifetime = 120000
    protected components: MoneyBagsInteractionComponents
    protected props = interactions.MoneyBags[this.settings.language.interface]

    constructor(users: Array<string>, data: MoneyBagsInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.components = {
            moneybag: new SelectMenuBuilder()
                .setCustomId(`${this.id}-moneybag`)
                .setPlaceholder(this.props.menu.placeholder)
                .addOptions(this.props.menu.options)
        }
        this.embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: data.member.displayAvatarURL()})
            .setDescription(this.props.embed.description)
    }

    public async execute(interaction: SelectMenuInteraction): Promise<InteractionExecutionResult> {
        let amount = Math.floor(this.data.low+(this.data.high-this.data.low)*Math.random())
        let emoji = global.client.cache.emojis[interaction.values[0] + '_moneybag'];
        await this.data.balance.reload()
        this.data.balance.balance += amount;
        this.data.balance.lastmb = Date.now();
        await this.data.balance.save();
        this.embed.setColor(amount >= 0 ? global.constants.colors.success : global.constants.colors.error)
        this.embed.setDescription(`${emoji} => ${amount >= 0 ? "💸" : "💥"}\n` +
        `**${this.props.embed.result}** ${amount}${this.settings.moneysymb}\n` +
        `**${this.props.embed.currentBalance}**: ${this.data.balance.balance}${this.settings.moneysymb}`)

        return {action: "update", ended: true};
    }
}