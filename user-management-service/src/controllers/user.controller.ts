import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "src/services/user.service";

@Controller("user")
export class UserController {
    constructor (
        private readonly userService: UserService
    ){}


    @Post("/auth/addr")
    async addrAuth(@Body("addr") addr: string) {
        this.userService.loginWithAddress(addr)
    }

    
}