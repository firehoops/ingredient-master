// https://github.com/necolas/react-native-web
// https://nativebase.io/
// https://github.com/oblador/react-native-vector-icons
import React from 'react';
import Home from './components/Home/Home';
import {NativeBaseProvider} from 'native-base';

const IngredientMaster = () => {
  return (
    <NativeBaseProvider>
      <React.Fragment>
        <Home />
      </React.Fragment>
    </NativeBaseProvider>
  );
};
export default IngredientMaster;
