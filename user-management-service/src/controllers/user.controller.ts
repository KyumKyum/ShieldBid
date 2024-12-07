import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "src/services/user.service";

@Controller("user")
export class UserController {
    constructor (
        private readonly userService: UserService
    ){}


    @Post("/auth/addr")
    async addrAuth(@Body("addr") addr: string) {
        const resp = await this.userService.loginWithAddress(addr)
        if(!resp) throw new HttpException('No Such User', HttpStatus.BAD_REQUEST);
        return resp;
    }

    
}