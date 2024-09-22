import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { onCreateGroup } from '../services/GroupsServices';

export default function AddGroupScreen({ route, navigation }) {
  const { expenseData } = route.params || {};

  const [description, setDescription] = useState(expenseData?.description || '');

  const save = async () => {
    if (description === '') {
      alert('Debe ingresar una descripcion');
      return;
    }

    const result = await onCreateGroup(description);
    
    if (result.error) {
      alert(result.error);
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Crear grupo</Text>
          <View style={styles.items}>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              onChangeText={(text) => setDescription(text)}
              value={description}
            />
          </View>
        </View>
        <TouchableOpacity onPress={() => save()}>
            <View style={styles.button}>
              <Text style={styles.addText}>Guardar</Text>
            </View>
          </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    display: 'flex',
    alignItems: 'center'
  },
  scrollView: {
    flexGrow: 1,
    width: '85%'
  },
  tasksWrapper: {
    paddingTop: 50,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 20,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
  },
  inputPercent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: '80%',

  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkedBox: {
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C0C0C0',
  },
  memberWrapperV: {
    display: 'flex',
    gap: 10
  },
  memberWrapper: {
    marginBottom: 15
  },
  memberWrapperC: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberWrapperN: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  amount: {
    marginTop: 5,
  },
  button: {
    backgroundColor: '#2ECC71',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 20,
    alignItems: 'center',
  },
  addText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center'
  },
});
