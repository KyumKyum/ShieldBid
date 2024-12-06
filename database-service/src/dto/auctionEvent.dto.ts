export type CreateAuctionEvent = {
	productId: string;
	auctionTitle: string;
	minimalPrice: string;
	ownerId: string;
};

export type CreateAuctionResponse = {
	auctionId: string;
	consignorAddress: string;
};
