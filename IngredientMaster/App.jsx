// https://github.com/necolas/react-native-web
// https://nativebase.io/
// https://github.com/oblador/react-native-vector-icons
// https://www.npmjs.com/package/react-native-swipe-gestures?activeTab=readme
import React from 'react';
import Home from './components/Home/Home';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Recipe from './components/Recipe/Recipe';

function HomeScreen({navigation}) {
  return <Home navigation={navigation} />;
}

const Stack = createNativeStackNavigator();

function RecipeViewScreen({navigation, route}) {
  const recipes = route.params.recipes;
  const setRecipes = route.params.setRecipes;
  const recipe = route.params.recipe;
  const recipeIndex = route.params.recipeIndex;

  return (
    <Recipe
      navigation={navigation}
      recipe={recipe}
      recipeIndex={recipeIndex}
      recipes={recipes}
      setRecipes={setRecipes}
    />
  );
}

const IngredientMaster = () => {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <React.Fragment>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="RecipeView" component={RecipeViewScreen} />
          </Stack.Navigator>
        </React.Fragment>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};
export default IngredientMaster;
