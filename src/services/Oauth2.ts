import fetch from "node-fetch";

export default class Oauth2 {
    public static async getAccessToken(code: string) {
        const response = await fetch(process.env.DISCORD_API + "/oauth2/token", {
            method: "POST",
            body: JSON.stringify({
                client_id: "123",
                client_secret: process.env.SECRET
            })
        })
    }
}