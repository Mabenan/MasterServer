import { Inject, Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Server } from './server.entity';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class ServerService {
  async update(server: Server): Promise<Server>  {
    return await this.serverRepository.save(server);
  }
  private readonly logger : Logger = new Logger(ServerService.name);
  async addOne(server: Server): Promise<Server> {
    server.heartbeat = new Date(Date.now());
    return await this.serverRepository.save(server);
  }
  async findOne(id: string): Promise<Server> {
    return await this.serverRepository.findOne(id);
  }
  constructor(
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
  ) {}

  async findAll(): Promise<Server[]> {
    return await this.serverRepository.find();
  }
  
  @Interval(10000)
  handleCron() {
    this.logger.log('Remove Server without actual Heartbeat');
    let date: Date = new Date(Date.now());
    var MS_PER_MINUTE = 60000;
    var myStartDate = new Date(date.valueOf() - 1 * MS_PER_MINUTE);
    this.logger.log("Remove everything older than: " + myStartDate.toLocaleString());
    this.serverRepository.find().then((servers: Server[]) => {
      servers = servers.filter((value: Server)=>{
        this.logger.log("Server has Heartbeat: " + value.heartbeat.toLocaleString())
        if(value.heartbeat >= myStartDate){
          this.logger.log("Server has actual heartbeat");
          return false;
        }else{
          this.logger.log("Server is obsolete");
          return true;
        }
      });
      this.serverRepository.remove(servers);
    });

  }
}
