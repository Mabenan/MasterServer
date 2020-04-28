import { Controller, Get, Param, Post, Body, Patch, Ip } from '@nestjs/common';
import { ServerService } from './server.service';
import { Server } from './server.entity';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  findAll(): Promise<Server[]> {
    return this.serverService.findAll();
  }
  
  @Get(':id')
  findOne(@Param() params): Promise<Server> {
    return this.serverService.findOne(params.id); 
  }
  @Patch('heartbeat/:id')
  heartbeat(@Param() params): Promise<Server> {
    return new Promise<Server>((res,rej) => {
      this.serverService.findOne(params.id).then((server: Server) =>{
        server.heartbeat = new Date(Date.now());
        this.serverService.update(server).then((serverUpdated: Server)=>{
          res(serverUpdated);
        }).catch((err)=>{
          rej(err);
        });
      }).catch((err2)=>{
        rej(err2);
      }); 
    });
  }
  @Post()
  addOne(@Body() body, @Ip() ip) : Promise<Server>{
    let server: Server = body as Server;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
server.adress = ip;
    return this.serverService.addOne(server);
  }
}

