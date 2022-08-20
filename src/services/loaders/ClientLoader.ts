import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import fs from "fs";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

export default class ClientLoader {
    public loadCommands(path: string = process.cwd() + global.constants.paths.commands): void {
        fs.readdirSync(path).forEach(file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadCommands(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let cmd = require(filePath)?.default
                if(cmd?.scope === 'command') {
                    let command: AbstractCommand = new cmd(global.client)
                    global.client.cache.commands.set(command.config.en.name, command)
                }
            }
        })
    }

    public loadEvents(path: string = process.cwd() + global.constants.paths.eventsClient): void {
        fs.readdirSync(path).forEach(file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadEvents(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let ev = require(filePath)?.default
                if(ev?.scope === 'clientEvent') {
                    let event: AbstractClientEvent = new ev(global.client)
                    global.client.on(event.name, event.execute)
                }
            }
        })
    }
}