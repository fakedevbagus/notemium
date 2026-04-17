import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { VersioningService } from './versioning.service';

@Controller('versioning')
export class VersioningController {
  constructor(private readonly versioningService: VersioningService) {}

  @Get(':noteId')
  getVersions(@Param('noteId') noteId: string) {
    return this.versioningService.getVersions(+noteId);
  }

  @Post('restore/:versionId')
  restoreVersion(@Param('versionId') versionId: string) {
    return this.versioningService.restoreVersion(+versionId);
  }

  @Post('compare')
  compareVersions(@Body() body: { versionA: number; versionB: number }) {
    return this.versioningService.compareVersions(body.versionA, body.versionB);
  }
}
