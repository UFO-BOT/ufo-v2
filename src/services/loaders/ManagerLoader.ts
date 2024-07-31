import fs from "fs";
import AbstractService from "@/abstractions/AbstractService";
import AbstractWatcher from "@/abstractions/AbstractWatcher";

export default class ManagerLoader extends AbstractService {
    public loadEvents(path: string = process.cwd() + this.constants.paths.eventsManager): void {
        fs.readdirSync(path).forEach(file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadEvents(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let ev = require(filePath)?.default
                if(ev?.scope === 'managerEvent') {
                    let event = new ev()
                    this.manager.on(event.name, (...params) => event.execute(...params))
                }
            }
        })
    }

    public loadWatchers(path: string = process.cwd() + this.constants.paths.jobs): void {
        fs.readdirSync(path).forEach(async file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadEvents(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let w = require(filePath)?.default
                if(w?.scope === 'watcher') {
                    let watcher: AbstractWatcher = new w()
                    await watcher.execute()
                    setInterval(() => watcher.execute(), watcher.interval)
                }
            }
        })
    }
}