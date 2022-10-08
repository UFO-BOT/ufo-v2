import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Ban from "@/types/database/Ban";
import BanEnding from "@/services/endings/BanEnding";

export default class EndBanEvent extends AbstractClientEvent implements EventConfig {
    public name = 'endBan'

    public async execute(guild: string, user: string): Promise<any> {
        let ban = await this.db.manager.findOneBy(Ban, {guildid: guild, userid: user});
        if(!ban) return;
        let ending = new BanEnding(ban);
        await ending.end();
    }
}