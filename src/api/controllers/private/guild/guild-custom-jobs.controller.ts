import {
    BadRequestException,
    Body,
    Controller, Delete,
    ForbiddenException,
    NotFoundException, Param,
    Patch,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {Throttle} from "@nestjs/throttler";
import {GuildCustomJobDto} from "@/api/dto/guild/guild-custom-job.dto";

@Controller('guilds/:id/custom-jobs')
@Throttle(15, 60)
@UseGuards(AuthGuard, GuildGuard)
export class GuildCustomJobsController extends Base {

    @Post()
    async create(@Req() request: GuildRequest, @Body() body: GuildCustomJobDto) {
        let count = request.guild.settings.customJobs?.length
        let limit = request.guild?.settings?.boost ?
            this.constants.limits.customJobs.boost : this.constants.limits.customJobs.standard
        if(count >= limit)
            throw new ForbiddenException("Custom jobs limit reached")
        if (request.guild.settings.customJobs?.find(cj => cj.name === body.name))
            throw new BadRequestException("Another custom job has this name")
        if(body.salary.min > body.salary.max)
            throw new BadRequestException("salary.low value must be less than or equal to salary.high value")
        body.requiredRoles = body.requiredRoles.filter(r => request.guild.roles.find(role => role.id === r))
        if (!request.guild.settings.boost) body.iconUrl = null
        if (!request.guild.settings?.customJobs) request.guild.settings.customJobs = []
        request.guild.settings.customJobs.push(body)
        await request.guild.settings.save();
        return {message: "Custom job created successfully"}
    }

    @Patch(':name')
    async update(@Req() request: GuildRequest, @Body() body: GuildCustomJobDto, @Param('name') name: string) {
        let job = request.guild.settings.customJobs?.findIndex(cj => cj.name === name)
        if(job === -1) throw new NotFoundException("Custom job not found")
        let IsJob = request.guild.settings.customJobs?.findIndex(cj => cj.name === body.name)
        if (IsJob !== -1 && job !== IsJob)
            throw new BadRequestException("Another custom job has this name")
        if(body.salary.min > body.salary.max)
            throw new BadRequestException("salary.low value must be less than or equal to salary.high value")
        body.requiredRoles = body.requiredRoles.filter(r => request.guild.roles.find(role => role.id === r))
        if (!request.guild.settings.boost) body.iconUrl = null
        request.guild.settings.customJobs[job] = body
        await request.guild.settings.save();
        return {message: "Custom job updated successfully"}
    }

    @Delete(':name')
    async delete(@Req() request: GuildRequest, @Param('name') name: string) {
        let job = request.guild.settings.customJobs?.find(cj => cj.name === name)
        if(!job) throw new NotFoundException("Custom job not found")
        request.guild.settings.customJobs.splice(request.guild.settings.customJobs.indexOf(job), 1)
        await request.guild.settings.save();
        return {message: "Item deleted successfully"}
    }

}