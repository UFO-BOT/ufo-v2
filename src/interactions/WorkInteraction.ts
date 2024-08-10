import {
    ButtonBuilder, ButtonStyle,
    EmbedBuilder,
    GuildMember,
    SelectMenuInteraction,
    StringSelectMenuBuilder
} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import Balance from "@/types/database/Balance";
import interactions from "@/properties/interactions.json";
import responses from "@/properties/responses.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import GuildCustomJob from "@/types/GuildCustomJob";
import TimeParser from "@/utils/TimeParser";
import CustomJobMessageTemplate from "@/services/templates/messages/CustomJobMessageTemplate";

interface WorkInteractionComponents {
    job?: StringSelectMenuBuilder
    back?: ButtonBuilder
    work?: ButtonBuilder
}

interface WorkInteractionData {
    member: GuildMember
    balance: Balance
    jobs: Array<GuildCustomJob>
    job?: GuildCustomJob
}

type WorkInteractionAction = 'job' | 'menu' | 'work'

export default class WorkInteraction extends AbstractInteraction implements Interaction {
    public declare data: WorkInteractionData
    public lifetime = 120000
    protected components: WorkInteractionComponents
    protected props = interactions.Work[this.settings.language.interface]

    constructor(users: Array<string>, data: WorkInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.menu()
    }

    public async execute(interaction: SelectMenuInteraction, action: WorkInteractionAction): Promise<InteractionExecutionResult> {
        return this[action](interaction)
    }

    private menu(): InteractionExecutionResult {
        let lang = this.settings.language.interface
        let options = this.data.jobs.map(job => {
            let lastCustomJob = this.data.balance.lastCustomJobs?.[job.name]
            let timePassed = Date.now() - lastCustomJob
            return {
                label: job.name,
                value: job.name,
                description: timePassed < job.cooldown ? this.props.menu.availableIn + ' ' +
                    TimeParser.stringify((job.cooldown - timePassed), lang, true, true) : undefined,
                disabled: true}
        })
        this.components = {
            job: new StringSelectMenuBuilder()
                .setCustomId(`${this.id}-job`)
                .setPlaceholder(this.props.menu.placeholder)
                .addOptions(options)
        }
        this.embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: this.data.member.displayAvatarURL()})
            .setDescription(this.props.embed.description)
        return {action: "update", ended: false}
    }

    private async job(interaction: SelectMenuInteraction): Promise<InteractionExecutionResult> {
        this.data.job = this.data.jobs.find(j => j.name === interaction.values[0])
        return this.showJob()
    }

    private async work(): Promise<InteractionExecutionResult> {
        let lang = this.settings.language.interface
        await this.data.balance.reload()
        if (Date.now() - this.data.balance.lastCustomJobs?.[this.data.job.name] < this.data.job.cooldown
            || this.data.balance.xp < this.data.job.requiredXp
            || this.data.job.requiredRoles.find(r => !this.data.member.roles.cache.get(r)))
            return this.showJob()
        let salary = this.data.job.salary
        let money = Math.floor(Math.random() * (salary.max - salary.min) + salary.min)
        this.data.balance.balance += money
        if (!this.data.balance.lastCustomJobs) this.data.balance.lastCustomJobs = {}
        this.data.balance.lastCustomJobs[this.data.job.name] = Date.now()
        for (let name in this.data.balance.lastCustomJobs) {
            if (!this.data.jobs.find(j => j.name === name)) delete this.data.balance.lastCustomJobs[name]
        }
        await this.data.balance.save()
        let template = new CustomJobMessageTemplate(this.data.member, this.data.member.guild, {
            salary: money,
            balance: this.data.balance.balance,
            moneySymbol: this.settings.moneysymb
        })
        let message = template.compile(this.data.job.message)
        if (!message?.length) message = responses.work[lang].embed.description
            .replace("{{salary}}", (money >= 0 ? '+' : '') + money.toLocaleString(lang))
            .replace(/{{monsymb}}/gmi, this.settings.moneysymb)
            .replace("{{balance}}", this.data.balance.balance.toLocaleString(lang))
        this.embed
            .setFields([])
            .setDescription(message)
        return {action: "update", ended: true}
    }


    private async showJob(): Promise<InteractionExecutionResult> {
        let lang = this.settings.language.interface
        let salary = this.data.job.salary.min === this.data.job.salary.max ?
            `${this.data.job.salary.min.toLocaleString(lang)}${this.settings.moneysymb}` :
            `**${this.props.embed.min}:** ${this.data.job.salary.min.toLocaleString(lang)}${this.settings.moneysymb}\n`
            + `**${this.props.embed.max}:** ${this.data.job.salary.max.toLocaleString(lang)}${this.settings.moneysymb}`
        let cooldown = TimeParser.stringify(this.data.job.cooldown, lang)
        let unavailable = []
        await this.data.balance.reload()
        let lastCustomJob = this.data.balance.lastCustomJobs?.[this.data.job.name]
        let timePassed = Date.now() - lastCustomJob
        if (timePassed < this.data.job.cooldown)
            unavailable.push(`${this.props.embed.availableIn} ` +
                `${TimeParser.formatTimestamp(lastCustomJob + this.data.job.cooldown, 'R')}`)
        if (this.data.balance.xp < this.data.job.requiredXp)
            unavailable.push(`${this.props.embed.notEnoughXp} ` +
                `${this.data.balance.xp.toLocaleString(lang)}${this.client.cache.emojis.xp}`)
        if (this.data.job.requiredRoles.find(r => !this.data.member.roles.cache.get(r)))
            unavailable.push(this.props.embed.noRequiredRoles)
        this.embed.setFields([])
        this.embed
            .setTitle(this.data.job.name)
            .setDescription(this.data.job.description?.length ? this.data.job.description : null)
            .setThumbnail(this.data.job.iconUrl?.length && this.settings.boost ? this.data.job.iconUrl : null)
        if(!this.data.job.hideOptions) this.embed.addFields([
                {
                    name: this.props.embed.salary,
                    value: salary,
                    inline: true
                },
                {
                    name: this.props.embed.requiredXp,
                    value: `${this.data.job.requiredXp.toLocaleString(lang)}${this.client.cache.emojis.xp}`,
                    inline: true
                },
                {
                    name: this.props.embed.cooldown,
                    value: cooldown,
                    inline: cooldown.length <= 20
                },
                {
                    name: this.props.embed.requiredRoles,
                    value: this.data.job.requiredRoles.length ?
                        this.data.job.requiredRoles.map(r => `<@&${r}>`).join(" ") : "-"
                }
            ])
        if (unavailable.length) this.embed.addFields({
            name: this.props.embed.unavailable,
            value: unavailable.join('\n')
        })
        this.components = {
            back: new ButtonBuilder()
                .setCustomId(`${this.id}-menu`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.props.buttons.back.emoji)
                .setLabel(this.props.buttons.back.label),
            work: new ButtonBuilder()
                .setCustomId(`${this.id}-work`)
                .setStyle(ButtonStyle.Success)
                .setEmoji(this.props.buttons.work.emoji)
                .setLabel(this.props.buttons.work.label)
                .setDisabled(!!unavailable.length)
        }
        return {action: "update", ended: false}
    }
}