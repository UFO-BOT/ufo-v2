import Greeting from "@/types/greetings/Greeting";

export default interface GuildGreeting extends Greeting {
    channel?: string
}