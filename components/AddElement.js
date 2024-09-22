import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'

const AddElement = (props) => {

  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {props.text}
      </Text>
      <Ionicons name="add-circle-outline" size={22} color='#F5F5F5' />
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
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
    color: '#F5F5F5'
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default AddElement;