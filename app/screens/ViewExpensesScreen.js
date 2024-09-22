import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { onCloseExpenses } from '../services/ExpensesServices';

export default function ViewExpensesScreen({ route, navigation }) {
  const { expenses, idGroup } = route.params;

  const edit = async () => {
    navigation.navigate('AddExpenses', {expenseData: expenses, idGroup: idGroup});
  }

  const close = async () => {
    result = await onCloseExpenses(idGroup, expenses.id)
    
    if (result.error) {
      alert(result.error);
    } else {
      navigation.navigate('Group', { idGroup: idGroup });
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Gasto</Text>
          <Text style={styles.sectionSubTitle}>Details</Text>
          <View style={styles.items}>
            <Text style={styles.textWrapper}>Descripción: {expenses.description}</Text>
            <Text style={styles.textWrapper}>Gasto: {expenses.expenses}</Text>
          </View>
          <Text style={styles.sectionSubTitle}>Members</Text>
          <View style={styles.itemsMember}>
            {expenses.members.map((member, index) => (
              <View key={index} style={styles.memberWrapper}>
                <Text style={styles.textWrapperTitle}>{member.name}</Text>
                <Text style={styles.textWrapper}>Percentage: {member.percentage}</Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          {
            expenses.status === 'incomplete' ?
            <>
              <TouchableOpacity onPress={() => edit()}>
                <View style={[styles.button, styles.edit]}>
                  <Text style={[styles.addText, styles.addTextEdit]}>Edit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => close()}>
                <View style={[styles.button, styles.close]}>
                  <Text style={[styles.addText, styles.addTextClose]}>Close Expense</Text>
                </View>
              </TouchableOpacity>
            </>
            : <></>
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    width: '85%'
  },
  tasksWrapper: {
    paddingTop: 50,
  },
  textWrapper: {
    color: '#333333'
  },
  textWrapperTitle: {
    color: '#333333',
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  sectionSubTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  items: {
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
  },
  itemsMember: {
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
    borderRadius: 10,
  },
  memberWrapper: {
    backgroundColor: '#E0E0E0',
    color: '#333333',
    borderRadius: 10,
    padding: 10,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    borderColor: 'transparent',
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    width: '100%',
  },
  addText: {
    color: '#F5F5F5',
    textAlign: 'center',
    padding: 10
  },
  edit: {
    backgroundColor: '#F1C40F',
  },
  close: {
    backgroundColor: '#E74C3C',
  },
});
