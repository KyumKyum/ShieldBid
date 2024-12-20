![shieldbid](https://github.com/user-attachments/assets/d728d094-7df0-4119-8a5c-98bc072af620)
# ShieldBid - DApp Project
> A Blockchain-based Online Auction Service providing transparency and securacy by using zero-knowledge proof.
---
### MSA Structure

- `event-queue` (Kotlin, Spring Boot)
    - An event-queue service that relays and broadcasts service events.

- `auction-service` (Typescript, NestJS)
    - A service related with auction-related features. (Enlisting Auction, Terminating Auction, etc)

- `processing-service` (Typescript, NestJS)
    - A service that communicates with core and proceeds blockchain-related operations. (Deploying a contract, Request for proof generation/verification, etc.)

- `database-service` (Typescript, NestJS)
    - A service that directly communicates with database,

- `user-management-service` (Typescript, NestJS)
    - A service related with user-related features. (Login, Sign Up, etc.) (TODO)
---
### How to launch
> Make sure you already have `Shieldbid-FE` and `Shieldbid-Core` before run this application. 

0. Pre-requisites
- Make sure you have a environment to run and compile java applications.
    - `openjdk 21.0.5`
    - Nodejs (`v22`~`v23`) is optional, since all nodejs application will provided by docker-compose services.
    - Run `Shieldbid-FE` and `Shieldbid-Core` by following the description.

1. Build an event-queue.
    - Move to `event-queue` directory.
    - Run `./gradlew build` command to build an application.
    - Check if snapshot is created in `build/libs` with name `event-queue-0.0.1-SNAPSHOT.jar`.

2. Run `docker-compose up --build -d` in a root directory of `ShieldBid`.

3. Create a migration files and apply the migrations.
    - Move to `database-service` directory.
    - Run `yarn migration:create` to update the migration files.
    - Run `yarn migration:up` to apply the migrations.
    - Check if the migration is applied by using `psql` or application such as `Datagrip`.

4. (Optional) Run the service with dev mode.
    - This procedure requires nodejs.
    - Make sure you have `.env.dev` in directory `/env` with required fields.
    - Move to service you want to run locally.
    - Run `yarn build:dev` to run the application.

---
### API

#### Auction Service (localhost:9424)

- `PUT /auction`: Create and auction.
```typescript
// TODO: This request body need to be updated.
// PUT /auction
{
	// UserId that owns the product
	ownerId: string;
	productName: string;
	productType: string;
	auctionTitle?: string;
	minimalPrice: string;
};
```

- `POST /auction/finish`: Finish the auction
```typescript
// POST /auction/finish
{
	auctionId: string;
};
```

- `POST /bid`: Offer a bid
```typescript
// POST /bid
export type RequestBidDto = {
	auctionId: string;
	price: number;
};
```

- `POST /auction/list`: Query all auctions existing
```typescript
// GET /auction/list
```
