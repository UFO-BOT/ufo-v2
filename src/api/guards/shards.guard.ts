import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException
} from "@nestjs/common";
import Base from "@/abstractions/Base";

@Injectable()
export class ShardsGuard extends Base implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.manager.shards.size)
            throw new InternalServerErrorException("Shards are still being created, please wait")
        return true
    }

}