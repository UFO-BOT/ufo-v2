import AbstractService from "@/abstractions/AbstractService";
import handlebars from "handlebars";
import TimeParser from "@/utils/TimeParser";

export default abstract class MessageTemplate extends AbstractService {
    protected constructor() {
        super();
        handlebars.registerHelper("date", options => {
            return TimeParser.formatTimestamp(options.fn(this), "f")
        })
    }

    public abstract compile(template: string): string | null
}