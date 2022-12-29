import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(file.path, {}, (error, result) => {
        if (error) return reject(error);
        resolve(result);
        // Delete the file after it has been uploaded to Cloudinary
        fs.unlink(file.path, (err) => {
          console.error(err);
          if (err) throw err;
        });
      });
    });
  }
}
