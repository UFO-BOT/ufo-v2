import {Body, Controller, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards} from "@nestjs/common";
import {ApplicationCommandPermissions} from "discord.js";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import CommandSettings from "@/types/commands/CommandSettings";
import {GuildCategoriesDto} from "@/api/dto/guild/guild-categories.dto";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildCategoriesController extends Base {

    @Post(":id/categories/:category")
    async execute(@Req() request: GuildRequest, @Body() body: GuildCategoriesDto,
                  @Param("category") category: string) {
        category = category.toLowerCase()
        const commands = await this.manager.shards.first().eval((client, context) =>
                (client as typeof this.client).cache.commands.filter(cmd => cmd.category === context.category)
                    .map(cmd => cmd.config.en.name),
            {category})
        if(!commands) throw new NotFoundException("Category not found")
        if(!request.guild.settings.commands) request.guild.settings.commands = {}
        for (let command of commands) request.guild.settings.commands[command] = {
            name: command,
            enabled: body.enabled,
            deleteUsage: request.guild.settings.commands[command]?.deleteUsage ?? false,
            allowedRoles: request.guild.settings.commands[command]?.allowedRoles ?? [],
            forbiddenRoles: request.guild.settings.commands[command]?.forbiddenRoles ?? [],
            allowedChannels: request.guild.settings.commands[command]?.allowedChannels ?? [],
            forbiddenChannels: request.guild.settings.commands[command]?.forbiddenChannels ?? []
        }
        await request.guild.settings.save()
        await this.manager.shards.get(request.guild.shardId).eval((client, context) =>
            client.emit('updateCache', context.guildId), {guildId: request.guild.id})
        return {message: "Category updated successfully"}
    }

}