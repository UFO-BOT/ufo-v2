import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Giveaway from "@/types/database/Giveaway";
import GiveawayEnding from "@/services/endings/GiveawayEnding";

export default class EndGiveawayEvent extends AbstractClientEvent implements EventConfig {
    public name = 'endGiveaway'

    public async execute(msg: string): Promise<any> {
        let giveaway = await this.db.manager.findOneBy(Giveaway, {message: msg});
        if(!giveaway) return;
        let ending = new GiveawayEnding(giveaway);
        await ending.end();
    }
}