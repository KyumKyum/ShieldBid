import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
	intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> {
		return next.handle().pipe(
			map((data) => ({
				ok: true,
				data,
			})),
		);
	}
}
