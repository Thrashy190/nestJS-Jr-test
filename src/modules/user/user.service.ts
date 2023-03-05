import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONGO_DB_NAME } from './constants';
import { User, UserDoc } from './schemas/user.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name, MONGO_DB_NAME) private userModel: Model<UserDoc>) {}

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async patchUser(_id: string, user: Partial<User>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(_id, user);
  }

  async deleteUser(_id: string): Promise<User> {
    return await this.userModel.findOneAndDelete({ _id });
  }

  async findByObjectId(_id: string): Promise<User> {
    return await this.userModel.findById(_id);
  }

  async findByUserName(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async searchUsers(
    firstName?: string,
    lastName?: string,
    username?: string,
  ): Promise<User[]> {
    const search: any = {};
    if (firstName) {
      search.firstName = { $regex: new RegExp(firstName, 'i') };
    }
    if (lastName) {
      search.lastName = { $regex: new RegExp(lastName, 'i') };
    }
    if (username) {
      search.userName = { $regex: new RegExp(username, 'i') };
    }

    return await this.userModel.find(search);
  }

  async seedUsers(users: User[]): Promise<Array<User>> {
    return await this.userModel.insertMany(users);
  }
}
