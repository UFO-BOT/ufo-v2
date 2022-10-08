import AbstractJob from "@/abstractions/AbstractJob";
import Ban from "@/types/database/Ban";

export default class BansJob extends AbstractJob {
    public interval = 60000

    public async execute(): Promise<any> {
        let date = new Date(Date.now()+60000)
        let bans = await this.db.mongoManager.findBy(Ban, {ends: {$lte: date}})
        for(let ban of bans) {
            let time = ban.ends.getTime() - Date.now();
            if(new Date() < ban.ends && ban.timeout) continue;
            ban.timeout = true;
            await ban.save();
            setTimeout(async () => {
                await this.manager.broadcastEval((client, context) =>
                        client.emit("endBan", context.guild, context.user),
                    {context: {guild: ban.guildid, user: ban.userid}})
            }, time)
        }
    }
}