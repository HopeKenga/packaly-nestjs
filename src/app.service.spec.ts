import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { OrderStatus } from '@prisma/client';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('updateOrderStatus', () => {
    it('should allow status transition from CREATED to PICKED_UP', async () => {
      const currentStatus = OrderStatus.CREATED;
      const newStatus = OrderStatus.PICKED_UP;
      const result = await service.updateOrderStatus(currentStatus, newStatus);
      expect(result).toEqual(newStatus);
    });

    it('should allow status transition from PICKED_UP to DELIVERED', async () => {
      const currentStatus = OrderStatus.PICKED_UP;
      const newStatus = OrderStatus.DELIVERED;
      const result = await service.updateOrderStatus(currentStatus, newStatus);
      expect(result).toEqual(newStatus);
    });

    it('should allow status transition from PICKED_UP to RETURNING', async () => {
      const currentStatus = OrderStatus.PICKED_UP;
      const newStatus = OrderStatus.RETURNING;
      const result = await service.updateOrderStatus(currentStatus, newStatus);
      expect(result).toEqual(newStatus);
    });

    it('should allow status transition from RETURNING to RETURNED', async () => {
      const currentStatus = OrderStatus.RETURNING;
      const newStatus = OrderStatus.RETURNED;
      const result = await service.updateOrderStatus(currentStatus, newStatus);
      expect(result).toEqual(newStatus);
    });

    it('should not allow status transition from any other status to RETURNED', async () => {
      const currentStatus = OrderStatus.CREATED;
      const newStatus = OrderStatus.RETURNED;
      const result = await service.updateOrderStatus(currentStatus, newStatus);
      expect(result).toEqual(currentStatus);
    });

    it('should not allow status transition from DELIVERED to any other status', async () => {
      const currentStatus = OrderStatus.DELIVERED;
      const newStatus = OrderStatus.CREATED;
      const result = await service.updateOrderStatus(currentStatus, newStatus);
      expect(result).toEqual(currentStatus);
    });

    it('should not allow status transition from CANCELLED to any other status', async () => {
      const currentStatus = OrderStatus.CANCELLED;
      const newStatus = OrderStatus.DELIVERED;
      const result = await service.updateOrderStatus(currentStatus, newStatus);
      expect(result).toEqual(currentStatus);
    });
  });

  describe('calculateOrderPrice', () => {
    it('should calculate correct price for given packages', async () => {
      const packages = [
        { height: 50, length: 20, width: 10, weight: 50 },
        { height: 10, length: 10, width: 10, weight: 5 },
      ];
      const result = await service.calculateOrderPrice(packages);
      const expectedPrice = 8; // For the first example package
      expect(result).toEqual(expectedPrice);
    });
  });
});