import IDevCommand from "@/interfaces/DevCommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";
import ICommandFlag from "@/interfaces/CommandFlagInterface";


export default abstract class AbstractDevCommand implements IDevCommand {
    public static readonly scope = 'devCommand'

    public abstract name: string
    public abstract aliases: Array<string>
    public flags?: Array<ICommandFlag>
    public allowedRoles?: Array<string>

    public abstract execute(cmd: ICommandMessage): Promise<any>
}