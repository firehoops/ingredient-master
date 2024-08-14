import {
  Ingredient,
  Recipe,
  adjustIngredientMeasurement,
  calculateMeasurement,
  convertUnit,
  handleIngredientCalculation,
  shouldConvertUnit,
} from './Calculate';
import {DECREASE, INCREASE, units} from './Constants';

describe('adjustIngredientMeasurement', () => {
  it('should handle 0', () => {
    expect(adjustIngredientMeasurement(1, 0)).toEqual(1);
  });

  it('should handle whole numbers', () => {
    expect(adjustIngredientMeasurement(1, 2)).toEqual(2);
  });

  it('should handle decimal numbers', () => {
    expect(adjustIngredientMeasurement(0.5, 0.5)).toEqual(0.25);
  });

  it('should handle mixed numbers case 1', () => {
    expect(adjustIngredientMeasurement(4, 0.25)).toEqual(1);
  });

  it('should handle mixed numbers case 2', () => {
    expect(adjustIngredientMeasurement(0.25, 3)).toEqual(0.75);
  });
});

describe('shouldConvertUnit', () => {
  it('should handle decrease and not tsp', () => {
    expect(shouldConvertUnit(0.124, DECREASE, units.CUP)).toEqual(true);
  });

  it('should handle decrease and do nothing since tsp', () => {
    expect(shouldConvertUnit(1, DECREASE, units.TSP)).toEqual(false);
  });

  it('should handle increase and not cup', () => {
    expect(shouldConvertUnit(3, INCREASE, units.TBSP)).toEqual(true);
  });

  it('should handle increase and do nothing since cup', () => {
    expect(shouldConvertUnit(2, INCREASE, units.CUP)).toEqual(false);
  });
});

describe('calculateMeasurement', () => {
  it('should handle unit change down 1', () => {
    expect(calculateMeasurement(0.0625, 16)).toEqual(1);
  });

  it('should handle unit change up 1', () => {
    expect(calculateMeasurement(0.75, 1 / 3)).toEqual(0.25);
  });
});

describe('converUnit', () => {
  it('should handle down 1', () => {
    expect(convertUnit(units.CUP, DECREASE)).toEqual({
      unit: units.TBSP,
      conversion: 16,
    });
  });

  it('should handle up 1', () => {
    expect(convertUnit(units.TSP, INCREASE)).toEqual({
      unit: units.TBSP,
      conversion: 1 / 3,
    });
  });
});

describe('handleIngredientCalculation', () => {
  let recipe = {
    name: 'Test Recipe',
    ingredients: [
      {name: 'Flour', value: 2, unit: 'cup'},
      {name: 'Sugar', value: 4, unit: 'cup'},
    ],
    originalServingSize: 8,
    newServingSize: 4,
  };

  it('should reduce ingredient values based on serving size', () => {
    const expected = [
      {name: 'Flour', value: 1, unit: 'cup'},
      {name: 'Sugar', value: 2, unit: 'cup'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should increase ingredient values based on serving size', () => {
    recipe = {...recipe, originalServingSize: 4, newServingSize: 8};
    const expected = [
      {name: 'Flour', value: 4, unit: 'cup'},
      {name: 'Sugar', value: 8, unit: 'cup'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should not change ingredient values if serving size is the same', () => {
    const sameServingRecipe = {
      name: 'Test Recipe',
      ingredients: [
        {name: 'Flour', value: 2, unit: 'cup'},
        {name: 'Sugar', value: 4, unit: 'cup'},
      ],
      originalServingSize: 4,
      newServingSize: 4,
    };
    expect(handleIngredientCalculation(sameServingRecipe)).toEqual(
      recipe.ingredients,
    );
  });

  it('should decrease and go down unit', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [
        {name: 'Flour', value: 0.125, unit: 'cup'},
        {name: 'Sugar', value: 1, unit: 'cup'},
      ],
      originalServingSize: 4,
      newServingSize: 2,
    };
    const expected = [
      {name: 'Flour', value: 1.008, unit: 'tbsp'},
      {name: 'Sugar', value: 0.5, unit: 'cup'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should increase and not go up a unit due to max', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [
        {name: 'Flour', value: 0.75, unit: 'tbsp'},
        {name: 'Sugar', value: 1, unit: 'cup'},
      ],
      originalServingSize: 2,
      newServingSize: 4,
    };
    const expected = [
      {name: 'Flour', value: 1.5, unit: 'tbsp'},
      {name: 'Sugar', value: 2, unit: 'cup'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should decrease and not go down a unit due to min', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [
        {name: 'Flour', value: 0.25, unit: 'cup'},
        {name: 'Sugar', value: 1, unit: 'cup'},
      ],
      originalServingSize: 4,
      newServingSize: 2,
    };
    const expected = [
      {name: 'Flour', value: 0.125, unit: 'cup'},
      {name: 'Sugar', value: 0.5, unit: 'cup'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should decrease 2 units', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [{name: 'Flour', value: 0.0625, unit: 'cup'}],
      originalServingSize: 12,
      newServingSize: 2,
    };
    const expected = [{name: 'Flour', value: 0.48, unit: 'tsp'}];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should increase 2 units', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [{name: 'Flour', value: 5, unit: 'tsp'}],
      originalServingSize: 2,
      newServingSize: 12,
    };
    const expected = [{name: 'Flour', value: 0.625, unit: 'cup'}];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should increase 2 units and loop', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [{name: 'Flour', value: 6, unit: 'tsp'}],
      originalServingSize: 2,
      newServingSize: 6,
    };
    const expected = [{name: 'Flour', value: 0.375, unit: 'cup'}];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });
});
