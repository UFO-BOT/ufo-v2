import fs from "fs";

export default class ManagerLoader {
    public loadEvents(path: string = process.cwd() + global.constants.paths.eventsManager): void {
        fs.readdirSync(path).forEach(file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadEvents(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let ev = require(filePath)?.default
                if(ev?.scope === 'managerEvent') {
                    let event = new ev()
                    global.manager.on(event.name, event.execute)
                }
            }
        })
    }
}