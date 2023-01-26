import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtGuard } from '../common/guards/jwt.guard';
import { MAX_FILES_FIELDS, MAX_FILE_SIZE } from '../constants';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
@UseGuards(JwtGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', MAX_FILES_FIELDS, {
      storage: diskStorage({
        destination: './uploads',
      }),
      limits: {
        files: MAX_FILES_FIELDS,
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ) {
    return this.productsService.create(createProductDto, user, files);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.productsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.productsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, user: User) {
    return this.productsService.remove(id, user);
  }
}
