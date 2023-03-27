import { Injectable } from '@nestjs/common';
import { NewRecipeInput } from './dto/new-recipe.input';
import { RecipesArgs } from './dto/recipes.args';
import { Recipe } from './models/recipe.model';

@Injectable()
export class RecipesService {
	/**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

	async create(data: NewRecipeInput): Promise<Recipe> {
		return {
			id: new Date().getTime() + '',
			creationDate: new Date(),
			...data
		} as any;
	}

	async findOneById(id: string): Promise<Recipe> {
		return {
			id: '123'
		} as any;
	}

	async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
		console.log(recipesArgs);
		return [] as Recipe[];
	}

	async remove(id: string): Promise<boolean> {
		return true;
	}
}
