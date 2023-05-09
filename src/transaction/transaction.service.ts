import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schema/Transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createUserDto: CreateTransactionDto): Promise<Transaction> {
    const createdUser = new this.transactionModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(Params): Promise<Transaction> {
    return this.transactionModel.findOne({ Params }).exec();
  }

  async findByUsername(username: string): Promise<Transaction> {
    return this.transactionModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<Transaction> {
    return this.transactionModel.findById(id).exec();
  }

  async update(
    id: string,
    UpdateUserDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionModel
      .findByIdAndUpdate(id, UpdateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Transaction> {
    return this.transactionModel.findByIdAndRemove(id).exec();
  }
}
