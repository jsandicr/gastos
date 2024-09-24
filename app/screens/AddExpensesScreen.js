import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { onAddExpenses, onUpdateExpenses } from '../services/ExpensesServices';

export default function AddExpensesScreen({ route, navigation }) {
  const { expenseData, group } = route.params || {};
  const { id } = group
  
  const [expenses, setExpenses] = useState(expenseData?.expenses || '');
  const [description, setDescription] = useState(expenseData?.description || '');
  
  const [users, setUsers] = useState(() => {
    // Mapeo para incluir isActive, percentage y totalToPay
    const userMap = new Map(expenseData?.members.map(user => [user.email, user]) || []);
    return group.users.map(user => {
      const existingUser = userMap.get(user.email);
      return {
        ...user,
        isActive: existingUser ? existingUser.isActive : !expenseData, // Cambia según tu lógica
        percentage: existingUser ? existingUser.percentage : '',
        totalToPay: existingUser ? existingUser.totalToPay : '0.00',
      };
    });
  });

  const [isEquallyDivided, setIsEquallyDivided] = useState(() => {
    if (expenseData) {
      const activeMembers = users.filter(member => member.isActive);
      
      // Verifica si todos los usuarios tienen el mismo porcentaje
      if (activeMembers.length > 0) {
        const firstMemberPercentage = activeMembers[0].percentage;
        return activeMembers.every(member => member.percentage === firstMemberPercentage);
      }
    }
    return false;
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseData) {
      setExpenses(expenseData.expenses || '');
      setDescription(expenseData.description || '');
    }
  }, [expenseData]);

  useEffect(() => {
    const activeMembers = users.filter(member => member.isActive);
    const equalPercentage = (100 / activeMembers.length).toFixed(2);
    const updatedMembers = users.map(member => {
      if(isEquallyDivided){
        const newPercentage = member.isActive ? equalPercentage : '';
        return {
          ...member,
          percentage: newPercentage,
          totalToPay: (expenses * (parseFloat(newPercentage) || 0) / 100).toFixed(2)
        };
      }else{
        return {
          ...member,
          totalToPay: (expenses * (parseFloat(member.percentage) || 0) / 100).toFixed(2)
        };
      }
    });
    setUsers(updatedMembers);

    const totalPercentage = updatedMembers.reduce((total, member) => {
      const percentage = parseFloat(member.totalToPay) || 0;
      return total + percentage;
    }, 0);

    if (expenses && Math.round(totalPercentage) !== parseFloat(expenses)) {
      setError('La suma de los porcentajes debe ser el 100%');
    }else{
      setError('');
    }
  }, [expenses]);

  const toggleCheckBox = () => {
    setIsEquallyDivided(!isEquallyDivided);
    if (!isEquallyDivided) {
      const activeMembers = users.filter(member => member.isActive);
      const equalPercentage = (100 / activeMembers.length).toFixed(2);
      const updatedMembers = users.map(member => {
        const newPercentage = member.isActive ? equalPercentage : '';
        return {
          ...member,
          percentage: newPercentage,
          totalToPay: (expenses * (parseFloat(newPercentage) || 0) / 100).toFixed(2)
        };
      });
      setUsers(updatedMembers);

      const totalPercentage = updatedMembers.reduce((total, member) => {
        const percentage = parseFloat(member.totalToPay) || 0;
        return total + percentage;
      }, 0);
  
      if (Math.round(totalPercentage) !== parseFloat(expenses)) {
        setError('La suma de los porcentajes debe ser el 100%');
      }else{
        setError('');
      }
    }
  };
  
  const toggleMemberCheckBox = (index) => {
    let updatedMembers = [...users];
    updatedMembers[index].isActive = !updatedMembers[index].isActive;
    const activeMembers = updatedMembers.filter(member => member.isActive);
    const equalPercentage = (100 / activeMembers.length).toFixed(2);
    
    if (isEquallyDivided) {
      updatedMembers = users.map(member => {
        const newPercentage = member.isActive ? equalPercentage : '';
        return {
          ...member,
          percentage: newPercentage,
          totalToPay: (expenses * (parseFloat(newPercentage) || 0) / 100).toFixed(2)
        };
      });
    }

    setUsers(updatedMembers);
    validateTotalPercentage(updatedMembers)
  };

  const validateTotalPercentage = (updatedMembers) => {
    let activeMembers = []
    if(updatedMembers){
      activeMembers = updatedMembers.filter(member => member.isActive);
    }else{
      activeMembers = users.filter(member => member.isActive);
    }
    const totalPercentage = activeMembers.reduce((total, member) => {
      const percentage = parseFloat(member.totalToPay) || 0;
      return total + percentage;
    }, 0);

    if (expenses && Math.round(totalPercentage) !== parseFloat(expenses)) {
      setError('La suma de los porcentajes debe ser el 100%');
    }else{
      setError('');
    }
  };

  const handlePercentageChange = (text, index) => {
    const updatedMembers = [...users];
    updatedMembers[index].percentage = text;
  
    // Recalcular total a pagar
    const totalToPay = (expenses * (parseFloat(text) || 0) / 100).toFixed(2);
    updatedMembers[index].totalToPay = totalToPay;
  
    setUsers(updatedMembers);
    validateTotalPercentage(updatedMembers);
  };
  

  const save = async () => {
    if (description === '') {
      alert('Debe ingresar una descripcion');
      return;
    }
    if (expenses === '' || expenses <= 0) {
      alert('Debe ingresar una cantidad válida en gasto');
      return;
    }
    if (error) {
      alert(error);
      return;
    }

    const activeMembers = users.filter(member => member.isActive);
    const totalPercentage = activeMembers.reduce((total, member) => {
      const percentage = parseFloat(member.totalToPay) || 0;
      return total + percentage;
    }, 0);

    if (Math.round(totalPercentage) !== parseFloat(expenses)) {
      alert('La suma de los porcentajes debe ser el 100%');
      return;
    }

    updatedMembers = users.map(member => {
      return {
        ...member,
        percentage: member.percentage != 0 ? member.percentage : 0,
        totalToPay: (expenses * (parseFloat(member.percentage) || 0) / 100).toFixed(2)
      };
    });

    let result = null;
    if (expenseData) {
      result = await onUpdateExpenses(id, expenseData.id, expenses, description, activeMembers);
    } else {
      result = await onAddExpenses(id, expenses, description, activeMembers);
    }

    if (result.error) {
      alert(result.error);
    } else {
      navigation.navigate('Group', { group });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>{expenseData ? 'Editar gasto' : 'Agregar gasto'}</Text>
          <View style={styles.items}>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              onChangeText={(text) => setDescription(text)}
              value={description}
            />
            <TextInput
              style={styles.input}
              placeholder="Gasto"
              onChangeText={(text) => setExpenses(text)}
              value={expenses}
              keyboardType="numeric"
            />
          </View>

          {users.length !== 0 ? (
            <View style={styles.checkboxWrapper}>
              <TouchableOpacity onPress={toggleCheckBox} style={styles.checkbox}>
                <View style={isEquallyDivided ? styles.checkedBox : styles.uncheckedBox} />
              </TouchableOpacity>
              <Text>¿Dividir equitativamente?</Text>
            </View>
          ) : (
            <Text>No hay miembros en el grupo...</Text>
          )}

          {users.map((member, index) => (
            <View key={index} style={styles.memberWrapperV}>
              <View style={styles.memberWrapper}>
                <View style={styles.memberWrapperC}>
                  <View style={styles.memberWrapperN}>
                    <TouchableOpacity onPress={() => toggleMemberCheckBox(index)}>
                      <View style={member.isActive ? styles.checkedBox : styles.uncheckedBox} />
                    </TouchableOpacity>
                    <Text>{member.name}</Text>
                  </View>
                  {!isEquallyDivided ? (
                    <TextInput
                      style={styles.inputPercent}
                      placeholder="Porcentaje"
                      keyboardType="numeric"
                      onChangeText={(text) => handlePercentageChange(text, index)}
                      value={member.percentage}
                      editable={member.isActive} 
                    />
                  ) : (
                    <Text style={styles.labelPercent}>{member.percentage}%</Text>
                  )}
                </View>
                {expenses && member.percentage && member.isActive ? (
                    <Text style={styles.amount}>
                      Debe pagar: {member.totalToPay}
                    </Text>
                  ) : null}
              </View>
            </View>
          ))}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        <TouchableOpacity onPress={() => save()}>
            <View style={styles.button}>
              <Text style={styles.addText}>{expenseData ? "Actualizar" : "Guardar"}</Text>
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
    width: '50%',
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
    gap: 8,
  },
  amount: {
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
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
