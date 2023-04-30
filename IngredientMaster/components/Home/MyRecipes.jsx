import React, {useState, useEffect} from 'react';
import NewRecipeModal from './NewRecipeModal';
import {Text, Box, HStack, IconButton, ScrollView} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions, TouchableOpacity} from 'react-native';

const MyRecipes = ({navigation}) => {
  const [recipes, setRecipes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const boxSize = screenWidth / 1 - 20; // 20 is the margin

  useEffect(() => {
    async function getRecipes() {
      try {
        const recipesString = await AsyncStorage.getItem('recipes');
        if (recipesString) {
          setRecipes(JSON.parse(recipesString));
        }
      } catch (error) {
        console.error(error);
      }
    }

    getRecipes();
  }, []);

  return (
    <>
      <HStack
        alignItems="center"
        style={{
          margin: 15,
          textAlign: 'left',
        }}>
        <Text fontSize="3xl" fontWeight="bold">
          My Recipes
        </Text>
        <IconButton
          icon={<Icon name="plus-circle" size={24} color="black" />}
          onPress={() => setOpenModal(true)}
        />
        <NewRecipeModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          setRecipes={setRecipes}
        />
      </HStack>
      <ScrollView>
        <HStack flexWrap="wrap" justifyContent="space-between" pl={2}>
          {recipes.map((recipe, index) => (
            <TouchableOpacity
              key={recipe.id}
              onPress={() => {
                navigation.navigate('RecipeView', {
                  recipes: recipes,
                  setRecipes: setRecipes,
                  recipe: recipe,
                  recipeIndex: index,
                });
              }}>
              <Box
                bg="white"
                shadow={3}
                rounded="xl"
                p={5}
                width={boxSize}
                mb={4}>
                <Text fontWeight="bold">{recipe.name}</Text>
                <Text>{recipe.description}</Text>
              </Box>
            </TouchableOpacity>
          ))}
        </HStack>
      </ScrollView>
    </>
  );
};
export default MyRecipes;
