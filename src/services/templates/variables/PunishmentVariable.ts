export default class PunishmentVariable {
    public ends: number

    constructor(public duration: number, public reason: string) {
        this.ends = this.duration ? (Date.now() + this.duration) : null
    }
}