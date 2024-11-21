export type CreateAuctionRequest = {
	// UserId that owns the product
	ownerId: string;
	productName: string;
	productType: string;
	auctionTitle?: string;
	minimalPrice: string;
};

export type CreateAuctionResponse = {
	auctionId: string;
	ownerId: string;
};

export type CacheAuction = Pick<
	CreateAuctionRequest,
	"auctionTitle" | "minimalPrice" | "ownerId"
>;

export type FinishAuctionRequest = {
	auctionId: string;
};
