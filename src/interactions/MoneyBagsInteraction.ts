import {EmbedBuilder, GuildMember, SelectMenuInteraction, StringSelectMenuBuilder} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import Balance from "@/types/database/Balance";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";

interface MoneyBagsInteractionComponents {
    moneybag: StringSelectMenuBuilder
}

interface MoneyBagsInteractionData {
    member: GuildMember,
    balance: Balance,
    min: number
    max: number
}

export default class MoneyBagsInteraction extends AbstractInteraction implements Interaction {
    public declare data: MoneyBagsInteractionData
    public lifetime = 120000
    protected components: MoneyBagsInteractionComponents
    protected props = interactions.MoneyBags[this.settings.language.interface]

    constructor(users: Array<string>, data: MoneyBagsInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.components = {
            moneybag: new StringSelectMenuBuilder()
                .setCustomId(`${this.id}-moneybag`)
                .setPlaceholder(this.props.menu.placeholder)
                .addOptions(this.props.menu.options)
        }
        this.embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: data.member.displayAvatarURL()})
            .setDescription(this.props.embed.description)
    }

    public async execute(interaction: SelectMenuInteraction): Promise<InteractionExecutionResult> {
        let amount = Math.floor(this.data.min+(this.data.max-this.data.min)*Math.random())
        let emoji = this.client.cache.emojis[interaction.values[0] + '_moneybag'];
        await this.data.balance.reload().catch(() => null)
        this.data.balance.balance += amount;
        this.data.balance.lastmb = Date.now();
        await this.data.balance.save();
        this.embed.setColor(amount >= 0 ? this.constants.colors.success : this.constants.colors.error)
        this.embed.setDescription(`${emoji} => ${amount >= 0 ? "💸" : "💥"}\n` +
        `**${this.props.embed.result}:** ${(amount >= 0 ? '+' : '') + amount
            .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}\n` +
        `**${this.props.embed.currentBalance}**: ${this.data.balance.balance
            .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`)

        return {action: "update", ended: true};
    }
}