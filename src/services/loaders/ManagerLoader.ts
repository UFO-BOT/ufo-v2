import fs from "fs";
import AbstractService from "@/abstractions/AbstractService";
import AbstractJob from "@/abstractions/AbstractJob";

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

    public loadJobs(path: string = process.cwd() + this.constants.paths.jobs): void {
        fs.readdirSync(path).forEach(async file => {
            let filePath = path + '/' + file;
            if(fs.lstatSync(filePath).isDirectory()) this.loadEvents(filePath)
            else {
                delete require.cache[require.resolve(filePath)]
                let j = require(filePath)?.default
                if(j?.scope === 'job') {
                    let job: AbstractJob = new j()
                    await job.execute()
                    setInterval(() => job.execute(), job.interval)
                }
            }
        })
    }
}