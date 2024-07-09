export default interface EmbedTimestamp {
    type: null | "current" | "custom" | "template"
    date?: Date
    template?: string
}