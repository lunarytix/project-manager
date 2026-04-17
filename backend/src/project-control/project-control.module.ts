import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectControlController } from './project-control.controller';
import { ProjectControlEntity } from './project-control.entity';
import { ProjectControlService } from './project-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectControlEntity])],
  controllers: [ProjectControlController],
  providers: [ProjectControlService],
  exports: [ProjectControlService],
})
export class ProjectControlModule {}
