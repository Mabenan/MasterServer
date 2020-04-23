import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServerModule } from './servers/server.module';


@Module({
  imports:[
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    ServerModule
  ],

})
export class ApplicationModule {}
