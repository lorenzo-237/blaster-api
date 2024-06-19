import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto, VerifyTokenDto } from '@/dtos/users.dto';
import { UserService } from '@/services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class UserController {
  public user = Container.get(UserService);

  public newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as CreateUserDto;

      const user = await this.user.createUser(dto);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public verifyToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as VerifyTokenDto;

      const user = await this.user.findMyUserInfo(dto.mantisToken);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public getMyUserInfo = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = await this.user.findMyUserInfo(req.user.token);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public setSocketId = async (userId: number, socketId: string): Promise<string> => {
    const user = await this.user.updateSocketId(userId, socketId);

    return user.username;
  };
}
