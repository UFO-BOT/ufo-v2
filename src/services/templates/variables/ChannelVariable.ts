import {TextChannel} from "discord.js";

export default class ChannelVariable {
    public id: string
    public name: string
    public topic: string
    public mention: string
    public created: number

    constructor(channel: TextChannel) {
        this.id = channel.id as string
        this.name = channel.name
        this.topic = channel.topic
        this.mention = channel.toString()
        this.created = channel.createdTimestamp
    }
}