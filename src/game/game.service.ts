import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schema/Game.schema';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  async findOne(Params): Promise<Game> {
    return this.gameModel.findOne({ Params }).exec();
  }

  async findByName(name: string): Promise<Game> {
    return this.gameModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<Game> {
    return this.gameModel.findById(id).exec();
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    return this.gameModel
      .findByIdAndUpdate(id, updateGameDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Game> {
    return this.gameModel.findByIdAndRemove(id).exec();
  }
}
