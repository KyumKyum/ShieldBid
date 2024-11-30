import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/configs/config.module';
import { ProcessingRabbitMQModule } from 'src/providers/rabbitmq/rabbitmq.module';

@Module({
  imports: [AppConfigModule, ProcessingRabbitMQModule],
})
export class AppModule {}
