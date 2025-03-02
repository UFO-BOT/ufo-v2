import {Injectable, UnauthorizedException} from "@nestjs/common";
import fetch from "node-fetch";
import crypto from "crypto"
import {AccessToken} from "@/api/types/AccessToken";
import {RawOAuth2GuildData, RawUserData} from "discord.js/typings/rawDataTypes";
import Base from "@/abstractions/Base";
import Token from "@/types/database/Token";

@Injectable()
export class Oauth2Service extends Base {
    public async getAccessToken(clientID: string, redirectURI: string, code: string): Promise<AccessToken> {
        const response = await fetch(process.env.DISCORD_API + "/oauth2/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientID,
                client_secret: process.env.SECRET,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectURI
            })
        })
        let result = await response.json();
        if(response.status < 200 || response.status > 299)
            throw new UnauthorizedException("Redirect URI or access code is invalid")
        let user = await this.fetchUser(result.access_token)
        this.manager.cache.tokens.set(result.access_token, {userId: user.id, lastUsed: new Date()})
        return {
            accessToken: result.access_token,
            refreshToken: result.refresh_token,
            expiresIn: result.expires_in
        }
    }

    public async refreshToken(clientID: string, refreshToken: string): Promise<AccessToken> {
        const response = await fetch(process.env.DISCORD_API + "/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientID,
                client_secret: process.env.SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
        })
        let result = await response.json();
        if(response.status < 200 || response.status > 299)
            throw new UnauthorizedException("Refresh token is invalid")
        return {
            accessToken: result.access_token,
            refreshToken: result.refresh_token,
            expiresIn: result.expires_in
        }
    }

    public async revokeToken(clientID: string, accessToken: string) {
        const response = await fetch(process.env.DISCORD_API + "/oauth2/token/revoke", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientID,
                client_secret: process.env.SECRET,
                token: accessToken
            })
        })
        if(response.status < 200 || response.status > 299)
            throw new UnauthorizedException("Access token is invalid")
        this.manager.cache.tokens.delete(accessToken)
        return {message: "Token revoked successfully"}
    }

    public async getUser(accessToken: string): Promise<string> {
        let userId = this.manager.cache.tokens.get(accessToken)?.userId
        if (!userId) {
            let user = await this.fetchUser(accessToken)
            if (!user) throw new UnauthorizedException("Unauthorized")
            userId = user.id
        }
        this.manager.cache.tokens.set(accessToken, {userId, lastUsed: new Date()})
        return userId
    }

    public async fetchUser(accessToken: string): Promise<RawUserData> {
        const response = await fetch(process.env.DISCORD_API + "/users/@me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        if (!response.ok) return null
        return response.json();
    }

    public async getGuilds(accessToken: string): Promise<Array<RawOAuth2GuildData>> {
        const response = await fetch(process.env.DISCORD_API + "/users/@me/guilds", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        let result: Array<RawOAuth2GuildData> = await response.json();
        if(response.status < 200 || response.status > 299) throw new UnauthorizedException("Unauthorized")
        return result;
    }
}