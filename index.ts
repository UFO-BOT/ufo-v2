import 'module-alias/register'

import dotenv from 'dotenv'
dotenv.config()

const { TOKEN } = process.env

import Manager from "@/structures/Manager";
const manager = new Manager('dist/src/shard.js', {
    totalShards: Number(process.env.TOTAL_SHARDS),
    token: TOKEN,
    mode: 'process'
})

manager.start()
