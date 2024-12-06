import { Injectable } from "@nestjs/common";
import { TiredOfWaitingError } from "src/exceptions/correlation.exception";
import { CacheService } from "src/providers/cache/cache.service";
import { v4 } from "uuid";

@Injectable()
export class CorrelationService{
    constructor(private readonly cacheService: CacheService){}

    generateId(): string {
        return v4();
    }

    async waitAndRetrieve(cid: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // Set up timeout
            const timeout = setTimeout(() => {
                clearInterval(checkInterval);
                reject(new TiredOfWaitingError(cid));
            }, 5000);
    
            // Polling interval
            const checkInterval = setInterval(() => {
                try {
                    const res = this.cacheService.flush<string>(cid);
    
                    if (res) {
                        clearTimeout(timeout);
                        clearInterval(checkInterval);
                        resolve(res);
                    }
                } catch (error) {
                    clearTimeout(timeout);
                    clearInterval(checkInterval);
                    reject(error);
                }
            }, 250);
        });
    }
}