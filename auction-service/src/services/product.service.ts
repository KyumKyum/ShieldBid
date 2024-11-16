import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ProductService {
	constructor(@Inject(AmqpConnection) private readonly amqp: AmqpConnection) {}

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

		if (
			!(await this.amqp.publish(
				process.env.RMQ_EXCHANGE_DB,
				"database.product.create",
				JSON.stringify(createProductEvent),
			))
		) {
			throw new HttpException(
				"Event Propagation Failed: Product Creation",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
