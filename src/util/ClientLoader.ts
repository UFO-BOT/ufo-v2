import fs from "fs";

import AbstractEvent from "@/abstractions/AbstractEvent";
import AbstractCommand from "@/abstractions/AbstractCommand";

export default class ClientLoader {
    public static isUtil = true

    // TODO: make it more beautiful
    public static loadCommands(path: string = 'dist/src/commands'): Array<AbstractCommand> {
        path = process.cwd() + '/' + path
        function load(path: string): Array<AbstractCommand> {
            let result: Array<AbstractCommand> = []
            fs.readdirSync(path).forEach(file => {
                if(fs.lstatSync(path + '/' + file).isDirectory()) result.push(...load(path + '/' + file))
                else {
                    let cmd = require(path + '/' + file)?.default
                    if(cmd?.isCommand) {
                        let command = new cmd()
                        result.push(command)
                        global.bot.cache.commands.set(command.name, command)
                    }
                }
            })
            return result;
        }
        return load(path);
    }

    public static loadEvents(path: string = 'dist/src/events/shard'): Array<AbstractEvent> {
        path = process.cwd() + '/' + path
        function load(path: string): Array<AbstractEvent> {
            let result: Array<AbstractEvent> = []
            fs.readdirSync(path).forEach(file => {
                if(fs.lstatSync(path + '/' + file).isDirectory()) result.push(...load(path + '/' + file))
                else {
                    let ev = require(path + '/' + file)?.default
                    if(ev?.isEvent) {
                        let event = new ev()
                        result.push(event)
                        global.bot.on(event.name, event.execute)
                    }
                }
            })
            return result;
        }
        return load(path);
    }
}