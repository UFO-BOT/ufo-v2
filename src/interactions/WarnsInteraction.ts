import {ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, GuildMember} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import Case from "@/types/database/Case";
import TimeParser from "@/utils/TimeParser";

interface WarnsInteractionComponents {
    backward: ButtonBuilder
    forward: ButtonBuilder
}

interface WarnsInteractionData {
    member: GuildMember
    warns: Array<Case>
    page: number
    maxPage: number
}

type WarnsInteractionAction = 'forward' | 'backward'

export default class WarnsInteraction extends AbstractInteraction implements Interaction {
    public declare data: WarnsInteractionData
    public lifetime = 120000
    protected components: WarnsInteractionComponents
    protected props = interactions.Warns[this.settings.language.interface]

    constructor(users: Array<string>, data: WarnsInteractionData, settings: GuildSettingsCache) {
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
            .setAuthor({
                name: this.props.embed.author + ' ' + this.data.member.user.tag,
                iconURL: this.data.member.displayAvatarURL()
            })
    }

    public async execute(interaction: ButtonInteraction, action: WarnsInteractionAction): Promise<InteractionExecutionResult> {
        switch (action) {
            case "forward":
                this.data.page++;
                if(this.data.page > this.data.maxPage) this.data.page = this.data.maxPage
                break;
            case "backward":
                this.data.page--;
                if(this.data.page < 1) this.data.page = 1;
        }
        return this.setWarns()
    }

    public async setWarns(): Promise<InteractionExecutionResult> {
        if(this.data.warns.length === 0) this.embed.setDescription(this.props.embed.empty)
        this.embed.data.fields = []
        for(let warn of this.data.warns.slice((this.data.page-1) * 5, this.data.page * 5)) {
            let executor = await this.client.users.fetch(warn.executor);
            this.embed.addFields({
                name: `${'`' + this.props.embed.case + ` #${warn.number.toLocaleString(this.settings.language.interface)}` + '`'} | ` +
                `${executor.tag} | ${TimeParser.formatTimestamp(warn.timestamp, '')}`,
                value: warn.reason
            })
        }
        this.embed.setFooter({text: this.props.embed.footer + ` ${this.data.page}/${this.data.maxPage}`})
        this.components.backward.setDisabled(this.data.page === 1)
        this.components.forward.setDisabled(this.data.page >= this.data.maxPage)
        return {action: "update"};
    }
}