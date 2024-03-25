import { AppService } from './app.service';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { OrderDto } from './dto/order.dto';

describe('AppService', () => {
  let service: AppService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    service = new AppService();
  });

  afterEach(() => {
    mockReset(prisma);
  });

  describe('updateStatus', () => {
    it('should update the order status when the transition is valid', async () => {
      const orderId = 'order-id';
      const currentStatus = OrderStatus.CREATED;
      const newStatus = OrderStatus.PICKED_UP;

      prisma.order.findUnique.mockResolvedValue({
        id: orderId,
        status: currentStatus,
      });
      prisma.order.update.mockResolvedValue({
        id: orderId,
        status: newStatus,
      });

      const result = await service.updateStatus({ orderId, status: newStatus });

      expect(result.status).toBe(newStatus);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: newStatus },
      });
    });

    // Add more test cases for invalid transitions, order not found, etc.
  });

  describe('calculateOrderPrice', () => {
    it('should calculate the order price correctly', () => {
      const requestData: OrderDto = {
        dropoff: {
          address: 'Oudenoord 330',
          city: 'Utrecht',
          country: 'Netherlands',
          email: 'example@gmail.com',
          name: 'Name',
          zipcode: '1234AB',
          phonenumber: '+31612795443',
        },
        pickup: {
          address: 'Oudenoord 330',
          city: 'Utrecht',
          country: 'Netherlands',
          email: 'example@gmail.com',
          phonenumber: '+31612795443',
          zipcode: '5678XZ',
          name: 'Name',
        },
        packages: [
          { height: 50, length: 20, width: 10, weight: 50 },
          { height: 10, length: 10, width: 10, weight: 5 },
        ],
      };

      const orderPrice = service.calculateOrderPrice(requestData.packages);

      expect(orderPrice).toBe(8.5);
    });

    // Add more test cases for different package dimensions and weights
  });
});
