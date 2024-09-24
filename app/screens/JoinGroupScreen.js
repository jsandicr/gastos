import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { onJoinGroup } from '../services/GroupsServices'
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'

export default function JoinGroupScreen() {
    const navigation = useNavigation();

    const [code, setCode] = useState();

    const joinGroup = async () => {
      const result = await onJoinGroup(code)
      if (result && result.error) {
        alert(result.msg)
        return
      }else{
        navigation.navigate('Home');
      }
      
    }
  
    return (
      <View style={styles.container}>
        <View style={styles.centerSection}>
          <View style={styles.tasksWrapper}>
            <Text style={styles.sectionTitle}>Ingrese el codigo del grupo</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder={'Write a task'} value={code} onChangeText={text => setCode(text)} />
            <TouchableOpacity onPress={() => joinGroup()}>
              <View style={styles.addWrapper}>
                <Text style={styles.addText}>
                <Ionicons name="send-outline" color="#F5F5F5"></Ionicons>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  centerSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 220,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#2ECC71',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderWidth: 1,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
});