import { Body, Controller, Post } from "@nestjs/common";
import { RequestBidDto } from "src/dto/bid.dto";
import { BidService } from "src/services/bid.service";

@Controller("bid")
export class BidController {
	constructor(private readonly bidService: BidService) {}

	@Post()
	async requestBid(@Body() requestBidReq: RequestBidDto) {
		const { auctionId, price } = requestBidReq;
		await this.bidService.offerBid(auctionId, price);
	}

	@Post("proof")
	//* TODO
	async requestBidProof() {}
}
