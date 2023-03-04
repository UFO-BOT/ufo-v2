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
        let items = await this.db.manager.findBy(Item, {guildid: request.guild.id})
        return items.map(item => {return {
            name: item.name,
            description: item.description,
            price: item.price,
            xp: item.xp,
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
        let item = new Item()
        item.guildid = request.guild.id;
        Object.assign(item, body);
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
        Object.assign(item, body);
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