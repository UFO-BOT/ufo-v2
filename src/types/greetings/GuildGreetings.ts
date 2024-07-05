import GuildGreeting from "@/types/greetings/GuildGreeting";

export default interface GuildGreetings {
    join: GuildGreeting
    leave: GuildGreeting
    dm: GuildGreeting
    joinRoles: Array<string>
}