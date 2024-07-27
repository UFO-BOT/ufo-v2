import handlebars from "handlebars";
import TimeParser from "@/utils/TimeParser";
import Language from "@/types/Language";

export default abstract class MessageTemplate {
    protected constructor(language?: Language) {
        handlebars.registerHelper("date", options => {
            return TimeParser.formatTimestamp(options.fn(this), "f")
        })
        handlebars.registerHelper("duration", options => {
            let duration = Number(options.fn(this))
            if (isNaN(duration) || duration === 0) return ''
            return TimeParser.stringify(duration, language)
        })
        handlebars.registerHelper("eq", (value1, value2, options) => {
            if (Number(value1) === Number(value2)) return options.fn(this)
            else return options.inverse(this)
        })
        handlebars.registerHelper("gt", (value1, value2, options) => {
            if (Number(value1) > Number(value2)) return options.fn(this)
            else return options.inverse(this)
        })
        handlebars.registerHelper("gte", (value1, value2, options) => {
            if (Number(value1) >= Number(value2)) return options.fn(this)
            else return options.inverse(this)
        })
        handlebars.registerHelper("lt", (value1, value2, options) => {
            if (Number(value1) < Number(value2)) return options.fn(this)
            else return options.inverse(this)
        })
        handlebars.registerHelper("lte", (value1, value2, options) => {
            if (Number(value1) <= Number(value2)) return options.fn(this)
            else return options.inverse(this)
        })
    }

    public abstract compile(template: string): string | null
}