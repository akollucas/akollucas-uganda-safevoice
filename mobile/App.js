import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import VictimLoginScreen from './screens/VictimLoginScreen';
import VictimCaseScreen from './screens/VictimCaseScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PoliceAdminDashboardScreen from './screens/PoliceAdminDashboardScreen';
import PoliceOfficerDashboardScreen from './screens/PoliceOfficerDashboardScreen';
import VolunteerDashboardScreen from './screens/VolunteerDashboardScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="VictimLogin" component={VictimLoginScreen} />
          <Stack.Screen name="VictimCase" component={VictimCaseScreen} />
        </>
      ) : (
        <>
          {user.role === 'admin' && <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />}
          {user.role === 'policeAdmin' && <Stack.Screen name="PoliceAdminDashboard" component={PoliceAdminDashboardScreen} />}
          {user.role === 'policeOfficer' && <Stack.Screen name="PoliceOfficerDashboard" component={PoliceOfficerDashboardScreen} />}
          {user.role === 'volunteer' && <Stack.Screen name="VolunteerDashboard" component={VolunteerDashboardScreen} />}
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}