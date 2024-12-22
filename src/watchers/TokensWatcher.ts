import AbstractWatcher from "@/abstractions/AbstractWatcher";

export default class TokensWatcher extends AbstractWatcher {
    public interval = 3600000

    public async execute(): Promise<any> {
        let tokens = this.manager.cache.tokens.filter(t => new Date(t.lastUsed.getTime() + 3600000) < new Date())
        for (let token of tokens.keys()) this.manager.cache.tokens.delete(token)
    }
}