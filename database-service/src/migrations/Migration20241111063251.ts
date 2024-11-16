import { Migration } from "@mikro-orm/migrations";

export class Migration20241111063251 extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`create table "auction" ("id" varchar(255) not null, "product_id_id" varchar(255) not null, "is_terminated" boolean not null, "created_at" date not null, "updated_at" date not null, constraint "auction_pkey" primary key ("id"));`,
		);
		this.addSql(
			`alter table "auction" add constraint "auction_product_id_id_unique" unique ("product_id_id");`,
		);

		this.addSql(
			`alter table "auction" add constraint "auction_product_id_id_foreign" foreign key ("product_id_id") references "product" ("id") on update cascade;`,
		);

		this.addSql(
			`alter table "product" add column "created_at" date not null, add column "updated_at" date not null;`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(`drop table if exists "auction" cascade;`);

		this.addSql(
			`alter table "product" drop column "created_at", drop column "updated_at";`,
		);
	}
}
