import Base from "@/abstractions/Base";

export default abstract class AbstractWatcher extends Base {
    public static readonly scope = 'watcher'

    public abstract interval: number

    public abstract execute(): Promise<any>
}