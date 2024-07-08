import EmbedAuthor from "@/types/embed/EmbedAuthor";
import EmbedField from "@/types/embed/EmbedField";
import EmbedFooter from "@/types/embed/EmbedFooter";
import EmbedTimestamp from "@/types/embed/EmbedTimestamp";

export default interface Embed {
    enabled: boolean
    color?: `#${string}`
    author?: EmbedAuthor
    title?:  string
    url?: string
    description?: string
    fields?: Array<EmbedField>
    image?: string
    thumbnail?: string
    footer?: EmbedFooter
    timestamp?: EmbedTimestamp
}