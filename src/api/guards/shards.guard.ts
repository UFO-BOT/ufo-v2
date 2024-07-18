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
        let request = context.switchToHttp().getRequest()
        if (!this.manager.shards.size ||
            (this.manager.shards.size < Number(process.env.TOTAL_SHARDS) && request.path.includes('private')))
            throw new InternalServerErrorException("Shards are still being created, please wait")
        return true
    }

}