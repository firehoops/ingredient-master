export interface Ingredient {
  name: string;
  value: number;
}

export interface Recipe {
  name: string;
  ingredients: Ingredient[];
  originalServingSize: number;
  newServingSize: number;
}

export function adjustIngredientMeasurement(num: number, percentage: number) {
  if (percentage === 0) return num;
  const adjustedNumber = num * percentage;
  return Math.round(adjustedNumber);
}

export function handleIngredientCalculation(recipe: Recipe) {
  if (recipe.originalServingSize == recipe.newServingSize)
    return recipe.ingredients;
  return recipe.ingredients.map(({name, value}) => {
    const percentage = recipe.newServingSize / recipe.originalServingSize;
    const res = adjustIngredientMeasurement(value, percentage);
    return {name: name, value: res};
  });
}
