export default class PropertyParser {
    public data: Record<string, any>

    constructor(data: any) {
        this.data = data
    }

    public parse(data: Record<string, string>) {
        let stringify = JSON.stringify(this.data);
        for(let i in data) {
            stringify = stringify.replace(new RegExp(`{{${i}}}`, "gmi"), data[i]);
        }
        this.data = JSON.parse(stringify);
    }
}