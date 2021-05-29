import Discord, { Structures } from "discord.js";

Structures.extend('Message', Message => {
    return class ExtendedMessage extends Message {
        public guild: Discord.Guild

        constructor(client:Discord.Client, data:any, channel: Discord.TextChannel | Discord.NewsChannel) {
            super(client, data, channel);
            this.guild = new Discord.Guild(client, data.guild)
        }
    }
})