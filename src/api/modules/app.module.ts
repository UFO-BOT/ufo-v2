import { Module } from '@nestjs/common';
import {PublicModule} from "@/api/modules/public.module";

@Module({
  imports: [PublicModule],
})
export class AppModule {}
