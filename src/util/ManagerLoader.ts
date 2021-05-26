import fs from "fs";
import AbstractEvent from "@/abstractions/AbstractEvent";

export default class ManagerLoader {
    public static isManagerUtil = true

    public static loadEvents(path: string = 'dist/src/events/manager'): Array<AbstractEvent> {
        path = process.cwd() + '/' + path
        function load(path: string): Array<AbstractEvent> {
            let result: Array<AbstractEvent> = []
            fs.readdirSync(path).forEach(file => {
                if(fs.lstatSync(path + '/' + file).isDirectory()) result.push(...load(path + '/' + file))
                else {
                    let ev = require(path + '/' + file)?.default
                    if(ev?.isManagerEvent) {
                        let event = new ev()
                        result.push(event)
                        global.manager.on(event.name, event.execute)
                    }
                }
            })
            return result;
        }
        return load(path);
    }
}