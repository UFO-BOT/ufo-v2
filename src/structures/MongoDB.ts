import {DataSource} from "typeorm";
import Settings from "@/types/database/Settings";
import Balance from "@/types/database/Balance";
import Item from "@/types/database/Item";
import Coupon from "@/types/database/Coupon";
import Giveaway from "@/types/database/Giveaway";
import Case from "@/types/database/Case";

export default class MongoDB extends DataSource {
    public url: string

    constructor(url: string, dbName: string) {
        super({
            type: "mongodb",
            database: dbName,
            url: url,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            synchronize: true,
            logging: true,
            entities: [
                Settings,
                Balance,
                Item,
                Coupon,
                Giveaway,
                Case
            ]
        })
        global.db = this;
    }
}