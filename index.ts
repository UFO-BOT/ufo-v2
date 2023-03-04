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
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({transform: true, transformOptions: {enableImplicitConversion: true}}))
    await app.listen(Number(process.env.PORT));
}
bootstrap().then();


manager.start().then()