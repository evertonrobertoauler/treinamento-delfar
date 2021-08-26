import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const request: Request = ctx.switchToHttp().getRequest();
    if ((request.session as Record<string, any>).usuario > 0) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
