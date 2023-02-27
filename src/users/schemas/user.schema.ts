import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EMAIL_REGEX } from '../../constants';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  id: true,
})
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    match: EMAIL_REGEX,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
