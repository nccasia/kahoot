import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    return !!client.user;
  }
}
