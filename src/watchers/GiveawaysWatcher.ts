import {LessThanOrEqual} from "typeorm";
import AbstractWatcher from "@/abstractions/AbstractWatcher";
import Giveaway from "@/types/database/Giveaway";

export default class GiveawaysWatcher extends AbstractWatcher {
    public interval = 60000

    public async execute(): Promise<any> {
        let date = new Date(Date.now()+60000)
        let giveaways = await this.db.mongoManager
            .find(Giveaway, {where: {ends: {$lte:date}}}) as Array<Giveaway>
        for(let giveaway of giveaways) {
            let time = giveaway.ends.getTime() - Date.now();
            let guild = await this.manager.oneShardEval((client, context)  => {
                return client.guilds.cache.get(context.id);
            }, {context: {id: giveaway.guildid}});
            if(!guild) {
                await giveaway.remove()
                continue
            }
            if(time > -30000 && giveaway.timeout) continue;
            if(time <= 60000) {
                giveaway.timeout = true
                await giveaway.save()
                setTimeout(async () => {
                    await this.manager.broadcastEval((client, context) =>
                        client.emit("endGiveaway", context.msg), {context: {msg: giveaway.message}})
                }, time)
            }
        }
    }
}
