import Interaction from "@/types/interactions/Interaction";
import Discord, {ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder, SnowflakeUtil} from "discord.js";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import Base from "@/abstractions/Base";

export default abstract class AbstractInteraction extends Base implements Interaction {
    public id: string
    public users: Array<string>
    public data: any
    public embed: EmbedBuilder
    public abstract lifetime: number
    protected settings: GuildSettingsCache
    protected abstract components: any
    protected abstract props: any

    protected constructor(users: Array<string>, data: any, settings: GuildSettingsCache) {
        super()
        this.settings = settings;
        this.users = users;
        this.data = data;
        this.id = SnowflakeUtil.generate().toString()
    }

    public abstract execute(interaction: Discord.Interaction, action: string): Promise<InteractionExecutionResult>
    public async end?(): Promise<any>

    public row(): ActionRowBuilder<MessageActionRowComponentBuilder> {
        return new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(Object.values(this.components))
    }
}