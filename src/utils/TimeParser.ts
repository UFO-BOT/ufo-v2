interface parseOutput {
    duration: number
    noMatches: boolean
}

interface allOutput {
    duration: number
    string: string
    noMatches: boolean
}

export default class TimeParser {
    public static isUtil = true

    public static parse(arg: string, language: 'ru' | 'en' = 'ru'): parseOutput {
        let lang = language === 'ru' ? 1 : 0
        const matchers: Record<string, Array<RegExp>> = {
            seconds: [/[0-9]+s(ec(ond(s)?)?)?/, /[0-9]+с(ек(унд(ы)?)?)?/],
            minutes: [/[0-9]+m(in(ute(s)?)?)?/, /[0-9]+м(ин(ут([аы])?)?)?/],
            hours: [/[0-9]+h(our(s)?)?/, /[0-9]+ч(ас([аов])?)?/],
            days: [/[0-9]+d(ay(s)?)?/, /[0-9]+д(ень|ня|ней)?/],
            weeks: [/[0-9]+w(eek(s)?)?/, /[0-9]+н(ед(ел([яьи]))?)?/],
            months: [/[0-9]+mo(nth(s)?)?/, /[0-9]+ме(с(яц(а)?)?)?/],
            years: [/[0-9]+y(ear(s)?)?/, /[0-9]+((г(од(а)?)?)|(л(ет)?))/]
        }
        const replacers: Record<string, Array<RegExp>> = {
            seconds: [/s(ec(ond(s)?)?)?/, /с(ек(унд(ы)?)?)?/],
            minutes: [/m(in(ute(s)?)?)?/, /м(ин(ут([аы])?)?)?/],
            hours: [/h(our(s)?)?/, /ч(ас([аов])?)?/],
            days: [/d(ay(s)?)?/, /д(ень|ня|ней)?/],
            weeks: [/w(eek(s)?)?/, /н(ед(ел([яьи]))?)?/],
            months: [/mo(nth(s)?)?/, /ме(с(яц(а)?)?)?/],
            years: [/y(ear(s)?)?/, /((г(од(а)?)?)|(л(ет)?))/]
        }
        const multipliers: Record<string, number> = {
            seconds: 1000,
            minutes: 60000,
            hours: 3600000,
            days: 86400000,
            weeks: 604800000,
            months: 2592000000,
            years: 31536000000
        }
        let output = {
            duration: 0,
            noMatches: true
        }
        Object.keys(matchers).reverse().forEach(unit => {
            let search = matchers[unit][lang];
            let match = arg.match(search);
            let time;
            if (match) {
                time = Number(match[0].replace(replacers[unit][lang], ''));
                output.duration += time * multipliers[unit];
                arg = arg.replace(search, '');
                output.noMatches = false;
            }
        })
        return output;
    }

    public static stringify(duration: number, language: 'ru' | 'en' = 'ru', accusative: boolean = false) {
        let lang = language === 'ru' ? 0 : 2;
        if(accusative && language === 'ru') lang = 1;
        let output = '';
        const dividers: Record<string, number> = {
            seconds: 1000,
            minutes: 60000,
            hours: 3600000,
            days: 86400000,
            weeks: 604800000,
            months: 2592000000,
            years: 31536000000
        }
        const u: Record<string, Record<string, Array<string>>> = {
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
        if(duration < 1000) return '0 ' + u.seconds.five[lang];
        Object.keys(dividers).reverse().forEach(unit => {
            let divider = dividers[unit];
            if(Math.floor(duration / divider) > 0) {
                let number = Math.floor(duration / divider);
                let str = String(number) + ' ';
                if(this.numberLastDigits(number, 2) < 11 ||  this.numberLastDigits(number, 2) > 19) {
                    let lastDigit = this.numberLastDigits(number, 1);
                    if (lastDigit === 1) str += u[unit].one[lang]
                    else if (lastDigit >= 2 && lastDigit <= 4) str += u[unit].twoFour[lang]
                    else if (lastDigit >= 5 || lastDigit === 0) str += u[unit].five[lang]
                }
                else {
                    str += u[unit].five[lang];
                }
                output += str + ' ';
                duration -= number * divider;
            }
        })
        output = output.trim();
        return output;
    }

    public static all (arg: string, language: 'ru' | 'en' = 'en', accusative: boolean = false): allOutput {
        let parsed = this.parse(arg, language);
        return {
            duration: parsed.duration,
            noMatches: parsed.noMatches,
            string: this.stringify(parsed.duration, language, accusative)
        }
    }

    public static numberLastDigits (number: number, count: number = 1) {
        let power = 10 ** count;
        return number - Math.floor(number/power)*power
    }
}