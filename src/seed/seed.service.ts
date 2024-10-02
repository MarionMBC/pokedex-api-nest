import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';


interface PokemonInterface {
  name: string,
  no: number
}


@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}


  private readonly axios: AxiosInstance = axios;

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=99999')
    
    const pokemonToInsert:PokemonInterface[] = [];
  
    data.results.forEach( async({name, url}) => {
      const segments = url.split('/')
      const no = +segments[segments.length-2];
      // const pokemon = await this.pokemonModel.create({name, no})
      pokemonToInsert.push({name, no})
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed'
  }



  
  
}
