import { Injectable } from "@nestjs/common";
import { SubscriberUserService } from "src/services/subscriber.user.service";
import { CacheService } from "../cache/cache.service";
import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { RoutingKey } from "src/constants/routingKey.constants";
import { LoginAddrEvent } from "src/dto/userEvent.dto";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { DatabaseRoute } from "src/constants/databaseRoute.constants";

@Injectable()
export class DatbaaseUserMQService {
	constructor(
		private readonly subscriberUserService: SubscriberUserService,
		private readonly cacheService: CacheService,
	) {}

	private async loginAddr(event: LoginAddrEvent) {
		const {cid, addr} = event
		//* NOTICE: This is a demo. Login will also generate a new user.
		//* Comment following line after end for the demo.
		console.log(cid, addr);
		//await this.subscriberUserService.createDemoUser(addr);

		// const user = await this.subscriberUserService.getUserByAddress(addr);
		console.log(addr);
		//await this.cacheService.set(cid, JSON.stringify(user))
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: RoutingKey.DATABASE,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async dbUserRequestHandler(msg: string) {
		const { route, payload } = JSON.parse(msg) as CommonMsg;

		switch(route) {
			case DatabaseRoute.LOGIN_WITH_ADDR: {
				const event: LoginAddrEvent = JSON.parse(payload) as LoginAddrEvent;
				await this.loginAddr(event)
			}
		}
	}
}
