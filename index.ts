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

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/api/modules/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(4827);
}
bootstrap();


manager.start()