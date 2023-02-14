import {Controller, Get} from "@nestjs/common";
import Base from "@/abstractions/Base";

@Controller('commands')
export class CommandsController extends Base {

    @Get()
    async execute() {
        return await this.manager.shards.first().eval(client =>
            (client as typeof this.client).cache.commands.map(cmd => {
                return {
                    config: cmd.config,
                    options: cmd.options,
                    category: cmd.category,
                    defaultMemberPermissions: cmd.defaultMemberPermissions ?? [],
                    botPermissions: cmd.botPermissions ?? [],
                    boostRequired: Boolean(cmd.boostRequired)
                }
            })
        )
    }

}