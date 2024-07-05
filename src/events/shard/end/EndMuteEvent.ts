import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import GiveawayEnding from "@/services/endings/GiveawayEnding";
import Mute from "@/types/database/Mute";
import MuteEnding from "@/services/endings/MuteEnding";

export default class EndMuteEvent extends AbstractClientEvent implements EventConfig {
    public name = 'endMute'

    public async execute(guild: string, user: string): Promise<any> {
        let mute = await this.db.manager.findOneBy(Mute, {guildid: guild, userid: user});
        if(!mute) return;
        let ending = new MuteEnding(mute);
        await ending.end();
    }
}