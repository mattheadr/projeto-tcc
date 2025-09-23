import React from 'react';
import { View, Text } from 'react-native';

export default function Header({ title }) {
  return (
    <View
      style={{
        backgroundColor: '#3F5C62',
        padding: 20,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#E8E8E8', fontSize: 22, fontWeight: '700' }}>{title}</Text>
    </View>
  );
}
