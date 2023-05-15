import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.voucherService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.voucherService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.voucherService.delete(id);
  }
}
