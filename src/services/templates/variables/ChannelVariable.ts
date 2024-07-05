import {TextChannel} from "discord.js";
import TimeParser from "@/utils/TimeParser";

export default class ChannelVariable {
    public id: string
    public name: string
    public topic: string
    public mention: string
    public created: string

    constructor(channel: TextChannel) {
        this.id = channel.id as string
        this.name = channel.name
        this.topic = channel.topic
        this.mention = channel.toString()
        this.created = TimeParser.formatTimestamp(channel.createdTimestamp, "f")
    }
}