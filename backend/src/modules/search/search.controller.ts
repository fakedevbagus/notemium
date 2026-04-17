import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUserId } from '../auth/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(OptionalJwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('q') query: string, @CurrentUserId() userId?: number) {
    return this.searchService.search(query, userId);
  }
}
