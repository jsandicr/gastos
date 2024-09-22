import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { loadExpenses } from '../services/ExpensesServices';
import AddElement from '../../components/AddElement';
import { useFocusEffect } from '@react-navigation/native';
import Expenses from '../../components/Expenses';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';

export default function GroupScreen({ route, navigation }) {
  const { idGroup } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [email, setEmail] = useState('');

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    const onLoadEmail = async () => {
      const email = await SecureStore.getItemAsync('email');
      setEmail(email);
    };
    onLoadEmail();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchExpenses = async () => {
        const result = await loadExpenses(idGroup);
        if (result && !result.error) {
          setExpenses(result);
        } else {
          console.error(result.msg);
        }
      };
      fetchExpenses();
    }, [idGroup])
  );

  const handleAddExpenses = () => {
    navigation.navigate('AddExpenses', { idGroup });
  };

  const openExpenses = (expenses) => {
    navigation.navigate('ViewExpenses', { expenses, idGroup });
  };

  const history = () => {
    const filteredExpenses = expenses.filter((item) => item.status === 'complete');
    navigation.navigate('HistoryExpenses', { expenses: filteredExpenses, idGroup });
  };

  const handleShareLink = () => {
    const groupCode = idGroup;
    const options = ['Copiar código', 'Enviar por WhatsApp', 'Cancelar'];
    const cancelButtonIndex = 2;
  
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          Clipboard.setString(groupCode);
          Alert.alert('Código copiado al portapapeles');
        } else if (buttonIndex === 1) {
          const whatsappURL = `whatsapp://send?text=Únete a mi grupo de gastos con el código: ${groupCode}`;
          Linking.openURL(whatsappURL).catch(() => {
            Alert.alert('Asegúrate de tener WhatsApp instalado para compartir el código.');
          });
        }
      }
    );
  };  

  return (
    <ActionSheetProvider>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
          <View style={styles.tasksWrapper}>
            <View style={styles.linksContainer}>
              <Text style={styles.sectionTitle}>Expenses</Text>
              <TouchableOpacity onPress={handleShareLink}>
                <View style={styles.button}>
                  <Text style={styles.addText}>
                    <Ionicons name="share-outline" size={20}></Ionicons>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.items}>
              {expenses
                .filter((item) => item.status === 'incomplete')
                .map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => openExpenses(item)}>
                    <Expenses item={item} email={email} idGroup={idGroup} navigation={navigation} />
                  </TouchableOpacity>
                ))}
              <TouchableOpacity onPress={handleAddExpenses}>
                <AddElement text='Agregar gasto' />
              </TouchableOpacity>
            </View>
          </View>
          {expenses.filter((item) => item.status === 'complete').length > 0 ? (
            <TouchableOpacity onPress={history}>
              <View style={styles.button}>
                <Text style={styles.addText}>Historial</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    display: 'flex',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    width: '85%',
  },
  tasksWrapper: {
    paddingTop: 50,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    borderColor: 'transparent',
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    width: '100%',
  },
  addText: {
    color: '#F5F5F5',
    textAlign: 'center',
    padding: 10,
  },
  linksContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
