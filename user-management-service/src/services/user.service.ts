import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { DatabaseRk } from "src/constants/DatabaseRk.constants";
import { CorrelationService } from "./correlation.service";

@Injectable()
export class UserService {
    constructor(       
        private readonly amqp: AmqpConnection,
        private readonly correlationService: CorrelationService
    ){}

    async loginWithAddress(addr: string){


        const cid = `user_cid_${this.correlationService.generateId()}`
        console.log(cid)
        await this.amqp.publish(
            process.env.RMQ_EXCHANGE_DB,
            DatabaseRk.USER_ADDR_LOGIN,
            JSON.stringify({
                cid,
                addr,
            })
        )

        //* TODO: Add try-catch

       // const user = await this.correlationService.waitAndRetrieve(cid);


    }
}

