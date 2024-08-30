import {Message} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Client from "@/structures/Client";

export default function SetInteraction(client: Client, interaction: AbstractInteraction, message: Message) {
    client.cache.interactions.set(interaction.id, interaction);
    if(interaction.lifetime) {
        setTimeout(async () => {
            if(interaction.end && client.cache.interactions.has(interaction.id)) {
                await interaction.end().catch(() => {})
                await message.edit({embeds: [interaction.embed], components: []}).catch(() => {})
            }
            client.cache.interactions.delete(interaction.id)
        }, interaction.lifetime)
    }
}