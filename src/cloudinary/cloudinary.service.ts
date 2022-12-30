import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const result = await v2.uploader.upload(file.path, {
        folder: this.configService.get('CLOUDINARY_FOLDER'),
      });

      // Delete local image after upload
      fs.unlink(file.path, (err) => {
        console.error(err);
        if (err) throw err;
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Deletes image from Cloudinary. Throws Bad Request (400) if no image was found.
   * @param url
   */
  async deleteImage(url: string): Promise<void> {
    const publicId = this.getPublicIdFromUrl(url);

    try {
      const { result } = await v2.uploader.destroy(publicId);

      if (result === 'not found') {
        throw new BadRequestException(
          `Image with public id '${publicId}' not found`,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Extracts the public ID from the url of the image. The public ID consists of:
   * 1 - The folder the image is stored
   * 2 - The image ID
   * @param url The URL of the image hosted on Cloudinary
   * @returns The public ID of the image
   * @example "https://res.cloudinary.com/ayanorii/image/upload/v1672384346/management-app-development/k1stsmmuilpv70rfiwdl.png" -> "management-app-development/k1stsmmuilpv70rfiwdl.png"
   */
  getPublicIdFromUrl(url: string): string {
    return url
      .split('/')
      .slice(-2)
      .join('/')
      .split(/\.(png)|(jpg)|(jpeg)/)[0];
  }
}
