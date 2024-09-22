import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import { onCloseExpenses, onDeleteExpenses } from '../app/services/ExpensesServices';

const Expenses = (props) => {

  const { description, status, createdBy, id } = props.item
  const { email, idGroup, navigation } = props
  
  const handleDelete = () => {

    Alert.alert(
      'Confirmar Eliminar',
      '¿Estás seguro de que deseas eliminar este gasto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            deleteFN()
          },
        },
      ],
      { cancelable: true }
    );
  };

  const deleteFN = async () => {
    const result = await onDeleteExpenses(idGroup, id);
    if (result.error) {
      alert(result.error);
    }else{
      navigation.replace('Group', { idGroup: idGroup });
    }
  }

  const handleClose = () => {
    if(createdBy != email){
      alert("Solo el creador puede cerrar el gasto")
      return
    }
    Alert.alert(
      'Confirmar Cierre',
      '¿Estás seguro de que deseas cerrar este gasto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Gasto',
          onPress: () => {
            close()
          },
        },
      ],
      { cancelable: true }
    );
  };

  const close = async () => {
    const result = await onCloseExpenses(idGroup, id);
    
    if (result.error) {
      alert(result.error);
    }else{
      navigation.replace('Group', { idGroup: idGroup });
    }
  }

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <Text style={styles.itemText}>{description}</Text>
      </View>
      <View style={styles.iconsV}>
        {
          status == 'complete' ?
          <Ionicons name="checkmark-circle" size={22} color="green"/>
          :
          <TouchableOpacity onPress={() => handleClose()}>
            <Ionicons name="ellipse-outline" size={22}></Ionicons>
          </TouchableOpacity>
        }
        {
          createdBy == email && status == 'incomplete' ? 
          <TouchableOpacity onPress={() => handleDelete()}>
            <Ionicons name="trash-outline" size={22} color="red"/>
          </TouchableOpacity>
          : null
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  iconsV: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  }
});

export default Expenses;