import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiKeyGuard } from '@/guards/api-key.guard';
import { ApiKey } from '@/decorators/api-key.decorator';
import { Tables } from '@/providers/types/supabase.types';

import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { SearchResponseDto } from './dto/search-response.dto';

@Controller('search')
@UseGuards(ApiKeyGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async create(
    @Body(ZodValidationPipe) createSearchDto: CreateSearchDto,
    @ApiKey() apiKey: Tables<'api_keys'>,
  ): Promise<SearchResponseDto> {
    // You can now use apiKey.id, apiKey.key, etc.
    console.log(apiKey);
    return this.searchService.create(createSearchDto);
  }
}
