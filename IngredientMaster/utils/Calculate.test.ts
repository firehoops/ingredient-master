import { Ingredient, Recipe, adjustIngredientMeasurement, handleIngredientCalculation } from './Calculate';

describe('adjustIngredientMeasurement', () => {
  it('should increase a number by a percentage', () => {
    expect(adjustIngredientMeasurement(1, 2)).toEqual(2);
  });

  it('should decrease a number by a percentage', () => {
    expect(adjustIngredientMeasurement(2, .5)).toEqual(1);
  });

  it('should not change a number if percentage is 0', () => {
    expect(adjustIngredientMeasurement(5, 0)).toEqual(5);
  });
});

describe('handleIngredientCalculation', () => {
  let recipe: Recipe = {
    name: 'Test Recipe',
    ingredients: [
      { name: 'Flour', value: 2 },
      { name: 'Sugar', value: 4 }
    ],
    originalServingSize: 8,
    newServingSize: 4
  };

  it('should reduce ingredient values based on serving size', () => {
    const expected: Ingredient[] = [
      { name: 'Flour', value: 1 },
      { name: 'Sugar', value: 2 }
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should increase ingredient values based on serving size', () => {
    recipe = {...recipe, originalServingSize: 4, newServingSize: 8}
    const expected: Ingredient[] = [
      { name: 'Flour', value: 4 },
      { name: 'Sugar', value: 8 }
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should not change ingredient values if serving size is the same', () => {
    const sameServingRecipe: Recipe = {
      name: 'Test Recipe',
      ingredients: [
        { name: 'Flour', value: 2 },
        { name: 'Sugar', value: 4 }
      ],
      originalServingSize: 4,
      newServingSize: 4
    };
    expect(handleIngredientCalculation(sameServingRecipe)).toEqual(recipe.ingredients);
  });
});