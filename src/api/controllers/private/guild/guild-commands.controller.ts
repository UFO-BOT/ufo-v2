import {Body, Controller, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards} from "@nestjs/common";
import {ApplicationCommandPermissions, ApplicationCommandPermissionType} from "discord.js";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildCommandsDto} from "@/api/dto/guild/guild-commands.dto";
import CommandSettings from "@/types/commands/CommandSettings";
import {Throttle} from "@nestjs/throttler";

@Controller('guilds')
@Throttle(15, 60)
@UseGuards(AuthGuard, GuildGuard)
export class GuildCommandsController extends Base {

    @Post(":id/commands/:command")
    async execute(@Req() request: GuildRequest, @Body() body: GuildCommandsDto,
                  @Param("command") command: string) {
        command = command.toLowerCase()
        const exists = await this.manager.shards.first().eval((client, context) =>
            !!(client as typeof this.client).cache.commands.get(context.command),
        {command})
        if(!exists) throw new NotFoundException("Command not found")
        let cmd: CommandSettings = {name: command,
            enabled: body.enabled,
            deleteUsage: body.deleteUsage,
            allowedRoles: [], forbiddenRoles: [], allowedChannels: [], forbiddenChannels: []}
        let permissions: Array<ApplicationCommandPermissions> = [];
        let allRoles = true;
        let allChannels = true;
        body.allowedRoles.forEach(role => {
            if(!request.guild.roles.find(r => r.memberManageable && r.id === role)) return;
            allRoles = false;
            cmd.allowedRoles.push(role)
            permissions.push({
                id: role,
                type: ApplicationCommandPermissionType.Role,
                permission: true
            })
        })
        body.forbiddenRoles.forEach(role => {
            if(!request.guild.roles.find(r => r.memberManageable && r.id === role)) return;
            cmd.forbiddenRoles.push(role)
            permissions.push({
                id: role,
                type: ApplicationCommandPermissionType.Role,
                permission: false
            })
        })
        body.allowedChannels.forEach(chan => {
            if(!request.guild.channels.find(c => c.id === chan)) return;
            allChannels = false;
            cmd.allowedChannels.push(chan)
            permissions.push({
                id: chan,
                type: ApplicationCommandPermissionType.Channel,
                permission: true
            })
        })
        body.forbiddenChannels.forEach(chan => {
            if(!request.guild.channels.find(c => c.id === chan)) return;
            cmd.forbiddenChannels.push(chan)
            permissions.push({
                id: chan,
                type: ApplicationCommandPermissionType.Channel,
                permission: false
            })
        })
        if(!allRoles) permissions.push({
            id: request.guild.id,
            type: ApplicationCommandPermissionType.Role,
            permission: false
        })
        if(!allChannels) permissions.push({
            id: String(BigInt(request.guild.id) - 1n),
            type: ApplicationCommandPermissionType.Channel,
            permission: false
        })
        try {
            await this.manager.shards.first().eval((client, context) =>
                client.application.commands.cache.find(c => c.name === context.name).permissions.set({
                    guild: context.guildId,
                    permissions: context.permissions,
                    token: context.token
                }), {name: cmd.name, guildId: request.guild.id, permissions, token: request.token})
        } catch(e) {
            throw new UnauthorizedException("Unable to update slash command using access token")
        }
        if(!request.guild.settings.commands) request.guild.settings.commands = {}
        request.guild.settings.commands[command] = cmd;
        await request.guild.settings.save()
        await this.manager.shards.get(request.guild.shardId).eval((client, context) =>
            client.emit('updateCache', context.guildId), {guildId: request.guild.id})
        return {message: "Command updated successfully"}
    }

}