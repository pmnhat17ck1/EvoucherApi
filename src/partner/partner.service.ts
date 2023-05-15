import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partner, PartnerDocument } from './schema/partner.schema';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name)
    private partnerModel: Model<PartnerDocument>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const createdPartner = new this.partnerModel(createPartnerDto);
    return createdPartner.save();
  }

  async findAll(): Promise<Partner[]> {
    return this.partnerModel.find().exec();
  }

  async findOne(Params): Promise<Partner> {
    return this.partnerModel.findOne({ Params }).exec();
  }

  async findByUsername(username: string): Promise<Partner> {
    return this.partnerModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<Partner> {
    return this.partnerModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    return this.partnerModel
      .findByIdAndUpdate(id, updatePartnerDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Partner> {
    return this.partnerModel.findByIdAndRemove(id).exec();
  }
}
