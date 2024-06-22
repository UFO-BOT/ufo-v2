import {DataSource} from "typeorm";
import Settings from "@/types/database/Settings";
import Balance from "@/types/database/Balance";
import Item from "@/types/database/Item";
import Coupon from "@/types/database/Coupon";
import Giveaway from "@/types/database/Giveaway";
import Case from "@/types/database/Case";
import Mute from "@/types/database/Mute";
import Ban from "@/types/database/Ban";

export default class MongoDB extends DataSource {
    public url: string

    constructor(url: string, dbName: string) {
        super({
            type: "mongodb",
            database: dbName,
            url: url,
            synchronize: true,
            logging: true,
            retryWrites: true,
            entities: [
                Settings,
                Balance,
                Item,
                Coupon,
                Giveaway,
                Case,
                Mute,
                Ban
            ]
        })
        global.db = this;
    }
}