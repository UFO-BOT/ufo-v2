import AbstractJob from "@/abstractions/AbstractJob";
import Giveaway from "@/types/database/Giveaway";

export default class GiveawaysJob extends AbstractJob {
    public interval = 60000

    public async execute(): Promise<any> {
        let giveaways = await this.db.mongoManager.findBy(Giveaway, {})
        for(let giveaway of giveaways) {
            let time = giveaway.duration - (Date.now() - giveaway.started);
            if(time > 0 && giveaway.timeout) continue;
            if(time <= 60000) {
                giveaway.timeout = true;
                await this.db.manager.save(giveaway);
                setTimeout(async () => {
                    await this.manager.broadcastEval((client, context) =>
                        client.emit("endGiveaway", context.msg), {context: {msg: giveaway.message}})
                }, time)
            }
        }
    }
}
