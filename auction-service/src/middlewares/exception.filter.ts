import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest();
		const resp = ctx.getResponse();
		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		console.error(exception.message)
		// return {
		// 	ok: false,
		// 	message: exception.message || "Unknown Error Occurred",
		// 	status,
		// 	timestamp: new Date().toISOString(),
		// 	path: req.url,
		// };
	}
}
