import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { Roles } from "../../auth/roles.decorator";
import { RolesGuard } from "../../auth/roles.guard";
import { UserType } from "../../user/enums/user-type.enum";

@ApiTags('Upload')
@Controller("upload")
export class UploadController {
  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          }
        },
      },
      required: ['files']
    },
  })
  @UseInterceptors(FilesInterceptor("files", 100))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      data: files.map(file => ({
        uri: `${file.destination.split("/public/")[1]}/${file.filename}`,
      })),
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("/single")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file']
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      uri: `${file.destination.split("/public/")[1]}/${file.filename}`,
    };
  }
}
