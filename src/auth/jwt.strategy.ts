import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import configuration from "../common/configuration";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
    });
  }

  async validate(payload: any) {
    const userFound = await this.userService.getUserTypeById(payload._id);

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException('Account is not exists!', HttpStatus.NOT_FOUND);
    }

    return { _id: payload._id, username: payload.username, email: payload.email, userType: userFound.userType, studentCode: payload.studentCode };
  }
}
