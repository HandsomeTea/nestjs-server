import { graphqlFieldDeal } from '@/middlewares';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'recipe' })
export class Recipe {
	@Field(() => ID)
		id: string;

	// Directive和Field顺序可随意
	@Directive('@upper')
	@Field({ middleware: [graphqlFieldDeal] })
		title: string;

	@Field({ nullable: true })
		description?: string;

	@Field()
		creationDate: Date;

	@Field(() => [String])
		ingredients: string[];
}
