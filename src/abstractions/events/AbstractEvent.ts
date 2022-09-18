import EventConfig from "@/types/EventConfig";
import Base from "@/abstractions/Base";

export default abstract class AbstractEvent extends Base implements EventConfig {
    public abstract name: string

    abstract execute(...params: any): Promise<any>
}