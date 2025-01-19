import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    // ? TODO get from client
    const user = {
      userId: '40c06d24-d661-459c-aa4b-f983d3ba940d',
    };
    return !!user;
  }
}
