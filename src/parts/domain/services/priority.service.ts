import { Injectable } from '@nestjs/common';
import { Part } from '../part';
import { PartRestockPriority } from '../types/part-restock-priority.type';

@Injectable()
export class PriorityService {
  calculate(parts: Part[]): PartRestockPriority[] {
    return parts
      .filter((part) => part.needsRestock())
      .map((part) => ({
        partId: part.id,
        name: part.name,
        currentStock: part.currentStock,
        projectedStock: part.calculateProjectedStock(),
        minimumStock: part.minimumStock,
        urgencyScore: part.calculateUrgencyScore(),
        criticalityLevel: part.criticalityLevel,
        averageDailySales: part.averageDailySales,
      }))
      .sort((a, b) => {
        if (b.urgencyScore !== a.urgencyScore) {
          return b.urgencyScore - a.urgencyScore;
        }

        if (b.criticalityLevel !== a.criticalityLevel) {
          return b.criticalityLevel - a.criticalityLevel;
        }

        if (b.averageDailySales !== a.averageDailySales) {
          return b.averageDailySales - a.averageDailySales;
        }

        return a.name.localeCompare(b.name, 'pt-BR');
      });
  }
}
