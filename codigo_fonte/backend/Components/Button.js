import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#0CC0DF',
        padding: 14,
        marginVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{title}</Text>
    </TouchableOpacity>
  );
}
