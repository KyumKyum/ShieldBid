import type { CreateAuctionRequest } from "./CreateAuctionRequest.dto";

export type CacheAuction = Pick<
	CreateAuctionRequest,
	"auctionTitle" | "minimalPrice"
>;
