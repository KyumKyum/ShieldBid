import { Injectable } from "@nestjs/common";
import {
	CreateAuctionEvent,
	CreateAuctionResponse,
} from "src/dto/auctionEvent.dto";
import { Auction } from "src/entities/auction.entity";
import { AuctionRepository } from "src/repository/auction.repository";
import { SubscriberUserService } from "./subscriber.user.service";

@Injectable()
export class SubscriberAuctionService {
	constructor(
		private readonly auctionRepository: AuctionRepository,
		private readonly userService: SubscriberUserService,
	) {}

	async createNewAuction(
		event: CreateAuctionEvent,
	): Promise<CreateAuctionResponse | null> {
		let auctionId = "";
		let consignorAddress = "";

		const { productId, auctionTitle, minimalPrice, ownerId } = event;

		try {
			const auction = await this.auctionRepository.create(
				productId,
				auctionTitle,
				minimalPrice,
			);

			auctionId = auction.id;
		} catch {
			//* TODO
			return null;
		}

		try {
			await this.userService.updateUserAsConsignor(ownerId)
			consignorAddress = await this.userService.getUserAddress(ownerId);
		} catch {
			//* TODO
			return null;
		}

		const resp = {
			auctionId,
			consignorAddress,
		};

		return resp;
	}

	async startAuction(auctionId: string): Promise<boolean> {
		try {
			await this.auctionRepository.update(auctionId, { status: "START" });
			return true;
		} catch {
			return false;
		}
	}

	async queryAllAuctions(): Promise<Auction[] | null> {
		try {
			return await this.auctionRepository.findAll();
		} catch {
			return null;
		}
	}

	async queryAuction(auctionId: string): Promise<Auction | null> {
		try{
			return await this.auctionRepository.find(auctionId)
		}catch {
			return null;
		}
	}

	async terminateAuction(auctionId: string): Promise<boolean> {
		try {
			await this.auctionRepository.update(auctionId, { status: "TERMINATED" });
			return true;
		} catch {
			return false;
		}
	}
}
