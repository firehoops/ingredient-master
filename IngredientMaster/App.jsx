// https://github.com/necolas/react-native-web

import React from 'react';
import { Button, Chip, IconButton } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// https://github.com/oblador/react-native-vector-icons


const IngredientMaster = () => {
  return (
    <React.Fragment>
      <Chip disabled style={{ alignSelf: "center", marginTop: 40 }}>
        <IconButton icon={props => <Icon name="account" {...props} />} />

      </Chip>
    </React.Fragment>
  );
}
export default IngredientMaster;