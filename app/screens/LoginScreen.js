import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { onLogin, onRegister } = useAuth('')

  const login = async () => {
    if(!email || !password){
      alert("Debe ingresar el email y contraseña")
      return
    }
    const result = await onLogin(email, password)
    if (result && result.error) {
      alert(result.msg)
    }
  }

  const register = async () => {
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.image} />
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => setEmail(text)} value={email}></TextInput>
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password}></TextInput>
        <TouchableOpacity onPress={() => login()}>
          <View style={styles.button}>
            <Text style={styles.addText}>Sign in</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => register()}>
          <View style={styles.button}>
            <Text style={styles.addText}>Create Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain'
  },
  form: {
    gap: 10,
    width: '60%'
  },
  input: {
    height: 44,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    marginTop: 200
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 10,
    width: '100%',
  },
  addText: {
    color: '#F5F5F5',
    textAlign: 'center',
    padding: 10
  },
})