import { Part } from './domain/part';
import { FindPartsDto } from './dto/find-parts.dto';

export abstract class PartAbstractRepository {
  abstract create(part: Part): Promise<Part>;

  abstract findById(id: string): Promise<Part | null>;

  abstract findPotentialRestock(): Promise<Part[]>;

  abstract findAllWithPagination(
    query: FindPartsDto,
  ): Promise<[Part[], number]>;

  abstract update(id: string, payload: Partial<Part>): Promise<Part | null>;
}
