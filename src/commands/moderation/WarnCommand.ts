import {ApplicationCommandOptionType, GuildMember, Message, PermissionResolvable} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import WarnAction from "@/services/moderation/actions/WarnAction";
import Settings from "@/types/database/Settings";
import Case from "@/types/database/Case";
import ModAction from "@/types/ModAction";
import properties from "@/properties/moderation.json";
import ModerationAction from "@/services/moderation/ModerationAction";
import MuteAction from "@/services/moderation/actions/MuteAction";
import KickAction from "@/services/moderation/actions/KickAction";
import BanAction from "@/services/moderation/actions/BanAction";
import ModerationActionOptions from "@/types/ModerationActionOptions";

interface WarnCommandDTO {
    member: GuildMember
    reason?: string
}

interface WarnCommandData {
    member: GuildMember
}

export default class WarnCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "пред",
            description: 'Выдает предупреждение указанному участнику по указанной причине',
            aliases: ['предупредить', 'предупреждение', 'варн']
        },
        en: {
            name: "warn",
            description: 'Warns specified member for specified reason',
            aliases: ['w', 'warning']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            validationType: CommandOptionValidationType.GuildMember,
            name: "member",
            config: {
                ru: {
                    name: "участник",
                    description: "Целевой участник"
                },
                en: {
                    name: "member",
                    description: "Target member"
                }
            },
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.LongString,
            name: "reason",
            config: {
                ru: {
                    name: "причина",
                    description: "Причина предупреждения"
                },
                en: {
                    name: "reason",
                    description: "Warn reason"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["KickMembers"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<WarnCommandDTO>): Promise<CommandExecutionResult> {
        let action = new WarnAction({
            guild: ctx.guild,
            user: ctx.args.member.user,
            member: ctx.args.member,
            executor: ctx.member,
            reason: ctx.args.reason
        })
        let embed = await action.execute();
        return {reply: {embeds: [embed]}, data: {member: ctx.args.member}}
    }

    public async after(message: Message, data: WarnCommandData) {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: message.guild.id}) as Settings
        if (!settings.warnsPunishments?.length) return
        let warnsCount = await this.db.manager.countBy(Case, {
            guildid: message.guild.id,
            userid: data.member.id,
            action: ModAction.Warn
        })
        let wp = settings.warnsPunishments.find(w => w.warns === warnsCount)
        if (!wp) return
        let options = {} as ModerationActionOptions
        options.guild = message.guild
        options.user = data.member.user
        options.member = data.member
        options.executor = message.guild.members.me
        options.duration = wp.punishment.duration ?? null
        options.reason = `${warnsCount} ${properties[settings.language?.interface ?? "en"].warns}`
        options.autoMod = true
        let wpAction: ModerationAction
        switch (wp.punishment.type) {
            case ModAction.Mute:
                wpAction = new MuteAction(options)
                break
            case ModAction.Kick:
                wpAction = new KickAction(options)
                break
            case ModAction.Ban:
                wpAction = new BanAction(options)
        }
        let embed = await wpAction.execute()
        if (embed) await message.channel.send({embeds: [embed]})
    }
}