import React, {useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  IconButton,
  HStack,
  VStack,
  FormControl,
  Input,
  Select,
  Spacer,
  Button,
  Modal,
  ScrollView,
  Slider,
  Popover,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox} from 'react-native';

// ignoring error thrown by passing setState in through navigation
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Recipe = ({navigation, recipes, recipe, recipeIndex, setRecipes}) => {
  const wholeNums = ['-'];
  for (let i = 1; i <= 99; i++) {
    wholeNums.push(i.toString());
  }
  const fractions = ['-', '1/4', '1/3', '1/2', '2/3', '3/4'];

  const [ingredients, setIngredients] = useState(
    recipe.ingredients || [{name: '', amount: '', unit: ''}],
  );

  const [showAmountModal, setShowAmountModal] = useState(false);
  const [editRecipe, setEditRecipe] = useState(false);
  const [recipeName, setRecipeName] = useState(recipe.name);
  const [recipeDescription, setRecipeDescription] = useState(
    recipe.description,
  );
  const [servingSize, setServingSize] = useState(recipe.servings || 0);

  const [wholeNum, setWholeNum] = useState('');
  const [fraction, setFraction] = useState('');
  const [ingredientIndex, setIngredientIndex] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, {name: '', amount: '', unit: ''}]);
  };

  const deleteIngredient = index => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    setShowDelete(false);
  };

  //   add new values to the recipe, re-set the state, and save back to async storage
  async function saveRecipe() {
    recipe.name = recipeName;
    recipe.description = recipeDescription;
    recipe.ingredients = ingredients;
    recipe.servings = servingSize;

    recipes[recipeIndex] = recipe;
    const newRecipes = [...recipes];
    setRecipes(newRecipes);
    setEditRecipe(false);

    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(newRecipes));
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteRecipe() {
    let newRecipes = [...recipes];
    newRecipes.splice(recipeIndex, 1);
    setRecipes(newRecipes);

    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(newRecipes));
    } catch (error) {
      console.log(error);
    }

    navigation.navigate('Home');
  }

  return (
    <NativeBaseProvider>
      <React.Fragment>
        <Box
          safeArea
          style={{
            margin: 10,
            textAlign: 'left',
          }}>
          <HStack alignItems="center" justifyContent="space-between">
            {editRecipe ? (
              <>
                <IconButton
                  icon={<Icon name="arrow-left" size={24} color="black" />}
                  onPress={() => {
                    setEditRecipe(false);
                  }}
                />
                <Box flex={1} />
                <IconButton
                  icon={
                    <>
                      <Icon name="delete" size={24} color="red" />
                      <Text color="red.500"> Delete</Text>
                    </>
                  }
                  onPress={() => deleteRecipe()}
                />
                <IconButton
                  icon={<Icon name="check" size={24} color="black" />}
                  onPress={() => saveRecipe()}
                />
              </>
            ) : (
              <>
                <IconButton
                  icon={<Icon name="arrow-left" size={24} color="black" />}
                  onPress={() => navigation.navigate('Home')}
                />
                <IconButton
                  icon={<Icon name="pencil" size={24} color="black" />}
                  onPress={() => setEditRecipe(true)}
                />
              </>
            )}
          </HStack>
          <ScrollView>
            <VStack>
              {editRecipe ? (
                <>
                  {/*  Edit View */}

                  <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                      fontWeight="bold"
                      placeholder="Recipe name"
                      value={recipeName}
                      onChangeText={setRecipeName}></Input>
                  </FormControl>

                  <FormControl style={{marginTop: 5}}>
                    <FormControl.Label>Description</FormControl.Label>
                    <Input
                      placeholder="Recipe description"
                      value={recipeDescription}
                      onChangeText={setRecipeDescription}></Input>
                  </FormControl>

                  <Text fontWeight="bold" fontSize="xl" style={{marginTop: 15}}>
                    Ingredients
                  </Text>

                  {ingredients.map((ingredient, index) => (
                    <Box key={index} style={{marginTop: 10}}>
                      <HStack>
                        {showDelete ? (
                          <>
                            <IconButton
                              icon={
                                <Icon name="delete" size={16} color="black" />
                              }
                              onPress={() => {
                                deleteIngredient(index);
                              }}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                        <FormControl flex={2}>
                          <Input
                            placeholder="Ingredient Name"
                            value={ingredient.name}
                            onChangeText={value =>
                              handleIngredientChange(index, 'name', value)
                            }></Input>
                        </FormControl>

                        <FormControl flex={0.8} style={{marginLeft: 25}}>
                          <Input
                            onPressIn={() => {
                              setShowAmountModal(true);
                              setIngredientIndex(index);
                            }}
                            placeholder="Amount"
                            value={ingredient.amount}></Input>
                        </FormControl>

                        <FormControl flex={1.125} style={{marginLeft: 5}}>
                          <Select
                            placeholder="Unit"
                            selectedValue={ingredient.unit}
                            onValueChange={value =>
                              handleIngredientChange(index, 'unit', value)
                            }>
                            <Select.Item label="Cup" value="Cup" />
                            <Select.Item label="Gram" value="Gram" />
                            <Select.Item label="Ounce" value="Ounce" />
                            <Select.Item label="Pound" value="Pound" />
                          </Select>
                        </FormControl>
                      </HStack>
                    </Box>
                  ))}
                  <HStack justifyContent="space-evenly">
                    <IconButton
                      style={{marginTop: 5}}
                      icon={
                        <>
                          <Icon name="hamburger-plus" size={24} color="black" />
                          <Text> Add Ingredient</Text>
                        </>
                      }
                      onPress={handleAddIngredient}
                    />
                    <IconButton
                      style={{marginTop: 5}}
                      icon={
                        <>
                          <Icon
                            name="hamburger-minus"
                            size={24}
                            color="black"
                          />
                          <Text> Delete Ingredient</Text>
                        </>
                      }
                      onPress={() => {
                        setShowDelete(true);
                      }}
                    />
                  </HStack>

                  <Text fontWeight="bold" fontSize="xl" style={{marginTop: 15}}>
                    Servings
                  </Text>

                  <Box
                    alignItems="center"
                    w="100%"
                    style={{marginTop: 10, marginBottom: 10}}>
                    <Text fontWeight="bold">{servingSize}</Text>
                    <Slider
                      size="lg"
                      w="3/4"
                      maxW="300"
                      defaultValue={servingSize}
                      minValue={0}
                      maxValue={12}
                      accessibilityLabel="Serving Slider"
                      sliderValue="12"
                      step={2}
                      onChangeEnd={setServingSize}>
                      <Slider.Track>
                        <Slider.FilledTrack />
                      </Slider.Track>
                      <Slider.Thumb />
                    </Slider>
                  </Box>
                </>
              ) : (
                <>
                  {/*  Normal View */}
                  <Text fontWeight="bold" fontSize="3xl">
                    {recipe.name}
                  </Text>
                  <Text flexWrap="wrap">{recipe.description}</Text>

                  <Text fontWeight="bold" fontSize="xl" style={{marginTop: 15}}>
                    Ingredients
                  </Text>
                  {ingredients.length >= 1 ? (
                    ingredients.map((ingredient, index) => (
                      <Box key={index} style={{marginTop: 10}}>
                        <HStack>
                          <Text flex={2}>{ingredient.name}</Text>
                          <Text flex={1}>{ingredient.amount}</Text>
                          <Text flex={1}>{ingredient.unit}</Text>
                        </HStack>
                      </Box>
                    ))
                  ) : (
                    <>
                      <Text style={{marginTop: 3}}>
                        Click the pencil to add ingredients!
                      </Text>
                    </>
                  )}

                  <Text fontWeight="bold" fontSize="xl" style={{marginTop: 15}}>
                    Servings
                  </Text>
                  {servingSize ? (
                    <>
                      <Box
                        alignItems="center"
                        w="100%"
                        style={{marginTop: 10, marginBottom: 10}}>
                        <Text fontWeight="bold">{servingSize}</Text>
                        <Slider
                          size="lg"
                          w="3/4"
                          maxW="300"
                          defaultValue={servingSize}
                          minValue={2}
                          maxValue={12}
                          accessibilityLabel="Serving Slider"
                          sliderValue="12"
                          step={2}
                          onChangeEnd={setServingSize}>
                          <Slider.Track>
                            <Slider.FilledTrack />
                          </Slider.Track>
                          <Slider.Thumb />
                        </Slider>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text style={{marginTop: 3}}>
                        Click the pencil to adjust serving size!
                      </Text>
                    </>
                  )}
                </>
              )}
            </VStack>
          </ScrollView>
        </Box>

        {/* Amount Modal */}
        <Modal
          isOpen={showAmountModal}
          onClose={() => setShowAmountModal(false)}
          size="full"
          animationPreset="slide"
          avoidKeyboard={false}>
          <Modal.Content
            style={{
              marginTop: 'auto',
              marginBottom: 0,
              height: '35%',
              borderRadius: 20,
            }}>
            <HStack justifyContent="center">
              <ScrollPicker
                dataSource={wholeNums}
                selectedIndex={0}
                renderItem={(data, index) => {
                  return <Text key={index}>{data}</Text>;
                }}
                onValueChange={(data, selectedIndex) => {
                  setWholeNum(data);
                  handleIngredientChange(
                    ingredientIndex,
                    'amount',
                    data + ' ' + fraction,
                  );
                }}
                wrapperHeight={300}
                wrapperWidth={250}
                wrapperColor="#FFFFFF"
                itemHeight={60}
                highlightColor="#414141"
                highlightBorderWidth={2}
              />
              <ScrollPicker
                dataSource={fractions}
                selectedIndex={0}
                renderItem={(data, index) => {
                  return <Text key={index}>{data}</Text>;
                }}
                onValueChange={(data, selectedIndex) => {
                  setFraction(data);
                  handleIngredientChange(
                    ingredientIndex,
                    'amount',
                    wholeNum + ' ' + data,
                  );
                }}
                wrapperHeight={300}
                wrapperWidth={250}
                wrapperColor="#FFFFFF"
                itemHeight={60}
                highlightColor="#414141"
                highlightBorderWidth={2}
              />
            </HStack>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    </NativeBaseProvider>
  );
};
export default Recipe;
