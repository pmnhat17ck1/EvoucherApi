import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher, VoucherDocument } from './schema/voucher.schema';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name)
    private voucherModel: Model<VoucherDocument>,
  ) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const createdVoucher = new this.voucherModel(createVoucherDto);
    return createdVoucher.save();
  }

  async findAll(): Promise<Voucher[]> {
    return this.voucherModel.find().exec();
  }

  async findOne(Params): Promise<Voucher> {
    return this.voucherModel.findOne({ Params }).exec();
  }

  async findByCode(code: string): Promise<Voucher> {
    return this.voucherModel.findOne({ code }).exec();
  }

  async findById(id: string): Promise<Voucher> {
    return this.voucherModel.findById(id).exec();
  }

  async update(
    id: string,
    updateVoucherDto: UpdateVoucherDto,
  ): Promise<Voucher> {
    return this.voucherModel
      .findByIdAndUpdate(id, updateVoucherDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Voucher> {
    return this.voucherModel.findByIdAndRemove(id).exec();
  }
}
