import { AddressType, Order, OrderStatus, PrismaClient } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderDto, PackageDto } from './dto/order.dto';

const prisma = new PrismaClient({
});


@Injectable()
export class AppService {

  async createOrder(data: OrderDto): Promise<Order> {
    try {
      const { packages, dropoff, pickup } = data;
      const price = await this.calculateOrderPrice(packages);
      const order = await prisma.order.create({
        data: {
          amount: price,
        },
      });
 // Get order id then attach it to the package
      await prisma.address.create({
        data: {
          orderId: order.id,
          type: AddressType.DROPOFF,
          ...dropoff,
        },
      });

      await prisma.address.create({
        data: {
          orderId: order.id,
          type: AddressType.PICKUP,
          ...pickup,
        },
      });
    
      packages.forEach(async (pkg) => {
        await prisma.package.create({
          data: {
            orderId: order.id,
            ...pkg,
          },
        });
      });

      return order;
    } catch (error) {
      throw new InternalServerErrorException(error as string);
    }
  }

  async calculateOrderPrice(packages: PackageDto[]): Promise<number> {
    let totalPrice = 0;//initialize total price to 0. 
    //Handle the price calculation based on the given parameters

    // Base cost for each package
    totalPrice += packages.length;//We're checking how many packages we have

    // Additional cost based on volume and weight
    for (const pkg of packages) {
      const volume = pkg.height * pkg.length * pkg.width;
      let volumeCharge = 0;

      // Calculate additional charge for volume
      if (volume > 5000) {
        const additionalVolume = Math.ceil((volume - 5000) / 5000); // Calculate additional 5000s
        volumeCharge = additionalVolume * 0.5; // Charge €0.50 for each additional 5000
      }

      const weightCharge = pkg.weight * 0.1;

      totalPrice += volumeCharge + weightCharge;
    }

    return totalPrice;
  }

  async updateStatus(data: { orderId: string; status: OrderStatus }) {
    const { orderId, status: newStatus } = data;

    // Get the current status of the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    const currentStatus = order.status;

    // Check if the status transition is allowed
    const updatedStatus = await this.updateOrderStatus(
      currentStatus,
      newStatus,
    );
    if (updatedStatus !== newStatus) {
      throw new BadRequestException('Invalid status transition');
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: updatedStatus },
    });

    return {
      orderId: updatedOrder.id,
      newStatus,
      oldStatus: currentStatus,
    };
  }
  async getOrderIds(): Promise<string[]> {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
      },
    });
    return orders.map(order => order.id);
  }




  //State Machine
  async updateOrderStatus(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): Promise<OrderStatus> {
    switch (currentStatus) {
      case OrderStatus.CREATED:
        if (
          newStatus === OrderStatus.PICKED_UP ||
          newStatus === OrderStatus.CANCELLED
        ) {
          return newStatus;
        }
        break;
      case OrderStatus.PICKED_UP:
        if (
          newStatus === OrderStatus.DELIVERED ||
          newStatus === OrderStatus.RETURNING
        ) {
          return newStatus;
        }
        break;
      case OrderStatus.RETURNING:
        if (newStatus === OrderStatus.RETURNED) {
          return newStatus;
        }
        break;
      case OrderStatus.CANCELLED:
      case OrderStatus.DELIVERED:
      case OrderStatus.RETURNED:
        // These statuses cannot be changed
        break;
      default:
        throw new Error('Invalid order status');
    }

    return currentStatus;
  }

  async searchOrdersByDropoffAddress(address: string, postalCode: string) {
    const orders = await prisma.address.findMany({
      where: {
        address: {
          contains: address,
        },
        zipcode: postalCode,
        type: AddressType.DROPOFF,
      },
      include: {
        order: true,
      },
    });

    return orders;
  }
}