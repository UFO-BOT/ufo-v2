import AbstractJob from "@/abstractions/AbstractJob";
import Mute from "@/types/database/Mute";

export default class MutesJob extends AbstractJob {
    public interval = 60000

    public async execute(): Promise<any> {
        let date = new Date(Date.now()+60000)
        let mutes = await this.db.mongoManager.findBy(Mute, {ends: {$lte: date}})
        for(let mute of mutes) {
            let time = mute.ends.getTime() - Date.now();
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