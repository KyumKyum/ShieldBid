export type CreateAuctionRequest = {
	// UserId that owns the product
	ownerId: string;
	productName: string;
	productType: string;
	auctionTitle?: string;
	minimalPrice: string;
};

export type CacheAuction = Pick<
	CreateAuctionRequest,
	"auctionTitle" | "minimalPrice"
>;
