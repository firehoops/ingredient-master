import React from 'react';
import {NativeBaseProvider, Box} from 'native-base';
import MyRecipes from './MyRecipes';

const Home = () => {

  return (
    <NativeBaseProvider>
      <React.Fragment>
        <Box safeArea>
          <MyRecipes />
        </Box>
      </React.Fragment>
    </NativeBaseProvider>
  );
};
export default Home;
