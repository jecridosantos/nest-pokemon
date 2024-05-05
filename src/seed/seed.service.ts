import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {

  }


  async executeSeed() {

    /*await this.pokemonModel.deleteMany({});
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');
    const insertPromisesArray = [];
    data.results.forEach(//async 
      ({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2]
        //   await this.pokemonModel.create({name, no} );
        insertPromisesArray.push(
          this.pokemonModel.create({ name, no })
        );
      });
    await Promise.all(insertPromisesArray);

    return data.results;
    */


    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');
    const pokemonToInsert = [];
    data.results.forEach(//async 
      ({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2]
        //   await this.pokemonModel.create({name, no} );
        pokemonToInsert.push({ name, no });
      });
    await this.pokemonModel.insertMany(pokemonToInsert);

    return data.results;
  }

}
