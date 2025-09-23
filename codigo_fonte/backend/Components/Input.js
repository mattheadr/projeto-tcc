import React from 'react';
import { TextInput, View, Text } from 'react-native';

export default function Input({ label, value, onChangeText, secureTextEntry, keyboardType }) {
  return (
    <View style={{ marginVertical: 8 }}>
      {label && <Text style={{ fontSize: 14, marginBottom: 4 }}>{label}</Text>}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#3D3A3A',
          padding: 12,
          borderRadius: 10,
          backgroundColor: '#fff',
        }}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}
