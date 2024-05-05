import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {

    this.defaultLimit = configService.get<number>('default_limit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne(query: string) {

    let pokemon: Pokemon;

    if (!isNaN(+query)) {
      pokemon = await this.pokemonModel.findOne({ no: query });
    }

    // MongoID
    if (!pokemon && isValidObjectId(query)) {
      pokemon = await this.pokemonModel.findById(query);
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: query.toLowerCase().trim() });
    }


    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${query}" not found`)

    return pokemon;
  }

  async update(query: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(query);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto);


      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this.handleExceptions(error);
    }
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code = 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
    throw new InternalServerErrorException(`Error on service - Check server logs`)
  }
}
