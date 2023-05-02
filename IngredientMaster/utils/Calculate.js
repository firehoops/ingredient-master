import {DECREASE, INCREASE, units} from './Constants';

const unitConversions = {
  tsp: {
    incr: {unit: units.TBSP, conversion: 1 / 3}, //incr
    max: 1,
  },
  tbsp: {
    min: 1 / 4,
    max: 2,
    decr: {unit: units.TSP, conversion: 3}, //decr
    incr: {unit: units.CUP, conversion: 1 / 16}, //incr
  },
  cup: {
    decr: {unit: units.TBSP, conversion: 16}, //decr
    min: 1 / 8,
  },
};

export function adjustIngredientMeasurement(num, ratio) {
  if (ratio === 0) return num;
  const adjustedNumber = num * ratio;
  // round to 2 decimal places
  return Math.round(adjustedNumber * 1000) / 1000;
}

export function shouldConvertUnit(val, direction, unit) {
  console.log('convert unit ' + unit + ' val ' + val + ' og ' + direction);
  if (direction === DECREASE) {
    // check min to see if shuold drop units. Tsp min
    return unit !== units.TSP && val < unitConversions[unit].min;
  }
  // check max to see if should go up units. Cup max
  return unit !== units.CUP && val > unitConversions[unit].max;
}

export function convertUnit(unit, direction) {
  return unitConversions[unit][direction];
}

export function calculateMeasurement(val, conversion) {
  // round 2 decimal places
  return Math.round(val * conversion * 1000) / 1000;
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
    let resVal = adjustedVal;
    let resUnit = unit;
    while (shouldConvertUnit(resVal, direction, resUnit)) {
      console.log('unit ' + resUnit + ' val ' + resVal + ' og ' + adjustedVal);
      
      conversion = unitConversions[resUnit][direction].conversion;
      resUnit = unitConversions[resUnit][direction].unit;
      console.log('new unit ' + resUnit)
      console.log('new conversion ' + conversion)
      resVal = calculateMeasurement(resVal, conversion);
      console.log('new value ' + resVal)
      // TODO add fraction rounding
      // TODO handle converting unit after new measurement. (e.g hitting max after conversion)
    }
    return {name: name, value: resVal, unit: resUnit};
  });
}
