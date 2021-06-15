import AbstractEvent from "@/abstractions/events/AbstractEvent";
import EventConfig from "@/types/EventConfig";

export default abstract class AbstractClientEvent extends AbstractEvent implements EventConfig {
    public static readonly scope = 'clientEvent'
}