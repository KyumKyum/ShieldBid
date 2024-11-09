import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AppConfigModule } from 'src/configs/config.module';
import { NotificationRabbitMQModule } from 'src/providers/rabbitmq/rabbitmq.module';

@Module({
  imports: [AppConfigModule, NotificationRabbitMQModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
