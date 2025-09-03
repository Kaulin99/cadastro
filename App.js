import { StatusBar } from 'expo-status-bar';
import {  Text, View } from 'react-native';
import styles from './style';
import { useState } from 'react';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');



  return (
    <View style={styles.container}>
      <Text>Cadastro de usuarios</Text>

      <text>Nome:</text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        onChangeText={(text) => setNome(text)}
        value={nome}
      />

      <text>Email:</text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <text>Senha:</text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        onChangeText={(text) => setSenha(text)}
        value={senha}
        secureTextEntry={true}
      />

      <text>Código de acesso:</text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu código de acesso"
        onChangeText={(text) => setCodigo(text)}
        value={codigo}
      />

      <StatusBar style="auto" />
    </View>
  );
}