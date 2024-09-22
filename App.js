import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './app/screens/LoginScreen'
import HomeScreen from './app/screens/HomeScreen'
import { AuthProvider, useAuth } from './app/context/AuthContext';
import JoinGroupScreen from './app/screens/JoinGroupScreen';
import GroupScreen from './app/screens/GroupScreen';
import AddExpensesScreen from './app/screens/AddExpensesScreen';
import ViewExpensesScreen from './app/screens/ViewExpensesScreen'
import HistoryScreen from './app/screens/HistoryScreen';
import CustomHeader from './components/CustomHeader';
import AddGroupScreen from './app/screens/AddGroupScreen';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const linking = {
  prefixes: ['gastos://'],
  config: {
    screens: {
      Home: 'home',
      JoinGroup: 'join-group/:code',  // Puedes pasar un parámetro opcional como el código del grupo
      Group: 'group/:idGroup',  // Otra pantalla con parámetros
      AddExpenses: 'add-expenses',
      ViewExpenses: 'view-expenses',
      HistoryExpenses: 'history',
      Login: 'login',
    },
  },
};

export const ROUTES = {
  HOME: 'Home',
  JOIN_GROUP: 'JoinGroup',
  GROUP: 'Group',
  ADD_EXPENSES: 'AddExpenses',
  VIEW_EXPENSES: 'ViewExpenses',
  HISTORY_EXPENSES: 'HistoryExpenses',
  LOGIN: 'Login',
};

export const HEADER_TITLES = {
  [ROUTES.HOME]: 'Inicio',
  [ROUTES.JOIN_GROUP]: 'Unirse al Grupo',
  [ROUTES.GROUP]: 'Pending Expenses',
  [ROUTES.ADD_EXPENSES]: 'Agregar Gasto',
  [ROUTES.VIEW_EXPENSES]: 'Ver Gastos',
  [ROUTES.HISTORY_EXPENSES]: 'Historial de Gastos',
  [ROUTES.LOGIN]: 'Login',
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ActionSheetProvider>
        <Layout></Layout>
      </ActionSheetProvider>
    </AuthProvider>
  )
}

function Layout(){
  const { authState, onLogout } = useAuth()
  return(
    <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            header: () => (
              <CustomHeader
                title={HEADER_TITLES[route.name] || route.name}
                onSignOut={authState?.authenticated ? onLogout : null}
              />
            ),
          })}
        >
          {
            authState?.authenticated ?
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
              />
              <Stack.Screen
                name="JoinGroup"
                component={JoinGroupScreen}
              />

              <Stack.Screen
                name="NewGroup"
                component={AddGroupScreen}
              />

              <Stack.Screen
                name="Group"
                component={GroupScreen}
              />

              <Stack.Screen
                name="AddExpenses"
                component={AddExpensesScreen}
              />

              <Stack.Screen
                name="ViewExpenses"
                component={ViewExpensesScreen}
              />

              <Stack.Screen
                name="HistoryExpenses"
                component={HistoryScreen}
              />
            </>:
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
          }
        </Stack.Navigator>
      </NavigationContainer>
  )
}