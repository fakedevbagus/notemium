import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserId } from '../auth/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './folders.dto';

@Controller('folders')
@UseGuards(OptionalJwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  findAll(@CurrentUserId() userId?: number) {
    return this.foldersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId?: number) {
    return this.foldersService.findOne(id, userId);
  }

  @Post()
  create(@Body() createFolderDto: CreateFolderDto, @CurrentUserId() userId?: number) {
    return this.foldersService.create(createFolderDto, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFolderDto: UpdateFolderDto,
    @CurrentUserId() userId?: number,
  ) {
    return this.foldersService.update(id, updateFolderDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId?: number) {
    return this.foldersService.remove(id, userId);
  }
}
