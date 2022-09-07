import {
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
import Interaction from "@/types/Interaction";
import Balance from "@/types/database/Balance";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import GetGuildLeaderboard from "@/utils/GetGuildLeaderboard";

interface LeaderboardInteractionComponents {
    backward: ButtonBuilder
    forward: ButtonBuilder
}

interface LeaderboardInteractionData {
    guild: Guild,
    leaders: Array<Balance>
    sort: 'balance' | 'xp'
    page: number
    maxPage: number
}

type LeaderboardInteractionAction = 'forward' | 'backward'

export default class LeaderboardInteraction extends AbstractInteraction implements Interaction {
    public declare data: LeaderboardInteractionData
    public lifetime = 120000
    protected components: LeaderboardInteractionComponents
    protected props = interactions.Leaderboard[this.settings.language.interface]

    constructor(users: Array<string>, data: LeaderboardInteractionData, settings: GuildSettingsCache) {
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
                .setDisabled(this.data.maxPage === 1),
        }
        this.embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: this.data.guild.iconURL()})
            .setTitle(this.data.sort === 'balance' ? this.props.embed.balance : this.props.embed.xp)
            .setURL(process.env.WEBSITE + `/leaderboard/${this.data.guild.id}`)
        this.setLeaders()
    }

    public async execute(interaction: SelectMenuInteraction, action: LeaderboardInteractionAction): Promise<InteractionExecutionResult> {
        switch (action) {
            case "forward":
                this.data.page++;
                if(this.data.page > this.data.maxPage) this.data.page = this.data.maxPage
                break;
            case "backward":
                this.data.page--;
                if(this.data.page < 1) this.data.page = 1;
        }
        let result = await GetGuildLeaderboard(this.data.guild.id, this.data.sort, this.data.page);
        this.data.page = result.page;
        this.data.leaders = result.leaders;
        this.components.backward.setDisabled(this.data.page === 1)
        this.components.forward.setDisabled(this.data.page === this.data.maxPage)
        this.setLeaders()
        return {action: "update"};
    }

    private setLeaders() {
        this.embed.data.description = '';
        this.data.leaders.forEach((leader, i) => {
            let emoji = this.data.sort === 'balance' ? this.settings.moneysymb : global.client.cache.emojis.xp;
            this.embed.data.description +=
                `**${(this.data.page-1)*10+i+1}.** <@${leader.userid}> • ${leader[this.data.sort]}${emoji}\n`
        })
        this.embed.setFooter({text: `${this.props.embed.footer} ${this.data.page}/${this.data.maxPage}`})
    }
}