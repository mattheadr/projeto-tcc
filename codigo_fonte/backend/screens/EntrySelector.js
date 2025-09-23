import React from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import Header from '../components/Header';

export default function EntrySelector({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
      <Header title="NewCheck" />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 12 }}>Entrar como</Text>
        <Button title="Sou Cliente" onPress={() => navigation.navigate('LoginCliente')} />
        <Button title="Sou Médico" onPress={() => navigation.navigate('LoginMedico')} />
        <Text style={{ marginTop: 20 }}>Ainda não tem conta?</Text>
        <Button title="Cadastrar Cliente" onPress={() => navigation.navigate('CadastroCliente')} />
        <Button title="Cadastrar Médico" onPress={() => navigation.navigate('CadastroMedico')} />
      </View>
    </View>
  );
}
