import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/base.repository';
import { Vendor, VendorDocument } from './schemas/vendor.schema';

@Injectable()
export class VendorsRepository extends BaseRepository<VendorDocument> {
  constructor(@InjectModel(Vendor.name) vendorModel: Model<VendorDocument>) {
    super(vendorModel);
  }
}
