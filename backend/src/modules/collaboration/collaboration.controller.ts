import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';

@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Post('invite')
  invite(@Body() body: { noteId: number; userId: number; role: string }) {
    return this.collaborationService.invite(body.noteId, body.userId, body.role);
  }

  @Post('comment/:noteId')
  comment(@Param('noteId') noteId: string, @Body() body: { userId: number; comment: string }) {
    return this.collaborationService.comment(+noteId, body.userId, body.comment);
  }

  @Get('shared/:noteId')
  getCollaborators(@Param('noteId') noteId: string) {
    return this.collaborationService.getCollaborators(+noteId);
  }
}
