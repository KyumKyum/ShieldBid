import { Module } from "@nestjs/common";
import { UserController } from "src/controllers/user.controller";
import { UserService } from "src/services/user.service";
import { CorrelationModule } from "./correlation.module";
import { UserMgmtRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";

@Module({
    imports: [UserMgmtRabbitMQModule, CorrelationModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule{}