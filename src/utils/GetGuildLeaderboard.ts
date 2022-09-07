import Balance from "@/types/database/Balance";

interface GetGuildLeaderboardResult {
    leaders: Array<Balance>
    page: number
    maxPage: number
}

export default async function GetGuildLeaderboard (guildID: string, sort: 'balance' | 'xp' = 'balance', page: number = 1):
    Promise<GetGuildLeaderboardResult> {
    let balances = await global.db.manager.findBy(Balance, {
        guildid: guildID
    })
    balances.sort((a, b) => b[sort] - a[sort])
    let maxPage = Math.ceil(balances.length/10);
    if(page > maxPage) page = maxPage;
    if(page < 1) page = 1;
    balances = balances.slice((page-1)*10, page*10);
    return {leaders: balances, page: page, maxPage: maxPage};
}