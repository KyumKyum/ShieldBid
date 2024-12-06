import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DatabaseRoute } from "src/constants/databaseRoute.constants copy";
import { RoutingKey } from "src/constants/routingKey.constants";
import { CommonMsg } from "src/dto/commonMsg.dto";

@Injectable()
export class ProductService {
	constructor(private readonly amqp: AmqpConnection) {}

	async publishCreateProductEvent(
		cacheKey: string,
		productName: string,
		productType: string,
		ownerId: string,
	) {
		const createProductEvent = {
			cacheKey,
			productName,
			productType,
			ownerId,
		};

		const msg: CommonMsg = {
			route: DatabaseRoute.PRODUCT_CREATE_REQUEST,
			payload: createProductEvent
		}

		if (
			!(await this.amqp.publish(
				process.env.RMQ_EXCHANGE_DB,
				RoutingKey.DATABASE,
				JSON.stringify(msg),
			))
		) {
			throw new HttpException(
				"Event Propagation Failed: Product Creation",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
