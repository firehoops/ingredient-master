import React from 'react';
import {NativeBaseProvider, Box} from 'native-base';
import MyRecipes from './MyRecipes';

const Home = ({navigation}) => {

  return (
    <NativeBaseProvider>
      <React.Fragment>
        <Box safeArea>
          <MyRecipes navigation={navigation} />
        </Box>
      </React.Fragment>
    </NativeBaseProvider>
  );
};
export default Home;
