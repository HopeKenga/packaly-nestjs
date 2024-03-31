import { Body, Controller, Post, Get, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { OrderValidationPipe } from './pipes/order-validation.pipe';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('order/create')
  @UsePipes(OrderValidationPipe)
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(@Body() data: OrderDto) {
    return await this.appService.createOrder(data);
  }

  @Post('order/status/update')
  @ApiOperation({ summary: 'update order status' })
  async updateOrderStatus(
    @Body() data: { orderId: string; status: OrderStatus },
  ) {
    return await this.appService.updateStatus(data);
  }

  @Get('order/ids')
  @ApiOperation({ summary: 'Get all order IDs' })
  async getOrderIds() {
    return this.appService.getOrderIds();
  }

  @Post('order/search')
  @ApiOperation({ summary: 'update order status' })
  async searchOrders(
    @Body() data: { address: string; postalCode: OrderStatus },
  ) {
    return await this.appService.searchOrdersByDropoffAddress(
      data.address,
      data.postalCode,
    );
  }
}
