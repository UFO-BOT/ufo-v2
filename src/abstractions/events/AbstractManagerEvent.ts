import AbstractEvent from "@/abstractions/events/AbstractEvent";
import IEvent from "@/interfaces/EventInterface";

export default abstract class AbstractManagerEvent extends AbstractEvent implements IEvent {
    public static readonly scope = 'managerEvent'
}