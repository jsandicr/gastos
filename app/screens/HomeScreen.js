import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { loadGroups } from '../services/GroupsServices';
import AddElement from '../../components/AddElement';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Group from '../../components/Group';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [groups, setGroups] = useState([]);
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        try {
            const result = await loadGroups();
            if (result && !result.error) {
                setGroups(result);
            } else {}
        } catch (error) {}
    };

    useEffect(() => {
      const fetchEmail = async () => {
          try {
              const emailFromStore = await SecureStore.getItemAsync('email');
              
              if (emailFromStore) {
                  setEmail(emailFromStore);
              } else {
                  fetchEmail()
              }
          } catch (error) {
          } finally {
              setLoading(false); // Termina el estado de carga
          }
      };

      fetchEmail();
  }, []);

  useEffect(() => {
      const fetchGroups = async () => {
          if (!email) return;

          try {
              const result = await loadGroups(email);
              if (result && !result.error) {
                  setGroups(result);
              }
          } catch (error) {}
      };

      if (!loading) {
          fetchGroups();
      }
  }, [email, loading]);

    useFocusEffect(
        useCallback(() => {
            fetchGroups();
        }, [])
    );

    const openGroup = (group) => {
        navigation.navigate('Group', { group });
    };

    const joinGroup = () => {
        navigation.navigate('JoinGroup');
    };

    const newGroup = () => {
        navigation.navigate('NewGroup');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
                <View style={styles.tasksWrapper}>
                    <Text style={styles.sectionTitle}>Groups</Text>
                    <View style={styles.items}>
                        {groups.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => openGroup(item)}>
                                <Group text={item.description} />
                            </TouchableOpacity>
                        ))}
                        {
                            groups.length == 0 ? <Text style={styles.noGroups}>No hay grupos...</Text> : null
                        }
                        <TouchableOpacity onPress={() => newGroup()}>
                          <AddElement text="Crear grupo" /> 
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => joinGroup()}>
                            <AddElement text="Unirse a un grupo" />
                        </TouchableOpacity>
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
    noGroups: {
        fontSize: 15,
        marginBottom: 25
    }
});
