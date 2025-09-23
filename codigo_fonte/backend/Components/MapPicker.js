import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapPicker({ onChange }) {
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setMarker(loc.coords);
      onChange && onChange(loc.coords);
    })();
  }, []);

  if (!location) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0CC0DF" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={(e) => {
        setMarker(e.nativeEvent.coordinate);
        onChange && onChange(e.nativeEvent.coordinate);
      }}
    >
      {marker && <Marker coordinate={marker} />}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    borderRadius: 10,
    marginVertical: 8,
  },
});
