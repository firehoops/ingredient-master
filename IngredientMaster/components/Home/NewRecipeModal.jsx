import React, {useState} from 'react';
import {Button, Modal, FormControl, Input, Toast} from 'native-base';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewRecipeModal = ({isOpen, onClose, setRecipes}) => {
  const [recipeName, setRecipeName] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');


  async function handleSubmit() {
    // check for invalid form
    if (!recipeName) {
      Toast.show({
        status: 'error',
        description: 'Please enter a recipe name',
        placement: 'top',
        bg: 'red.500',
      });
      return;
    }

    // save new recipe using AsyncStorage
    try {
      const uniqueId = uuid.v4();
      const existingRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = JSON.parse(existingRecipes) || [];
      const newRecipe = {
        id: uniqueId,
        name: recipeName,
        description: recipeDescription,
      };
      const updatedRecipes = [newRecipe, ...parsedRecipes];      

      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));

      setRecipeName('');
      setRecipeDescription('');
      setRecipes(updatedRecipes)
      onClose();
    } catch (error) {
      console.log(error);

      Toast.show({
        status: 'error',
        description: 'Failed to save recipe',
        placement: 'top',
        bg: 'red.500',
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>New Recipe</Modal.Header>
        <Modal.Body>
          <FormControl isRequired isInvalid={!recipeName}>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              placeholder="Enter a recipe name"
              value={recipeName}
              onChangeText={setRecipeName}
            />
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>Description</FormControl.Label>
            <Input
              placeholder="Enter a brief description"
              value={recipeDescription}
              onChangeText={setRecipeDescription}
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                onClose();
              }}>
              Cancel
            </Button>
            <Button onPress={handleSubmit}>Create</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
export default NewRecipeModal;