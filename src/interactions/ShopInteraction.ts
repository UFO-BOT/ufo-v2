import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    Guild, GuildMember,
    SelectMenuInteraction,
    StringSelectMenuBuilder
} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import Item from "@/types/database/Item";
import Balance from "@/types/database/Balance";

interface ShopInteractionComponents {
    back?: ButtonBuilder
    buy?: ButtonBuilder
    items?: StringSelectMenuBuilder
}

interface ShopInteractionData {
    member: GuildMember,
    balance: Balance
    items: Array<Item>
    item?: Item
    page: number
    maxPage: number
}

type ShopInteractionAction = 'item' | 'items'

export default class ShopInteraction extends AbstractInteraction implements Interaction {
    public declare data: ShopInteractionData
    public lifetime = 120000
    public lock = true
    protected components: ShopInteractionComponents
    protected props = interactions.Shop[this.settings.language.interface]

    constructor(users: Array<string>, data: ShopInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.items();
    }

    public async execute(interaction: SelectMenuInteraction, action: ShopInteractionAction): Promise<InteractionExecutionResult> {
        return this[action](interaction)
    }

    private async item(interaction: SelectMenuInteraction): Promise<InteractionExecutionResult> {
        let name = interaction.values[0]
        if (name === 'prev-page') {
            this.data.page--;
            if(this.data.page < 1) this.data.page = 1;
            this.items()
        }
        else if (name === 'next-page') {
            this.data.page++;
            if(this.data.page > this.data.maxPage) this.data.page = this.data.maxPage
            this.items()
        }
        else {
            this.data.item = this.data.items.find(i => i.name === name)
            await this.itemInfo()
        }
        return {action: "update"}
    }

    private async buy(): Promise<InteractionExecutionResult> {
        await this.data.balance.reload().catch(() => null)
        if (this.data.balance.balance < this.data.item.price
            || this.data.balance.xp < this.data.item.requiredXp
            || this.data.item?.requiredRoles?.find(r => !this.data.member.roles.cache.get(r))) {
            await this.itemInfo()
            return {action: "update"}
        }
        let addRoles = this.data.member.guild.roles.cache.filter(r => this.data.item.addRoles?.includes(r.id) &&
            this.data.member.guild.members.me.roles.highest.position > r.position)
        let removeRoles = this.data.member.guild.roles.cache.filter(r => this.data.item.removeRoles?.includes(r.id) &&
            this.data.member.guild.members.me.roles.highest.position > r.position)
        let minXp = typeof this.data.item.xp === 'number' ? this.data.item.xp : this.data.item.xp.min
        let maxXp = typeof this.data.item.xp === 'number' ? this.data.item.xp : this.data.item.xp.max
        let xp = Math.floor(minXp + (maxXp-minXp) * Math.random())
        this.data.balance.balance -= this.data.item.price
        this.data.balance.xp += xp
        let description = this.props.buyItemEmbed.description.replace("{{item}}", this.data.item.name) + '\n'
        description += `${this.props.buyItemEmbed.balance}: ${this.data.balance.balance}${this.settings.moneysymb}\n`
        if (xp > 0) description += `${this.props.buyItemEmbed.xp}: ${xp}${this.client.cache.emojis.xp}\n`
        if (addRoles.size) {
            await this.data.member.roles.add(addRoles)
            description += `${this.props.buyItemEmbed.addRoles}: ${addRoles.map(r => r.toString()).join(" ")}\n`
        }
        if (removeRoles.size) {
            await this.data.member.roles.remove(removeRoles)
            description += `${this.props.buyItemEmbed.removeRoles}: ${removeRoles.map(r => r.toString()).join(" ")}\n`
        }
        await this.data.balance.save()
        this.embed
            .setAuthor({name: this.props.buyItemEmbed.author, iconURL: this.data.member.displayAvatarURL()})
            .setTitle(null)
            .setDescription(description)
            .setFields([])
        this.components = {}
        return {action: "reply"}
    }

    private items(): InteractionExecutionResult {
        this.embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: this.data.member.guild.iconURL()})
            .setDescription(null)
            .setThumbnail(null)
            .setFields([])
        if(this.data.items.length === 0) {
            this.embed.setDescription(this.props.embed.empty)
            this.components = {}
            return {action: "update"}
        }
        let options = []
        if(this.data.page !== 1) options.push(this.props.menu.options.previous)
        if(this.data.page < this.data.maxPage) options.push(this.props.menu.options.next)
        this.data.items.slice((this.data.page-1) * 10, this.data.page * 10).forEach(item => {
            this.embed.addFields({
                name: `${item.name} - ${item.price
                    .toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`,
                value: item.description?.length ? item.description : this.props.embed.noDescription
            })
            options.push({
                label: item.name,
                value: item.name
            })
        })
        this.components = {
            items: new StringSelectMenuBuilder()
                .setCustomId(`${this.id}-item`)
                .setPlaceholder(this.props.menu.placeholder)
                .setOptions(options)
        }
        this.embed.setFooter({text: this.props.embed.footer + ` ${this.data.page}/${this.data.maxPage}`})
        return {action: "update"}
    }

    private async itemInfo() {
        let lang = this.settings.language.interface
        let unavailable = []
        await this.data.balance.reload().catch(() => null)
        if (this.data.balance.balance < this.data.item.price)
            unavailable.push(`${this.props.embed.notEnoughMoney} ` +
                `${this.data.balance.balance.toLocaleString(lang)}${this.settings.moneysymb}`)
        if (this.data.balance.xp < this.data.item.requiredXp)
            unavailable.push(`${this.props.embed.notEnoughXp} ` +
                `${this.data.balance.xp.toLocaleString(lang)}${this.client.cache.emojis.xp}`)
        if (this.data.item?.requiredRoles?.find(r => !this.data.member.roles.cache.get(r)))
            unavailable.push(this.props.embed.noRequiredRoles)
        let addRoles = this.data.member.guild.roles.cache.filter(r => this.data.item.addRoles?.includes(r.id) &&
            this.data.member.guild.members.me.roles.highest.position > r.position)
        let removeRoles = this.data.member.guild.roles.cache.filter(r => this.data.item.removeRoles?.includes(r.id) &&
            this.data.member.guild.members.me.roles.highest.position > r.position)
        let minXp = typeof this.data.item.xp === 'number' ? this.data.item.xp : this.data.item.xp.min
        let maxXp = typeof this.data.item.xp === 'number' ? this.data.item.xp : this.data.item.xp.max
        let xp = minXp === maxXp ? `${minXp.toLocaleString(lang)}${this.client.cache.emojis.xp}` :
            `${minXp.toLocaleString(lang)}${this.client.cache.emojis.xp} - `
            + `${maxXp.toLocaleString(lang)}${this.client.cache.emojis.xp}`
        this.embed
            .setTitle(this.data.item.name)
            .setDescription(this.data.item.description?.length ? this.data.item.description : null)
            .setThumbnail(this.data.item.iconUrl?.length && this.settings.boost ? this.data.item.iconUrl : null)
            .setFields([
                {
                    name: this.props.embed.price,
                    value: `${this.data.item.price.toLocaleString(lang)}${this.settings.moneysymb}`,
                    inline: true
                },
                {
                    name: this.props.embed.requiredXp,
                    value: `${(this.data.item.requiredXp ?? 0).toLocaleString(lang)}${this.client.cache.emojis.xp}`,
                    inline: true
                },
                {
                    name: this.props.embed.xp,
                    value: `${xp}`,
                    inline: true
                },
                {
                    name: this.props.embed.addRoles,
                    value: addRoles.size ? addRoles.map(r => r.toString()).join(" ") : "-",
                    inline: true
                },
                {
                    name: this.props.embed.removeRoles,
                    value: removeRoles.size ? removeRoles.map(r => r.toString()).join(" ") : "-",
                    inline: true
                },
                {
                    name: this.props.embed.requiredRoles,
                    value: this.data.item.requiredRoles?.length ?
                        this.data.item.requiredRoles.map(r => `<@&${r}>`).join(" ") : "-"
                }
            ])
            .setFooter(null)
        if (unavailable.length) this.embed.addFields({
            name: this.props.embed.unavailable,
            value: unavailable.join('\n')
        })
        this.components = {
            back: new ButtonBuilder()
                .setCustomId(`${this.id}-items`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.back.emoji)
                .setLabel(this.props.buttons.back.label),
            buy: new ButtonBuilder()
                .setCustomId(`${this.id}-buy`)
                .setStyle(ButtonStyle.Success)
                .setEmoji(this.props.buttons.buy.emoji)
                .setLabel(this.props.buttons.buy.label)
                .setDisabled(!!unavailable.length),
        }
    }
}