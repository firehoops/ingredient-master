import {DECREASE, INCREASE, units} from './Constants';

const unitConversions = {
  tsp: {
    tbsp: {incr: 1 / 3, decr: 3},
    cup: {incr: 1 / 48, decr: 48},
    max: 1,
  },
  tbsp: {
    min: 1 / 3,
    tsp: {incr: 1 / 3, decr: 3},
    cup: {incr: 1 / 16, decr: 16},
    max: 2,
  },
  cup: {
    tsp: {incr: 1 / 48, decr: 48},
    tbsp: {incr: 1 / 16, decr: 16},
    min: 1 / 8,
  },
};

export function adjustIngredientMeasurement(num, ratio) {
  if (ratio === 0) return num;
  const adjustedNumber = num * ratio;
  // round to 2 decimal places
  return Math.round(adjustedNumber * 100) / 100;
}

export function shouldConvertUnit(val, direction, unit) {
  if (direction === DECREASE) {
    // check min to see if shuold drop units. Tsp min
    return unit !== units.TSP && val < unitConversions[unit].min;
  }
  // check max to see if should go up units. Cup max
  return unit !== units.CUP && val > unitConversions[unit].max;
}

export function convertUnit(value, unit, direction) {
  let closestVal = Infinity;
  let resUnit = unit;
  const revDirection = direction === INCREASE ? DECREASE : INCREASE;
  for ([newUnit, vals] of Object.entries(unitConversions[unit])) {
    if (['min', 'max'].includes(newUnit)) continue;

    if (Math.abs(vals[revDirection] - value) < closestVal) {
      closestVal = Math.abs(vals[revDirection] - value);
      resUnit = newUnit;
    }
  }
  return resUnit;
}

export function calculateMeasurement(
  val,
  ogUnit,
  newUnit = null,
  direction = null,
) {
  // unit did not change
  if (!newUnit) {
    return val;
  }
  // round 2 decimal places
  return (
    Math.round(val * unitConversions[ogUnit][newUnit][direction] * 100) / 100
  );
}

export function handleIngredientCalculation(recipe) {
  if (recipe.originalServingSize == recipe.newServingSize)
    return recipe.ingredients;
  const direction =
    recipe.originalServingSize > recipe.newServingSize ? DECREASE : INCREASE;
  const ratio = recipe.newServingSize / recipe.originalServingSize;
  // simple same measurement
  // new: 4, orig: 8,  val: .125, unit: cup, direction: decr => .5 * .125 (.0625) => .0625 < min of 1/8 => tbsp[cup][decr] = .0625 * 16 (1)

  // decr down a unit
  // new: 2 & orig: 8  val: .33 unit: cup, direction: decr => .25 * .33 (.0825) =>  .0825 < max => .0625 < .0825 < .125  => tbsp[cup][decr] = .0825 * 16 (1.32)

  // incr up a unit
  // new: 8 & orig: 4  val: 1tbsp direction: incr => 2 * 1 (2) => compare (tbsp max 1 => cup ) => cup[tbsp][incr] = 2 * 1/16 (1/8)

  return recipe.ingredients.map(({name, unit, value}) => {
    const adjustedVal = adjustIngredientMeasurement(value, ratio);
    let resVal = 0;
    let resUnit = unit
    if (shouldConvertUnit(adjustedVal, direction, unit)) {
      resUnit = convertUnit(adjustedVal, unit, direction);
      resVal = calculateMeasurement(adjustedVal, unit, resUnit, direction);
      // TODO add fraction rounding
      // TODO handle converting unit after new measurement. (e.g hitting max after conversion)
    } else {
      resVal = calculateMeasurement(adjustedVal, unit);
    }
    return {name: name, value: resVal, unit: resUnit};
  });
}
