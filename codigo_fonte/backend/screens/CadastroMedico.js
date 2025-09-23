import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../config/api';

export default function CadastroMedico({ navigation }) {
  const [form, setForm] = useState({ crm: '', email: '', telefone: '', senha: '' });
  const set = (k, v) => setForm({ ...form, [k]: v });

  async function handle() {
    try {
      const res = await fetch(api.base + '/auth/medico/register', {
        method: 'POST',
        headers: api.headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro');
      Alert.alert('Sucesso', 'Cadastro realizado');
      navigation.replace('LoginMedico');
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
      <Header title="Cadastro Médico" />
      <View style={{ padding: 16 }}>
        <Input label="CRM" value={form.crm} onChangeText={(t) => set('crm', t)} />
        <Input label="Email" value={form.email} onChangeText={(t) => set('email', t)} />
        <Input label="Telefone" value={form.telefone} onChangeText={(t) => set('telefone', t)} />
        <Input label="Senha" value={form.senha} onChangeText={(t) => set('senha', t)} secureTextEntry />
        <Button title="Cadastrar" onPress={handle} />
      </View>
    </View>
  );
}
