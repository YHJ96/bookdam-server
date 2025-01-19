import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const Jwt = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (request.user === undefined) throw new NotFoundException();
  if (request.user.id === undefined) throw new NotFoundException();
  if (request.user.name === undefined) throw new NotFoundException();
  if (request.user.email === undefined) throw new NotFoundException();
  if (request.user.avatar === undefined) throw new NotFoundException();
  if (request.user.provider === undefined) throw new NotFoundException();

  return request.user;
});
