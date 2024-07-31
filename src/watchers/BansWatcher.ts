import AbstractWatcher from "@/abstractions/AbstractWatcher";
import Ban from "@/types/database/Ban";

export default class BansWatcher extends AbstractWatcher {
    public interval = 60000

    public async execute(): Promise<any> {
        let date = new Date(Date.now()+60000)
        let bans = await this.db.mongoManager.find(Ban, {where: {ends: {$lte: date}}}) as Array<Ban>
        for(let ban of bans) {
            let time = ban.ends.getTime() - Date.now();
            let guild = await this.manager.oneShardEval((client, context)  => {
                return client.guilds.cache.get(context.id);
            }, {context: {id: ban.guildid}});
            if(!guild) return ban.remove();
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