import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import fs from "fs";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import AbstractService from "@/abstractions/AbstractService";

export default class ClientLoader extends AbstractService {
    public loadCommands(path: string = process.cwd() + this.constants.paths.commands): void {
        fs.readdirSync(path).forEach(file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadCommands(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let cmd = require(filePath)?.default
                if(cmd?.scope === 'command') {
                    let command: AbstractCommand = new cmd(this.client)
                    this.client.cache.commands.set(command.config.en.name, command)
                }
            }
        })
    }

    public loadEvents(path: string = process.cwd() + this.constants.paths.eventsShard): void {
        fs.readdirSync(path).forEach(file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadEvents(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let ev = require(filePath)?.default
                if(ev?.scope === 'clientEvent') {
                    let event: AbstractClientEvent = new ev(this.client)
                    this.client.on(event.name, (...params) => event.execute(...params))
                }
            }
        })
    }
}