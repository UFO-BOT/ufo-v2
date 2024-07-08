import Embed from "@/types/embed/Embed";

export default interface Greeting {
    enabled: boolean
    message?: string
    embed?: Embed
}