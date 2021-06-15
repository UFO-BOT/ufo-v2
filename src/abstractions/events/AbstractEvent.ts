import EventConfig from "@/types/EventConfig";

export default abstract class AbstractEvent implements EventConfig {
    public abstract name: string

    abstract execute(...params: any): Promise<any>
}