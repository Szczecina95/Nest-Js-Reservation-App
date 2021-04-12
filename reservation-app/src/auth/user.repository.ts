import { AuthSignInDto } from './dto/auth-signin.dto';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    if (await this.isEmailExist(email)) {
      throw new ConflictException('Email already exist');
    }

    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.email = email;
    user.password = await this.hashPassword(password, user.salt);
    await user.save();
  }
  async validateUserPassword(authSignInDto: AuthSignInDto): Promise<string> {
    const { email, password } = authSignInDto;
    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async isEmailExist(email: string): Promise<boolean> {
    const users = await User.find({ email });

    return !!users.length;
  }
}
