import 'module-alias/register'
import 'reflect-metadata'

import dotenv from 'dotenv'
dotenv.config()

import Manager from "@/structures/Manager";
const manager = new Manager('dist/src/shard.js', {
    totalShards: Number(process.env.TOTAL_SHARDS),
    token: process.env.TOKEN,
    mode: 'process'
})

manager.start()