import React, {useEffect, useRef} from "react";
import {Alert, Button, Text, View} from "react-native";
import Constants, {AppOwnership} from "expo-constants";

const Branch = Constants.appOwnership === AppOwnership.Expo ? undefined : require("expo-branch").default;

const App = () => {
  const branchRef = useRef<any>();

  const createBranchUniversalObject = async () => {
    if (Branch) {
      branchRef.current = await Branch.createBranchUniversalObject(
        `test`,
        {
          title: "Title",
          contentImageUrl: "http://d279m997dpfwgl.cloudfront.net/wp/2020/05/pencil-standardized-test-1000x667.jpg",
          contentDescription: "Random image off the internet",
          // This metadata can be used to easily navigate back to this screen
          // when implementing deep linking with `Branch.subscribe`.
          metadata: {
            screen: 'articleScreen',
          },
        }
      );
    }
  };

  useEffect(
    () => {
      createBranchUniversalObject();
    },
    [],
  );

  const onPress = async () => {
    if (branchRef.current) {
      Alert.alert(undefined, "Trying to generate url!")
      // TO have this part freeze and crash on Android, simply add "fallbackToCacheTimeout": 30000,
      // to app.json
      const {url} = await branchRef.current.generateShortUrl();
      Alert.alert(undefined, `Success! Generated url: ${url}`)
    }
  };

  return <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
    <View style={{height: "55%"}}>
      <Button onPress={onPress} title="geturl" />
    </View>
  </View>
};

export default App
