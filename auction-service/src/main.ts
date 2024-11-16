import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { ResponseInterceptor } from "./middlewares/response.interceptor";
import { HttpExceptionFilter } from "./middlewares/exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(process.env.SERV_PORT);
}

bootstrap();
