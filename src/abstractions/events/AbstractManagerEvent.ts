import AbstractEvent from "@/abstractions/events/AbstractEvent";
import EventConfig from "@/types/EventConfig";

export default abstract class AbstractManagerEvent extends AbstractEvent implements EventConfig {
    public static readonly scope = 'managerEvent'
}