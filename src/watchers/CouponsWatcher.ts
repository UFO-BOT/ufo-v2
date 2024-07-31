import AbstractWatcher from "@/abstractions/AbstractWatcher";
import Coupon from "@/types/database/Coupon";

export default class CouponsWatcher extends AbstractWatcher {
    public interval = 60000

    public async execute(): Promise<any> {
        await this.db.mongoManager.createCursor(Coupon, {}).forEach(coupon => {
            if(coupon.created + coupon.duration < Date.now()) this.db.mongoManager.deleteOne(Coupon, coupon)
        })
    }
}