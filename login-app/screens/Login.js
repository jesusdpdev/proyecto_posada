import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Image } from 'react-native';
// CAMBIO AQUÍ: Importamos SafeAreaView de safe-area-context
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

export default function Login({ navigation }) {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');

    const handleLogin = async () => {
        if (!usuario || !clave) return Alert.alert("Atención", "Por favor, rellena todos los campos");
        try {
            // RECUERDA VERIFICAR TU IP CON IPCONFIG
            const res = await axios.post('http://192.168.0.108:3001/login', { usuario, clave });
            
            if (res.data.success) {
                const { id_usuario, rol, nombre } = res.data;
                const params = { idUsuario: id_usuario, nombreUsuario: nombre };
                
                if (rol === 'admin') {
                    navigation.navigate('Admin', params);
                } else {
                    navigation.navigate('Mantenimiento', params);
                }
            } else {
                Alert.alert("Error", "Usuario o contraseña incorrectos");
            }
        } catch (e) {
            Alert.alert("Error de Conexión", "No se pudo conectar con el servidor de la posada");
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.topSection}>
                <Image source={require('../assets/logo-login.jpg')} style={styles.logo} />
                <Text style={styles.welcomeText}>Posada Villa Montaña</Text>
            </View>

            <View style={styles.loginCard}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Usuario</Text>
                    <TextInput 
                        placeholder="Ingresa tu usuario" 
                        onChangeText={setUsuario} 
                        style={styles.input} 
                        autoCapitalize="none" 
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput 
                        placeholder="••••••••" 
                        secureTextEntry 
                        onChangeText={setClave} 
                        style={styles.input} 
                    />
                </View>

                <TouchableOpacity onPress={handleLogin} style={styles.btn} activeOpacity={0.8}>
                    <Text style={styles.btnText}>INGRESAR</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>Sistema de Control Interno v1.0</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F2F4F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 25,
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    loginCard: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        width: '100%',
        padding: 15,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        fontSize: 16,
    },
    btn: {
        backgroundColor: '#525FE1',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    footerText: {
        marginTop: 40,
        color: '#bdc3c7',
        fontSize: 12,
    }
});