import Base from "@/abstractions/Base";

export default abstract class AbstractJob extends Base {
    public static readonly scope = 'job'

    public abstract interval: number

    public abstract execute(): Promise<any>
}