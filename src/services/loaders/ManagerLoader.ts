import fs from "fs";
import AbstractService from "@/abstractions/AbstractService";

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
                    this.manager.on(event.name, event.execute)
                }
            }
        })
    }
}