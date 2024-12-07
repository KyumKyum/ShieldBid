export type CreateProductResponse = {
	productId: string;
	cacheKey: string;
};

export type ProductDto = {
	id: string,
	owner: string //* ID
	auction: string,
	name: string,
	type: string,
	description: string,
	createdAt: Date,
	updatedAt: Date
}