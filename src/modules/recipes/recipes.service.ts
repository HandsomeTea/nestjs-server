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
		};
	}

	async findOneById(id: string): Promise<Recipe> {
		return (global.arr || []).find(a => a.id === id) || {};
	}

	async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
		return global.arr || [].filter((a, b) => b >= recipesArgs.skip && b < recipesArgs.take) as Recipe[];
	}

	async remove(id: string): Promise<boolean> {
		return global.arr = (global.arr || []).filter(a => a.id !== id);
	}
}
