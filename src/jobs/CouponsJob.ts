import AbstractJob from "@/abstractions/AbstractJob";
import Coupon from "@/types/database/Coupon";

export default class CouponsJob extends AbstractJob {
    public interval = 60000

    public async execute(): Promise<any> {
        await this.db.mongoManager.createCursor(Coupon, {}).forEach(coupon => {
            if(coupon.created + coupon.duration < Date.now()) this.db.mongoManager.deleteOne(Coupon, coupon)
        })
    }
}