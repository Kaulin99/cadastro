import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, Keyboard, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import { useState, useEffect } from 'react';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cadastro, setCadastro] = useState([]);

  useEffect(() => {
    carregaDados();
  }, []);
  function criacaoCodigo(){
    let codigo = Date.now().toString();
    console.log(codigo);
    return codigo;
  }

  async function Cadastrar() {
    const registro = !codigo;
    const novoCodigo = registro ? criacaoCodigo() : codigo;
    const obj = {
      codigo: novoCodigo,
      nome,
      email,
      senha
    };
    try {
      let novaLista = [...cadastro];
      if (registro) {
        novaLista.push(obj);
      } else {
        const index = novaLista.findIndex(item => item.codigo === codigo);
        if (index >= 0) {
          novaLista[index] = obj;
        }
      }
      setCadastro(novaLista);
      await AsyncStorage.setItem('@cadastro', JSON.stringify(novaLista));
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      Limpar();
    } catch (e) {
      Alert.alert('Erro', e.toString());
    }
  }

  async function carregaDados() {
    try {
      const jsonValue = await AsyncStorage.getItem('@cadastro');
      if (jsonValue != null) {
        setCadastro(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Erro', e.toString());
    }
  }

  function Limpar() {
    setNome('');
    setEmail('');
    setSenha('');
    setCodigo('');
    Keyboard.dismiss();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Usuários</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        onChangeText={setNome}
        value={nome}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        onChangeText={setSenha}
        value={senha}
        secureTextEntry={true}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Código de acesso:</Text>
      <View style={styles.codigoContainer}>
        <Text style={[styles.codigoTexto, !codigo && styles.codigoTextoVazio]}>
          {codigo ? `Código gerado: ${codigo}` : 'Será gerado automaticamente'}
        </Text>
      </View>

      <View style={styles.areaBotoes}>
        <TouchableOpacity style={styles.botao} onPress={Cadastrar}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCancelar} onPress={Limpar}>
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}