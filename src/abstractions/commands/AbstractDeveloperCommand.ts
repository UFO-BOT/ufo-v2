import Base from "@/abstractions/Base";
import DeveloperCommand from "@/types/commands/DeveloperCommand";
import {Message} from "discord.js";

export default abstract class AbstractDeveloperCommand extends Base implements DeveloperCommand {
    public static readonly scope = 'devCommand'

    public abstract name: string
    public abstract aliases: Array<string>
    public allowedUsers?: Array<string>

    public abstract execute(message: Message, args: Array<string>): Promise<any>
}