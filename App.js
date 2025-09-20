
export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cadastro, setCadastro] = useState([]);
  const db = SQLite.openDatabase({ name: 'cadastro.db', location: 'default' });

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS contatos (codigo TEXT PRIMARY KEY, nome TEXT, email TEXT, senha TEXT);'
      );
    }, (err) => Alert.alert('Erro', err?.message || 'Erro ao criar tabela'));
    carregaDados();
  }, []);
  function criacaoCodigo(){
    let codigo = Date.now().toString();
    console.log(codigo);
    return codigo;
  }

  function Cadastrar() {
    const registro = !codigo;
    const novoCodigo = registro ? criacaoCodigo() : codigo;
    db.transaction(tx => {
      if (registro) {
        tx.executeSql(
          'INSERT INTO contatos (codigo, nome, email, senha) VALUES (?, ?, ?, ?);',
          [novoCodigo, nome, email, senha],
          () => {
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            Limpar();
            carregaDados();
          },
          (_, error) => { Alert.alert('Erro', error.message); return false; }
        );
      } else {
        tx.executeSql(
          'UPDATE contatos SET nome=?, email=?, senha=? WHERE codigo=?;',
          [nome, email, senha, codigo],
          () => {
            Alert.alert('Sucesso', 'Contato atualizado!');
            Limpar();
            carregaDados();
          },
          (_, error) => { Alert.alert('Erro', error.message); return false; }
        );
      }
    });
  }

  function carregaDados() {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM contatos;', [], (tx, results) => {
        let rows = results.rows;
        let lista = [];
        for (let i = 0; i < rows.length; i++) {
          lista.push(rows.item(i));
        }
        setCadastro(lista);
      });
    });
  }

  function editarContato(contato) {
    setNome(contato.nome);
    setEmail(contato.email);
    setSenha(contato.senha);
    setCodigo(contato.codigo);
  }

  function excluirContato(codigoContato) {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM contatos WHERE codigo=?;',
        [codigoContato],
        () => {
          Alert.alert('Excluído', 'Contato removido!');
          if (codigo === codigoContato) Limpar();
          carregaDados();
        },
        (_, error) => { Alert.alert('Erro', error.message); return false; }
      );
    });
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
          <Text style={styles.textoBotao}>{codigo ? 'Atualizar' : 'Salvar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCancelar} onPress={Limpar}>
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.titulo, {marginTop: 30}]}>Contatos Salvos</Text>
      {cadastro.length === 0 && (
        <Text style={styles.label}>Nenhum contato salvo.</Text>
      )}
      {cadastro.map((contato) => (
        <View key={contato.codigo} style={{borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginVertical:5}}>
          <Text style={styles.label}>Nome: {contato.nome}</Text>
          <Text style={styles.label}>Email: {contato.email}</Text>
          <Text style={styles.label}>Senha: {contato.senha}</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <TouchableOpacity style={[styles.botao, {flex:1, marginRight:5}]} onPress={() => editarContato(contato)}>
              <Text style={styles.textoBotao}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botaoCancelar, {flex:1, marginLeft:5}]} onPress={() => excluirContato(contato.codigo)}>
              <Text style={styles.textoBotao}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <StatusBar style="auto" />
    </ScrollView>
  );
}