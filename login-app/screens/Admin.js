import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Admin({ route, navigation }) {
    // Recibimos los parámetros directamente desde el Login
    const { idUsuario, nombreUsuario } = route.params || {};
  

    return (
        <View style={styles.contenedor}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Sección de bienvenida */}
                <View style={styles.header}>
                    <Text style={styles.titulo}>Panel Administrativo</Text>
                    <Text style={styles.subtitulo}>Bienvenido, <b>{nombreUsuario || 'Usuario'}</b></Text>
                    <Text style={styles.subtitulo}>Ultima conexion: {new Date().toLocaleString()}</Text>
                </View>

                {/* Botón para el registro de servicios */}
                <TouchableOpacity 
                    style={styles.boton} 
                    onPress={() => navigation.navigate('CrearLuzAgua', { idUsuario, nombreUsuario })}
                    activeOpacity={0.7}
                >
                    <View style={styles.circuloIcono}>
                        <Text style={styles.icono}>⚡</Text> 
                    </View>
                    <View>
                        <Text style={styles.textoBoton}>Registrar Servicios</Text>
                        <Text style={styles.textoSecundario}>Luz y Agua</Text>
                    </View>
                </TouchableOpacity>

                {/* Botón para registrar nuevo usuario */}
                <TouchableOpacity 
                    style={[styles.boton, { marginTop: 20, backgroundColor: '#2ecc71' }]} 
                    onPress={() => navigation.navigate('Registro')}
                    activeOpacity={0.7}
                >
                    <View style={styles.circuloIcono}>
                        <Text style={styles.icono}>👤</Text> 
                    </View>
                    <View>
                        <Text style={styles.textoBoton}>Nuevo Operador</Text>
                        <Text style={styles.textoSecundario}>Registrar Usuario Nuevo</Text>
                    </View>
                </TouchableOpacity>

                {/* Nuevo boton para panel de usuarios */}

                <TouchableOpacity style={[styles.boton, { marginTop: 20, backgroundColor: '#e74c3c' }]}
                onPress={() => navigation.navigate('PanelUsuarios')}
                activeOpacity={0.7}
                >
                    <View style={styles.circuloIcono}><Text style={styles.icono}>👥</Text></View>
                    <View>
                        <Text style={styles.textoBoton}>Panel de Usuarios</Text>
                        <Text style={styles.textoSecundario}>Ver y administrar usuarios</Text>
                    </View>
                        
                </TouchableOpacity>

                {/* NUEVO BOTÓN: Historial de Accesos */}
                <TouchableOpacity 
                    style={[styles.boton, { marginTop: 20, backgroundColor: '#f39c12' }]} 
                    onPress={() => navigation.navigate('HistorialAccesos')} 
                    activeOpacity={0.7}
                >
                    <View style={styles.circuloIcono}>
                        <Text style={styles.icono}>🕒</Text> 
                    </View>
                    <View>
                        <Text style={styles.textoBoton}>Historial de Accesos</Text>
                        <Text style={styles.textoSecundario}>Ver quién ha iniciado sesión</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>

            <Text style={styles.footerText}>Posada Villa Montaña - Software Informático</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { 
        flex: 1, 
        backgroundColor: '#f8f9fa', 
        padding: 20 
    },
    header: { 
        marginBottom: 30,
        marginTop: 10 
    },
    titulo: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: '#2c3e50' 
    },
    subtitulo: { 
        fontSize: 16, 
        color: '#7f8c8d',
        marginTop: 5
    },
    boton: { 
        backgroundColor: '#525FE1', 
        padding: 20, 
        borderRadius: 20, 
        flexDirection: 'row', 
        alignItems: 'center', 
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    circuloIcono: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    icono: { 
        fontSize: 24 
    },
    textoBoton: { 
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    textoSecundario: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14
    },
    footerText: {
        marginTop: 20,
        alignSelf: 'center',
        color: '#bdc3c7',
        fontSize: 12,
        marginBottom: 10
    }
});