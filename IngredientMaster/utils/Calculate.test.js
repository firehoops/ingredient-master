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
  it('should handle no unit change', () => {
    expect(calculateMeasurement(1, units.CUP)).toEqual(1);
  });

  it('should handle unit change down 1', () => {
    expect(
      calculateMeasurement(0.0625, units.CUP, units.TBSP, DECREASE),
    ).toEqual(1);
  });

  it('should handle unit change down 2', () => {
    expect(calculateMeasurement(0.016, units.CUP, units.TSP, DECREASE)).toEqual(
      0.77,
    );
  });

  it('should handle unit change up 1', () => {
    expect(calculateMeasurement(0.75, units.TSP, units.TBSP, INCREASE)).toEqual(
      0.25,
    );
  });

  it('should handle unit change up 2', () => {
    expect(calculateMeasurement(8, units.TSP, units.CUP, INCREASE)).toEqual(
      0.17,
    );
  });
});

describe('converUnit', () => {
  it('should handle down 1', () => {
    expect(convertUnit(0.0625, units.CUP, DECREASE)).toEqual(units.TBSP);
  });

  it('should handle down 2', () => {
    expect(convertUnit(0.02, units.CUP, DECREASE)).toEqual(units.TSP);
  });

  it('should handle up 1', () => {
    expect(convertUnit(2, units.TSP, INCREASE)).toEqual(units.TBSP);
  });

  it('should handle up 2', () => {
    expect(convertUnit(30, units.TSP, INCREASE)).toEqual(units.CUP);
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
      {name: 'Flour', value: 0.96, unit: 'tbsp'},
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
      {name: 'Flour', value: .13, unit: 'cup'},
      {name: 'Sugar', value: .5, unit: 'cup'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should decrease 2 units', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [
        {name: 'Flour', value: 0.125, unit: 'cup'},
      ],
      originalServingSize: 8,
      newServingSize: 2,
    };
    const expected = [
      {name: 'Flour', value: 1.44, unit: 'tsp'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });

  it('should increase 2 units', () => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [
        {name: 'Flour', value: 5, unit: 'tsp'},
      ],
      originalServingSize: 2,
      newServingSize: 12,
    };
    const expected = [
      {name: 'Flour', value: .63, unit: 'cup'},
    ];
    expect(handleIngredientCalculation(recipe)).toEqual(expected);
  });
});
