import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserId } from '../auth/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CreateNoteDto, NotesQueryDto, UpdateNoteDto } from './notes.dto';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(OptionalJwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@Query() query: NotesQueryDto, @CurrentUserId() userId?: number) {
    return this.notesService.findAll(query, userId);
  }

  @Get('trash')
  findTrashed(@CurrentUserId() userId?: number) {
    return this.notesService.findTrashed(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId?: number) {
    return this.notesService.findOne(id, userId);
  }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @CurrentUserId() userId?: number) {
    return this.notesService.create(createNoteDto, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUserId() userId?: number,
  ) {
    return this.notesService.update(id, updateNoteDto, userId);
  }

  /** Soft delete — moves note to trash */
  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId?: number) {
    return this.notesService.softDelete(id, userId);
  }

  /** Restore a trashed note */
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId?: number) {
    return this.notesService.restore(id, userId);
  }

  /** Permanently delete a note (from trash) */
  @Delete(':id/permanent')
  permanentDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId?: number,
  ) {
    return this.notesService.remove(id, userId);
  }
}
