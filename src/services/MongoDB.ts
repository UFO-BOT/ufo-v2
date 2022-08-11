import {DataSource} from "typeorm";
import Settings from "@/types/database/Settings";

export default class MongoDB {
    public url: string

    constructor(url: string) {
        this.url = url;
    }

    public connect() {
        global.mongo = new DataSource({
            type: "mongodb",
            database: process.env.DB_NAME,
            url: process.env.DB_URL,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            synchronize: true,
            logging: true,
            entities: [Settings]
        });
    }
}