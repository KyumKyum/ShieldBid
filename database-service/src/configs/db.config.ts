import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const dbConfig: Options = {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: 'shield_bid_db',
    driver: PostgreSqlDriver,
    debug: process.env.NODE_ENV === 'dev',
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    migrations: {
        path: './dist/migrations',
        pathTs: './src/migrations',
        glob: '!(*.d).{js,ts}',
    }
}

export default dbConfig