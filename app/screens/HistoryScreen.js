import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Expenses from '../../components/Expenses';
import * as SecureStore from 'expo-secure-store';

export default function HistoryScreen({ route, navigation }) {
    const { expenses, idGroup } = route.params;
    const [email, setEmail] = useState('');

    const openExpenses = (expenses) => {
      navigation.navigate('ViewExpenses', {expenses, idGroup: idGroup});
    }

    useEffect(() => {
      const onLoadEmail = async () => {
        const email = await SecureStore.getItemAsync('email');
        setEmail(email);
      };
      onLoadEmail();
    }, []);
  
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
          keyboardShouldPersistTaps='handled'
        >
  
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>History Expenses</Text>
          <View style={styles.items}>
            {
              expenses
              .map((item, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => openExpenses(item)}>
                    <Expenses item={item} email={email} idGroup={idGroup} navigation={navigation} />
                  </TouchableOpacity>
                );
              })
            }
          </View>
        </View>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});