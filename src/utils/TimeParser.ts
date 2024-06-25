import Language from "@/types/Language";

type Unit = 'seconds'
| 'minutes'
| 'hours'
| 'days'
| 'weeks'
| 'months'
| 'years'

type UnitType = 'one'
| 'twoFour'
| 'five'

type TimestampType = ''
| 't'
| 'T'
| 'd'
| 'D'
| 'f'
| 'F'
| 'R'

interface AllOutput {
    duration: number
    string: string
}

export default class TimeParser {
    public static parse(arg: string, lang?: Language): number {
        let duration: number;
        if (!lang) return TimeParser.parse(arg, "en") ?? TimeParser.parse(arg, "ru")
        let matchers = this.matchers[lang];
        let replacers = this.replacers[lang];
        Object.keys(matchers).reverse().forEach(unit => {
            let search = matchers[unit as Unit];
            let match = arg.match(search);
            let time;
            if (match) {
                if(!duration) duration = 0;
                time = Number(match[0].replace(replacers[unit as Unit], ''));
                duration += time * this.multipliers[unit as Unit];
                arg = arg.replace(search, '');
            }
        })
        return duration;
    }

    public static stringify(duration: number, lang: Language = 'en', accusative: boolean = false): string {
        let l = lang === 'ru' ? 0 : 2;
        if(accusative && lang === 'ru') l = 1;
        let output = '';
        if(duration < 1000) return '0 ' + this.units.seconds.five[l];
        Object.keys(this.multipliers).reverse().forEach(unit => {
            let divider = this.multipliers[unit as Unit];
            if(Math.floor(duration / divider) > 0) {
                let number = Math.floor(duration / divider);
                let str = String(number) + ' ';
                if(this.numberLastDigits(number, 2) < 11 ||  this.numberLastDigits(number, 2) > 19) {
                    let lastDigit = this.numberLastDigits(number, 1);
                    if (lastDigit === 1) str += this.units[unit as Unit].one[l]
                    else if (lastDigit >= 2 && lastDigit <= 4) str += this.units[unit as Unit].twoFour[l]
                    else if (lastDigit >= 5 || lastDigit === 0) str += this.units[unit as Unit].five[l]
                }
                else {
                    str += this.units[unit as Unit].five[l];
                }
                output += str + ' ';
                duration -= number * divider;
            }
        })
        return output.trim();
    }

    public static all (arg: string, lang: Language = 'en', accusative: boolean = false): AllOutput {
        let parsed = this.parse(arg, lang);
        return {
            duration: parsed,
            string: this.stringify(parsed ?? 0, lang, accusative)
        }
    }

        public static formatTimestamp(timestamp: number, type: TimestampType): string {
        return `<t:${Math.floor(timestamp/1000)}${type?.length ? ":" + type : ""}>`;
    }

    private static numberLastDigits (number: number, count: number = 1) {
        let power = 10 ** count;
        return number - Math.floor(number/power)*power
    }

    private static matchers: Record<Language, Record<Unit, RegExp>> = {
        ru: {
            seconds: /[0-9]+с(ек(унд(ы)?)?)?/,
            minutes: /[0-9]+м(ин(ут([аы])?)?)?/,
            hours: /[0-9]+ч(ас([аов])?)?/,
            days: /[0-9]+д(ень|ня|ней)?/,
            weeks: /[0-9]+н(ед(ел([яьи]))?)?/,
            months: /[0-9]+ме(с(яц(а)?)?)?/,
            years: /[0-9]+((г(од(а)?)?)|(л(ет)?))/
        },
        en: {
            seconds: /[0-9]+s(ec(ond(s)?)?)?/,
            minutes: /[0-9]+m(in(ute(s)?)?)?/,
            hours: /[0-9]+h(our(s)?)?/,
            days: /[0-9]+d(ay(s)?)?/,
            weeks: /[0-9]+w(eek(s)?)?/,
            months: /[0-9]+mo(nth(s)?)?/,
            years: /[0-9]+y(ear(s)?)?/
        }
    }

    private static replacers: Record<Language, Record<Unit, RegExp>> = {
        ru: {
            seconds: /с(ек(унд(ы)?)?)?/,
            minutes: /м(ин(ут([аы])?)?)?/,
            hours: /ч(ас([аов])?)?/,
            days: /д(ень|ня|ней)?/,
            weeks: /н(ед(ел([яьи]))?)?/,
            months: /ме(с(яц(а)?)?)?/,
            years: /((г(од(а)?)?)|(л(ет)?))/
        },
        en: {
            seconds: /s(ec(ond(s)?)?)?/,
            minutes: /m(in(ute(s)?)?)?/,
            hours: /h(our(s)?)?/,
            days: /d(ay(s)?)?/,
            weeks: /w(eek(s)?)?/,
            months: /mo(nth(s)?)?/,
            years: /y(ear(s)?)?/
        }
    }

    private static units: Record<Unit, Record<UnitType, Array<string>>> = {
        seconds: {
            one: ['секунда', 'секунду', 'second'],
            twoFour: ['секунды', 'секунды', 'seconds'],
            five: ['секунд', 'секунд', 'seconds']
        },
        minutes: {
            one: ['минута', 'минуту', 'minute'],
            twoFour: ['минуты', 'минуты', 'minutes'],
            five: ['минут', 'минут', 'minutes']
        },
        hours: {
            one: ['час', 'час', 'hour'],
            twoFour: ['часа', 'часа', 'hours'],
            five: ['часов', 'часов', 'hours']
        },
        days: {
            one: ['день', 'день', 'day'],
            twoFour: ['дня', 'дня', 'days'],
            five: ['дней', 'дней', 'days']
        },
        weeks: {
            one: ['неделя', 'неделю', 'week'],
            twoFour: ['недели', 'недели', 'weeks'],
            five: ['недель', 'недель', 'weeks']
        },
        months: {
            one: ['месяц', 'месяц', 'month'],
            twoFour: ['месяца', 'месяца', 'months'],
            five: ['месяцев', 'месяцев', 'months']
        },
        years: {
            one: ['год', 'год', 'year'],
            twoFour: ['года', 'года', 'years'],
            five: ['лет', 'лет', 'years']
        }
    }

    private static multipliers: Record<Unit, number> = {
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
        days: 86400000,
        weeks: 604800000,
        months: 2592000000,
        years: 31536000000
    }
}