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
    }

    public abstract compile(template: string): string | null
}