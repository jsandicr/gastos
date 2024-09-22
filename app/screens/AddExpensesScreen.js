import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { onAddExpenses, onUpdateExpenses } from '../services/ExpensesServices';

export default function AddExpensesScreen({ route, navigation }) {
  const { expenseData, idGroup } = route.params || {};

  const [expenses, setExpenses] = useState(expenseData?.expenses || '');
  const [description, setDescription] = useState(expenseData?.description || '');
  const [isEquallyDivided, setIsEquallyDivided] = useState(expenseData?.isEquallyDivided || false);
  const [members, setMembers] = useState(
    expenseData?.members.map(member => ({ ...member, isActive: true })) || 
    [{ name: 'John', percentage: '', isActive: true, totalToPay: '0.0' }, { name: 'Jane', percentage: '', isActive: true, totalToPay: '0.0' }]
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseData) {
      setExpenses(expenseData.expenses || '');
      setDescription(expenseData.description || '');
      setIsEquallyDivided(expenseData.isEquallyDivided || false);
      setMembers(
        expenseData.members.map(member => ({ ...member, isActive: true })) ||
        [{ name: 'John', percentage: '', isActive: true }, { name: 'Jane', percentage: '', isActive: true }]
      );

      // Verificar si todos los porcentajes son iguales
      if (expenseData.members.length > 0) {
        const firstPercentage = expenseData.members[0].percentage;
        const allEqual = expenseData.members.every(member => member.percentage === firstPercentage);

        if (allEqual && firstPercentage !== '') {
          setIsEquallyDivided(true);
        }
      }
    }
  }, [expenseData]);

  useEffect(() => {
    const activeMembers = members.filter(member => member.isActive);
    const equalPercentage = (100 / activeMembers.length).toFixed(2);
    const updatedMembers = members.map(member => {
      const newPercentage = member.isActive ? equalPercentage : '';
      return {
        ...member,
        percentage: newPercentage,
        totalToPay: (expenses * (parseFloat(newPercentage) || 0) / 100).toFixed(2)
      };
    });
    setMembers(updatedMembers);
  }, [expenses]);

  const toggleCheckBox = () => {
    setIsEquallyDivided(!isEquallyDivided);
    if (!isEquallyDivided) {
      const activeMembers = members.filter(member => member.isActive);
      const equalPercentage = (100 / activeMembers.length).toFixed(2);
      const updatedMembers = members.map(member => {
        const newPercentage = member.isActive ? equalPercentage : '';
        return {
          ...member,
          percentage: newPercentage,
          totalToPay: (expenses * (parseFloat(newPercentage) || 0) / 100).toFixed(2)
        };
      });
      setMembers(updatedMembers);
    } else {
      const updatedMembers = members.map(member => ({
        ...member,
        percentage: '',
        totalToPay: '0.00'
      }));
      setMembers(updatedMembers);
    }
  };
  

  const toggleMemberCheckBox = (index) => {
    const updatedMembers = [...members];
    updatedMembers[index].isActive = !updatedMembers[index].isActive;
    setMembers(updatedMembers);

    // Recalcular porcentajes si la división equitativa está activa
    if (isEquallyDivided) {
      const activeMembers = updatedMembers.filter(member => member.isActive);
      const equalPercentage = (100 / activeMembers.length).toFixed(2);
      const recalculatedMembers = updatedMembers.map(member => ({
        ...member,
        percentage: member.isActive ? equalPercentage : ''
      }));
      setMembers(recalculatedMembers);
    }
  };

  const validateTotalPercentage = (updatedMembers) => {
    const totalPercentage = updatedMembers.reduce((total, member) => {
      if (!member.isActive) return total; // Ignorar miembros inactivos
      const percentage = parseFloat(member.percentage) || 0;
      return total + percentage;
    }, 0);

    if (totalPercentage > 100) {
      setError('La suma de los porcentajes no debe exceder el 100%');
    } else {
      setError('');
    }
  };

  const handlePercentageChange = (text, index) => {
    const updatedMembers = [...members];
    updatedMembers[index].percentage = text;
  
    // Recalcular total a pagar
    const totalToPay = (expenses * (parseFloat(text) || 0) / 100).toFixed(2);
    updatedMembers[index].totalToPay = totalToPay;
  
    setMembers(updatedMembers);
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

    const activeMembers = members.filter(member => member.isActive);
    const totalPercentage = activeMembers.reduce((total, member) => {
      const percentage = parseFloat(member.percentage) || 0;
      return total + percentage;
    }, 0);

    if (totalPercentage !== 100) {
      alert('La suma de los porcentajes debe ser el 100%');
      return;
    }

    let result = null;
    if (expenseData) {
      result = await onUpdateExpenses(idGroup, expenseData.id, expenses, description, activeMembers);
    } else {
      result = await onAddExpenses(idGroup, expenses, description, activeMembers);
    }

    if (result.error) {
      alert(result.error);
    } else {
      navigation.navigate('Group', { idGroup: idGroup });
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

          {members.length !== 0 ? (
            <View style={styles.checkboxWrapper}>
              <TouchableOpacity onPress={toggleCheckBox} style={styles.checkbox}>
                <View style={isEquallyDivided ? styles.checkedBox : styles.uncheckedBox} />
              </TouchableOpacity>
              <Text>¿Dividir equitativamente?</Text>
            </View>
          ) : (
            <Text>No hay miembros en el grupo...</Text>
          )}

          {/* Lista de miembros */}
          {members.map((member, index) => (
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
                      editable={member.isActive}  // Habilita o deshabilita el campo según el estado isActive
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
