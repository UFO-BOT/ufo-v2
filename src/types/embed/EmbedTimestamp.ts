export default interface EmbedTimestamp {
    type: "custom" | "current" | "template"
    date?: Date
    template?: string
}