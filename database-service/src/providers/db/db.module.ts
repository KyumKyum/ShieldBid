import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import dbConfig from "src/configs/db.config";

@Module({
    imports: [
        MikroOrmModule.forRoot({
            ...dbConfig,
            autoLoadEntities: process.env.NODE_ENV === 'dev'
        })
    ]
})

export class DbModule{};