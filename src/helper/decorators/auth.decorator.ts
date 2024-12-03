import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const Auth = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (request.user === undefined) throw new UnauthorizedException();
  if (request.user.id === undefined) throw new UnauthorizedException();
  if (typeof request.user.id !== 'string') throw new UnauthorizedException();

  return request.user.id;
});
