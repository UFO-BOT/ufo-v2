import Greeting from "@/types/greetings/Greeting";
import GuildGreeting from "@/types/greetings/GuildGreeting";

export default interface GuildGreetings {
    join: GuildGreeting
    leave: GuildGreeting
    dm: Greeting
    joinRoles: Array<string>
}