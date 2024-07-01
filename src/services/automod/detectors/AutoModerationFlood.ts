import AutoModeration from "@/services/automod/AutoModeration";
import {Message, TextChannel} from "discord.js";
import {AutoModFloodOptions} from "@/types/automod/AutoModFlood";
import FloodDetection from "@/types/automod/FloodDetection";

export default class AutoModerationFlood extends AutoModeration {
    protected declare options: AutoModFloodOptions

    constructor(public message: Message) {
        super(message, 'flood');
    }

    protected async detect(): Promise<boolean> {
        if (!this.client.cache.detections.get(this.message.guild.id))
            this.client.cache.detections.set(this.message.guild.id, {})
        let detections = this.client.cache.detections.get(this.message.guild.id)
        if (!detections[this.message.author.id]) detections[this.message.author.id] = {
            flood: {messages: [], symbols: 0, first: new Date()}
        }
        if (Number(new Date()) - Number(detections[this.message.author.id].flood?.first) > 60000)
            detections[this.message.author.id].flood = {
                messages: [],
                symbols: 0,
                first: new Date()
            }
        let detection: FloodDetection = detections[this.message.author.id].flood
        detection.messages.push(this.message.id)
        detection.symbols += this.message.content.length
        if (detection.messages.length <= this.options.messages && detection.symbols <= this.options.symbols) return false
        let channel = this.message.channel as TextChannel
        let messages = detection.messages
        detection.messages = []
        detection.symbols = 0
        if (this.deleteMessages) await channel.bulkDelete(messages)
        return true
    }
}