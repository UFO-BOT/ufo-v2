import fs from "fs";

export default class ClientLoader {
    // TODO: make it more beautiful
    public static loadCommands(path: string = process.cwd() + '/' + 'dist/src/commands'): void {
        fs.readdirSync(path).forEach(file => {
            if(fs.lstatSync(path + '/' + file).isDirectory()) this.loadCommands(path + '/' + file)
            else {
                delete require.cache[require.resolve(path + '/' + file)]
                let cmd = require(path + '/' + file)?.default
                if(cmd?.scope === 'command') {
                    let command = new cmd()
                    global.bot.cache.commands.set(command.en.name, command)
                }
                else if(cmd?.scope === 'devCommand') {
                    let command = new cmd()
                    global.bot.cache.devCommands.set(command.name, command)
                }
            }
        })
    }

    public static loadEvents(path: string = process.cwd() + '/' + 'dist/src/events/shard'): void {
        fs.readdirSync(path).forEach(file => {
            if(fs.lstatSync(path + '/' + file).isDirectory()) this.loadEvents(path + '/' + file)
            else {
                delete require.cache[require.resolve(path + '/' + file)]
                let ev = require(path + '/' + file)?.default
                if(ev?.scope === 'clientEvent') {
                    let event = new ev()
                    global.bot.on(event.name, event.execute)
                }
            }
        })
    }
}