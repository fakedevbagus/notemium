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
import { CreateNoteDto, UpdateNoteDto } from './notes.dto';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(OptionalJwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@CurrentUserId() userId?: number) {
    return this.notesService.findAll(userId);
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId?: number) {
    return this.notesService.remove(id, userId);
  }
}
