import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EntrySelector from './screens/EntrySelector';
import LoginCliente from './screens/LoginCliente';
import CadastroCliente from './screens/CadastroCliente';
import LoginMedico from './screens/LoginMedico';
import CadastroMedico from './screens/CadastroMedico';
import RequestConsult from './screens/RequestConsult';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EntrySelector" component={EntrySelector} />
        <Stack.Screen name="LoginCliente" component={LoginCliente} />
        <Stack.Screen name="CadastroCliente" component={CadastroCliente} />
        <Stack.Screen name="LoginMedico" component={LoginMedico} />
        <Stack.Screen name="CadastroMedico" component={CadastroMedico} />
        <Stack.Screen name="RequestConsult" component={RequestConsult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
