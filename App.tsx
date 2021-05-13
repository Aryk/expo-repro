import React from "react";
import {Text, View} from "react-native";
import { createNativeStackNavigator} from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native";

const LoggedOutScreen = () => <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
  <Text>
    Don't rotate me
  </Text>
</View>;

const Stack = createNativeStackNavigator();

export default () => {
  return <NavigationContainer>
    <Stack.Navigator  >
      <Stack.Screen name="LoggedOutScreen" component={LoggedOutScreen} />
    </Stack.Navigator>
  </NavigationContainer>
}
