import IEvent from "@/interfaces/EventInterface";

export default abstract class AbstractEvent implements IEvent {
    public abstract name: string

    abstract execute(...params: any): Promise<any>
}