import React, {useCallback, useEffect, useState} from "react";
import {Alert, Button, Text, TextInput, View} from "react-native";
import {AppState, AppStateStatus} from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import Constants from "expo-constants";
import {LocationAccuracy} from "expo-location";

const backgroundLocationUpdateTaskName = "background-location-update";

interface IBackgroundLocationUpdate {
  data: {locations?: Location.LocationObject[] };
  error: any;
}
TaskManager.defineTask(
  backgroundLocationUpdateTaskName,
  function updateBackgroundLocation({ data: { locations }, error }: IBackgroundLocationUpdate) {
    if (error) {
      throw error.message;
    } else {
      console.log(`updateLocation: ${JSON.stringify(locations)}`);
    }
  },
);

const ref = React.createRef<boolean>();
Notifications.addNotificationResponseReceivedListener(
  response => Alert.alert("", "It worked!")
);

export default () => {
  const [token, setToken] = useState<string>();
  const [counter, setCounter] = useState<number>(0);

  useEffect(
    () => {
      const interval = setInterval(() => setCounter(c => c + 1), 50);
      return () => clearInterval(interval);
    }
  );

  // Start async background location update
  // Directions are here: https://docs.expo.io/versions/latest/sdk/location/#locationstartlocationupdatesasynctaskname-options
  const start = useCallback(() => {
    Location.startLocationUpdatesAsync(backgroundLocationUpdateTaskName, {
      // Lowest = 3KM, Low = 1 KM, Balanced = 100M, High = 10M, Highest = 1M
      // We use High, which is accurate to within 10m, should be enough for this app, since we don't do maps.
      accuracy: LocationAccuracy.High,
      timeInterval: 60000, // in ms
      //  Receive updates only when the location has changed by at least this distance in meters
      distanceInterval: 60000,
      // foregroundService: {
      //   notificationTitle: "Highlife Background Update",
      //   notificationBody: "We're updating the background... ",
      // },
    });

    return () => Location.stopLocationUpdatesAsync(backgroundLocationUpdateTaskName);
  }, []);

  // Only want the location updating task to run when app is foregrounded.
  const WhenInUse = useCallback(() => {
    useEffect(() => {
      AppState.addEventListener("change", start);
      return () => AppState.removeEventListener("change", start);
    }, [start]);
    return null;
  }, []);

  return <View style={{paddingTop: 200}}>
    {counter > 2 && <WhenInUse />}
    <Button title="Get Token" onPress={async () => {
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status === "granted") {
        const expoPushTokenResponse = await Notifications.getExpoPushTokenAsync();
        setToken(expoPushTokenResponse.data)
      }
    }} />
    <Button title="Did it work?" onPress={() => Alert.alert("", `result: ${ref.current}`)} />
    <Text>Token</Text>
    <TextInput value={token}/>
    <Text>Manifest revisionId: {Constants.manifest.revisionId}</Text>
  </View>;
}
