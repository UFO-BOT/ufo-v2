import fs from "fs";

export default class ManagerLoader {
    public static loadEvents(path: string = process.cwd() + '/dist/src/events/manager'): void {
        fs.readdirSync(path).forEach(file => {
            if(fs.lstatSync(path + '/' + file).isDirectory()) this.loadEvents(path + '/' + file)
            else {
                let ev = require(path + '/' + file)?.default
                if(ev?.scope === 'managerEvent') {
                    let event = new ev()
                    global.manager.on(event.name, event.execute)
                }
            }
        })
    }
}