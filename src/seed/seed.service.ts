import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
 
  private readonly axios: AxiosInstance = axios;
  private pokemonList = [];

  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')
    data.results.forEach(({name, url: no}) => {
      const segments = no.split('/')
      const pokemonNumber = +segments[segments.length-2];
      this.pokemonList.push({name:name, no: pokemonNumber})
    })
    return this.pokemonList;
  }
  
  
}
