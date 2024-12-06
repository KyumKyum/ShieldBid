import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { CorrelationService } from "./correlation.service";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { DatabaseRoute } from "src/constants/databaseRoute.constants copy";
import { RoutingKey } from "src/constants/routingKey.constants";

@Injectable()
export class UserService {
    constructor(       
        private readonly amqp: AmqpConnection,
        private readonly correlationService: CorrelationService
    ){}

    async loginWithAddress(addr: string){


        const cid = `user_cid_${this.correlationService.generateId()}`

        const msg: CommonMsg = {
            route: DatabaseRoute.LOGIN_WITH_ADDR,
            payload: JSON.stringify({
                cid,
                addr,
            })
        }

        await this.amqp.publish(
            process.env.RMQ_EXCHANGE_DB,
            RoutingKey.DATABASE,
            JSON.stringify(msg)            
        )

        //* TODO: Add try-catch

       // const user = await this.correlationService.waitAndRetrieve(cid);


    }
}

