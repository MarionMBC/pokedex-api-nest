import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon: Pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      switch (error.code) {
        case 11000:
          throw new BadRequestException(
            `Record ${JSON.stringify(error.keyValue)} already exist.`,
          );
        default:
          throw new InternalServerErrorException(`Can't create record.`);
      }
    }
  }

  async findAll() {
    try {
      const pokemonList = await this.pokemonModel.find();
      return pokemonList;
    } catch (error) {
      throw new InternalServerErrorException(`Can't resolve the request`);
    }
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findOne({ _id: term });

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase(),
      });

    if (!pokemon)
      throw new NotFoundException(`Can't find record with param: ${term}`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let { id } = await this.findOne(term);
    try {
      if (id) await this.pokemonModel.updateOne({ _id: id }, updatePokemonDto);
      return await this.findOne(term);
    } catch (error) {
      switch (error.code) {
        case 11000:
          throw new BadRequestException(
            `Record ${JSON.stringify(error.keyValue)} already exist.`,
          );
        default:
          throw new InternalServerErrorException(`Can't create record.`);
      }
    }
  }

  async remove(id: string) {
    const {deletedCount, acknowledged} = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount === 0) throw new BadRequestException(`Object with id ${id} not found.`);
    return `Object with Id: ${id} deleted successfully`;
  }
}

