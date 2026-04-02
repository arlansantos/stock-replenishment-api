import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestockPrioritiesResponseDto } from './dto/restock-priorities-response.dto';
import { PartsService } from './parts.service';

@ApiTags('restock')
@Controller({ path: 'restock', version: '1' })
export class RestockController {
  constructor(private readonly partsService: PartsService) {}

  @Get('priorities')
  @ApiOperation({ summary: 'Listar prioridades de reposicao' })
  @ApiOkResponse({ type: RestockPrioritiesResponseDto })
  async priorities(): Promise<RestockPrioritiesResponseDto> {
    return await this.partsService.getRestockPriorities();
  }
}
