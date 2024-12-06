import { Module } from "@nestjs/common";
import { CacheModule } from "src/providers/cache/cache.module";
import { CorrelationService } from "src/services/correlation.service";

@Module({
    imports: [CacheModule],
    providers: [CorrelationService],
    exports: [CorrelationService]
})
export class CorrelationModule{};