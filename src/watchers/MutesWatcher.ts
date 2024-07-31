import {LessThanOrEqual} from "typeorm";
import AbstractWatcher from "@/abstractions/AbstractWatcher";
import Mute from "@/types/database/Mute";

export default class MutesWatcher extends AbstractWatcher {
    public interval = 60000

    public async execute(): Promise<any> {
        let date = new Date(Date.now()+60000)
        let mutes = await this.db.mongoManager.find(Mute, {where: {ends: {$lte: date}}}) as Array<Mute>
        for(let mute of mutes) {
            let time = mute.ends.getTime() - Date.now();
            let guild = await this.manager.oneShardEval((client, context)  => {
                return client.guilds.cache.get(context.id);
            }, {context: {id: mute.guildid}});
            if(!guild) return mute.remove();
            if(new Date() < mute.ends && mute.timeout) continue;
            mute.timeout = true;
            await mute.save();
            setTimeout(async () => {
                await this.manager.broadcastEval((client, context) =>
                    client.emit("endMute", context.guild, context.user),
                    {context: {guild: mute.guildid, user: mute.userid}})
            }, time)
        }
    }
}