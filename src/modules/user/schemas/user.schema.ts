import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';

export type UserDoc = Document & User;

@Schema({ timestamps: true })
export class User {
  _id: string;

  @Prop({ index: true })
  firstName: string;

  @Prop({ index: true })
  lastName: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true, index: true })
  username: string;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({ default: now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
