import {
    BadRequestException,
    Body,
    Controller, Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Patch,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import Item from "@/types/database/Item";
import {GuildItemDto} from "@/api/dto/guild/guild-item.dto";
import {ItemGuard} from "@/api/guards/item.guard";

@Controller('guilds/:id/items')
@UseGuards(AuthGuard, GuildGuard)
export class GuildItemsController extends Base {

    @Get()
    async list(@Req() request: GuildRequest) {
        let items = await this.db.manager.find(Item, {where: {guildid: request.guild.id}})
        return items.map(item => {return {
            name: item.name,
            description: item.description,
            thumbnailUrl: item.thumbnailUrl ?? null,
            requiredRoles: item.requiredRoles ?? [],
            requiredXp: item.requiredXp ?? 0,
            price: item.price,
            xp: typeof item.xp === 'number' ? {min: item.xp, max: item.xp} : item.xp,
            addRole: item.addRole,
            removeRole: item.removeRole
        }})
    }

    @UseGuards(ItemGuard)
    @Post()
    async create(@Req() request: GuildRequest, @Body() body: GuildItemDto) {
        let count = await this.db.manager.countBy(Item, {guildid: request.guild.id})
        if(count >= (request.guild?.settings?.boost ? 40 : 15))
            new ForbiddenException("Items limit reached")
        let IsItem = await this.db.manager.findOneBy(Item, {guildid: request.guild.id, name: body.name});
        if(IsItem) throw new BadRequestException("Another item has this name")
        if(body.xp.min > body.xp.max)
            throw new BadRequestException("xp.min value must be less than or equal to xp.high value")
        body.requiredRoles = body.requiredRoles.filter(r => request.guild.roles.find(role => role.id === r))
        let item = new Item()
        item.guildid = request.guild.id;
        Object.assign(item, body);
        item.name = item.name.trim();
        await item.save();
        return {message: "Item created successfully"}
    }

    @UseGuards(ItemGuard)
    @Patch(':name')
    async update(@Req() request: GuildRequest, @Body() body: GuildItemDto) {
        let item = await this.db.manager.findOneBy(Item, {guildid: request.guild.id, name: request.params.name})
        if(!item) throw new NotFoundException("Item not found")
        let IsItem = await this.db.manager.findOneBy(Item, {guildid: request.guild.id, name: body.name});
        if(IsItem && item.name !== IsItem.name) throw new BadRequestException("Another item has this name")
        if(body.xp.min > body.xp.max)
            throw new BadRequestException("xp.min value must be less than or equal to xp.high value")
        body.requiredRoles = body.requiredRoles.filter(r => request.guild.roles.find(role => role.id === r))
        Object.assign(item, body);
        item.name = item.name.trim()
        await item.save();
        return {message: "Item updated successfully"}
    }

    @Delete(':name')
    async delete(@Req() request: GuildRequest) {
        let item = await this.db.manager.findOneBy(Item, {guildid: request.guild.id, name: request.params.name})
        if(!item) throw new NotFoundException("Item not found")
        await item.remove();
        return {message: "Item deleted successfully"}
    }

}