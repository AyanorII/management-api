import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EMAIL_REGEX } from '../../constants';
import { User } from '../../users/schemas/user.schema';

export type EmployeeDocument = Employee & Document;

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

@Schema({
  timestamps: true,
  id: true,
})
export class Employee {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    match: EMAIL_REGEX,
  })
  email?: string;

  @Prop()
  phone?: string;

  @Prop({
    required: true,
    enum: Gender,
  })
  gender: Gender;

  @Prop()
  startedAt: Date;

  @Prop({
    required: true,
  })
  salary: number;

  @Prop()
  photo?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
