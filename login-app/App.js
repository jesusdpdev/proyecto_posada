import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 1. IMPORTANTE: Asegúrate de importar la nueva pantalla
import Login from "./screens/Login"; 
import Admin from "./screens/Admin";
import Mantenimiento from "./screens/Mantenimiento";
import CrearLuzAgua from './screens/CrearLuzAgua';
import Registro from './screens/Registro'; // <--- Agregamos esta importación
import HistorialAccesos from './screens/HistorialAccesos';
import PanelUsuarios from './screens/PanelUsuarios';
import MostrarUsuariosInactivos from './screens/MostrarUsuariosInactivos';
import { StackScreen } from 'react-native-screens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={({ navigation }) => ({
            headerTintColor: 'white',
            headerStyle: { 
              backgroundColor: '#525FE1',
              elevation: 0,
              shadowOpacity: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.replace('Login')}
                style={{ marginRight: 15, backgroundColor: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 20 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Cerrar Sesión</Text>
              </TouchableOpacity>
            ),
          })}
        >
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ headerShown: false }} 
          />
          
          <Stack.Screen 
            name="Admin" 
            component={Admin} 
            options={{ title: 'PANEL ADMINISTRATIVO' }} 
          />
          
          <Stack.Screen 
            name="Mantenimiento" 
            component={Mantenimiento} 
            options={{ title: 'PANEL MANTENIMIENTO' }} 
          />
          
          {/* 2. CORREGIDO: Cerramos bien la etiqueta con /> */}
          <Stack.Screen 
            name="CrearLuzAgua" 
            component={CrearLuzAgua} 
            options={{ 
              title: 'REGISTRO DE GASTOS',
              headerRight: null 
            }}
          />

          {/* 3. PANTALLA DE REGISTRO */}
          <Stack.Screen 
            name="Registro" 
            component={Registro} 
            options={{ 
              title: 'NUEVO OPERADOR',
              headerRight: null 
            }} 
          />

          {/* 4. PANTALLA DE HistorialAccesos */}
          <Stack.Screen 
            name="HistorialAccesos" 
            component={HistorialAccesos} 
            options={{ 
              title: 'Historial de Accesos',
              headerRight: null 
            }} 
          />

          <Stack.Screen 
          name="PanelUsuarios"
          component={PanelUsuarios}
          options={{
            title: 'Panel de Usuarios',
            headerRight: null
          }}
          />

          <Stack.Screen 
          name="MostrarUsuariosInactivos"
          component={MostrarUsuariosInactivos}
          options={{
            title: 'Usuarios Inactivos',
            headerRight: null
          }}
          />

        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});