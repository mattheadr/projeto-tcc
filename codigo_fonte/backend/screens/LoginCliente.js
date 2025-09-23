import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { saveSession } from '../utils/auth';
import { api } from '../config/api';

export default function LoginCliente({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  async function handle() {
    try {
      const res = await fetch(api.base + '/auth/cliente/login', {
        method: 'POST',
        headers: api.headers,
        body: JSON.stringify({ cpf, senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro');
      await saveSession({ token: data.token, role: data.role, id: data.id });
      Alert.alert('Sucesso', 'Logado');
      navigation.replace('RequestConsult');
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
      <Header title="Login Cliente" />
      <View style={{ padding: 16 }}>
        <Input label="CPF" value={cpf} onChangeText={setCpf} />
        <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <Button title="Entrar" onPress={handle} />
      </View>
    </View>
  );
}
