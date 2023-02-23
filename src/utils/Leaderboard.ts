import {Guild, GuildBan, GuildBasedChannel, GuildMember, Role, User} from "discord.js";
import Balance from "@/types/database/Balance";

interface GetGuildLeaderboardResult {
    page: number
    pageCount: number
    leaders: Array<Balance>
}

export default class Leaderboard {
    public static async getGuildLeaderboard (guildID: string, sort: 'balance' | 'xp' = 'balance', page: number = 1):
        Promise<GetGuildLeaderboardResult>  {
        let count = await global.db.manager.countBy(Balance, {guildid: guildID});
        let pageCount = Math.ceil(count/10);
        if(page > pageCount) page = pageCount;
        let leaders: Array<Balance> = await global.db.mongoManager.createCursor(Balance, {guildid: guildID})
            .sort({[sort]: -1})
            .skip((page-1)*10)
            .limit(10)
            .toArray();
        return {page, pageCount, leaders};
    }

    public static async leaderboardRank(guildID: string, userID: string): Promise<number> {
        let result = await global.db.mongoManager.aggregate(Balance, [
            {
                $match: {
                    guildid: guildID,
                }
            },
            {
                $setWindowFields: {
                    sortBy: {balance: -1},
                    output: {
                        number: {
                            $documentNumber: {}
                        }
                    }
                }
            },
            {
                $match: {
                    userid: userID,
                }
            }
        ]).toArray()
        return result[0]?.number ?? null;
    }
}