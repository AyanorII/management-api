import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type VendorDocument = Vendor & Document;

@Schema({
  timestamps: true,
  id: true,
})
export class Vendor {
  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  contact?: string;

  @Prop()
  website?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
