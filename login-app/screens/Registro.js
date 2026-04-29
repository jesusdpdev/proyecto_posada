import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    Text, 
    Alert, 
    StyleSheet, 
    Image, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

export default function RegistroUsuario({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [rol, setRol] = useState('');

    const handleRegistro = async () => {
        if (!nombre || !usuario || !clave || !rol) {
            return Alert.alert("Atención", "Por favor, completa todos los campos, incluyendo el rol.");
        }

        try {
            // Ajusta la IP según tu servidor local
            const url = 'http://192.168.0.108:3001/crearusuario';
            const res = await axios.post(url, { nombre, usuario, clave, rol });
            
            if (res.data.success) {
                Alert.alert("Éxito", "Usuario registrado correctamente.");
                navigation.navigate('Admin');
            } else {
                Alert.alert("Error", res.data.mensaje || "No se pudo registrar.");
            }
        } catch (e) {
            Alert.alert("Error de Conexión", "No hay comunicación con el servidor.");
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* behavior="padding" y el offset de 100 son clave para que no tape los inputs en Android */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "padding"} 
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} 
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.topSection}>
                        <Image source={require('../assets/logo-login.jpg')} style={styles.logo} />
                        <Text style={styles.welcomeText}>Registro de Personal</Text>
                        <Text style={styles.subText}>Posada Villa Montaña</Text>
                    </View>

                    <View style={styles.loginCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre Completo</Text>
                            <TextInput 
                                placeholder="Ej. Juan Pérez" 
                                onChangeText={setNombre} 
                                style={styles.input} 
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Usuario de Acceso</Text>
                            <TextInput 
                                placeholder="Ej. juan2026" 
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Seleccionar Rol</Text>
                            <View style={styles.rolContainer}>
                                <TouchableOpacity 
                                    style={[styles.rolOption, rol === 'mantenimiento' && styles.rolSelected]} 
                                    onPress={() => setRol('mantenimiento')}
                                >
                                    <Text style={[styles.rolText, rol === 'mantenimiento' && styles.rolTextSelected]}>
                                        🛠️ Mantenimiento
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.rolOption, rol === 'admin' && styles.rolSelected]} 
                                    onPress={() => setRol('admin')}
                                >
                                    <Text style={[styles.rolText, rol === 'admin' && styles.rolTextSelected]}>
                                        ⭐ Admin
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={handleRegistro} 
                            style={styles.btn} 
                            activeOpacity={0.8}
                        >
                            <Text style={styles.btnText}>REGISTRAR USUARIO</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#F2F4F7' 
    },
    scrollContent: { 
        flexGrow: 1, 
        alignItems: 'center', 
        paddingBottom: 50 
    },
    topSection: { 
        alignItems: 'center', 
        marginTop: 20, 
        marginBottom: 20 
    },
    logo: { 
        width: 100, 
        height: 100, 
        borderRadius: 20, 
        marginBottom: 10 
    },
    welcomeText: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#2c3e50' 
    },
    subText: { 
        fontSize: 14, 
        color: '#7f8c8d' 
    },
    loginCard: { 
        width: '90%', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 20, 
        padding: 25, 
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    inputGroup: { 
        marginBottom: 15 
    },
    label: { 
        fontSize: 14, 
        color: '#7f8c8d', 
        marginBottom: 8, 
        fontWeight: '600' 
    },
    input: { 
        width: '100%', 
        padding: 12, 
        backgroundColor: '#F9FAFB', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#E5E7EB',
        color: '#2c3e50'
    },
    rolContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 5 
    },
    rolOption: {
        flex: 0.48,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    rolSelected: {
        borderColor: '#525FE1',
        backgroundColor: '#525FE1',
    },
    rolText: { 
        color: '#7f8c8d', 
        fontWeight: 'bold', 
        fontSize: 13 
    },
    rolTextSelected: { 
        color: '#FFFFFF' 
    },
    btn: { 
        backgroundColor: '#525FE1', 
        padding: 16, 
        borderRadius: 12, 
        marginTop: 20, 
        alignItems: 'center' 
    },
    btnText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 15, 
        letterSpacing: 1 
    }
});