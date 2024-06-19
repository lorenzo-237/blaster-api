import { HttpException } from '@/exceptions/httpException';
import { Service } from 'typedi';
import { CreateUserDto } from '@/dtos/users.dto';
import { PrismaBlaster } from '@/config/prisma';
import { hash } from 'bcrypt';
import { mantisGET } from '@/mantis/mantis.request';
import { UserMantis } from '@/interfaces/mantis.interface';
import { UserBlaster } from '@/interfaces/users.interface';

type FindUser = { id?: number; username?: string };

@Service()
export class UserService {
  public users = PrismaBlaster.user;

  public async createUser({ username, password, token }: CreateUserDto) {
    const findUser = await this.users.findUnique({ where: { username } });
    if (findUser) throw new HttpException(409, 'Username already exists');

    const hashedPassword = await hash(password, 10);

    const user = await this.users.create({
      data: {
        username,
        token,
        password: hashedPassword,
      },
    });

    return user;
  }

  public async updateLastVersionCreated(userId: number, version: string) {
    const user = await this.users.update({
      data: {
        lastVersionCreated: version,
      },
      where: {
        id: userId,
      },
    });
    delete user.password;
    return user;
  }

  public async findMyUserInfo(mantisToken: string) {
    const user = await mantisGET<UserMantis>('/users/me', mantisToken);

    return user;
  }

  public updateSocketId(userId: number, socketId: string) {
    return this.users.update({
      data: {
        socket_id: socketId,
      },
      where: {
        id: userId,
      },
    });
  }

  public findBlastUser({ id, username }: FindUser): Promise<UserBlaster> {
    if (id && id > 0) {
      return this.users.findUnique({ where: { id } });
    }

    if (username) {
      return this.users.findUnique({ where: { username } });
    }

    return null;
  }
}
