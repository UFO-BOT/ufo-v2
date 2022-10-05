import Discord, {
    ButtonBuilder,
    ButtonInteraction,
    EmbedBuilder, Guild,
    GuildMember,
    SelectMenuBuilder,
    SelectMenuInteraction,
    SnowflakeUtil,
    ButtonStyle
} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import Item from "@/types/database/Item";

interface ShopInteractionComponents {
    backward: ButtonBuilder
    forward: ButtonBuilder
}

interface ShopInteractionData {
    guild: Guild,
    items: Array<Item>
    page: number
    maxPage: number
}

type ShopInteractionAction = 'forward' | 'backward'

export default class ShopInteraction extends AbstractInteraction implements Interaction {
    public declare data: ShopInteractionData
    public lifetime = 120000
    protected components: ShopInteractionComponents
    protected props = interactions.Shop[this.settings.language.interface]

    constructor(users: Array<string>, data: ShopInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.components = {
            backward: new ButtonBuilder()
                .setCustomId(`${this.id}-backward`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.backward)
                .setDisabled(true),
            forward: new ButtonBuilder()
                .setCustomId(`${this.id}-forward`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.forward)
                .setDisabled(this.data.maxPage <= 1)
        }
        this.embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: this.data.guild.iconURL()})
        this.setItems();
    }

    public async execute(interaction: ButtonInteraction, action: ShopInteractionAction): Promise<InteractionExecutionResult> {
        switch (action) {
            case "forward":
                this.data.page++;
                if(this.data.page > this.data.maxPage) this.data.page = this.data.maxPage
                break;
            case "backward":
                this.data.page--;
                if(this.data.page < 1) this.data.page = 1;
        }
        this.setItems()
        return {action: "update"}
    }

    private setItems() {
        if(this.data.items.length === 0) this.embed.setDescription(this.props.embed.empty)
        this.embed.data.fields = []
        this.data.items.slice((this.data.page-1) * 10, this.data.page * 10).forEach(item => {
            this.embed.addFields({
                name: `${item.name} - ${item.price.toLocaleString(this.settings.language.interface)}${this.settings.moneysymb}`,
                value: item.description?.length ? item.description : this.props.embed.noDescription
            })
        })
        this.embed.setFooter({text: this.props.embed.footer + ` ${this.data.page}/${this.data.maxPage}`})
        this.components.backward.setDisabled(this.data.page === 1)
        this.components.forward.setDisabled(this.data.page >= this.data.maxPage)
        return {action: "update"};
    }
}