import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppearanceService } from './appearance.service';
import { AppearanceController } from './appearance.controller';
import { AppearanceEntity } from './appearance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppearanceEntity])],
  controllers: [AppearanceController],
  providers: [AppearanceService],
  exports: [AppearanceService],
})
export class AppearanceModule {}