import DevCommandConfig from "@/types/DevCommandConfig";
import CommandMessage from "@/types/CommandMessage";
import CommandFlag from "@/types/CommandFlag";


export default abstract class AbstractDevCommand implements DevCommandConfig {
    public static readonly scope = 'devCommand'

    public abstract name: string
    public abstract aliases: Array<string>
    public flags?: Array<CommandFlag>
    public allowedRoles?: Array<string>

    public abstract execute(cmd: CommandMessage): Promise<any>
}