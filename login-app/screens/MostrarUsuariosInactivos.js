import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Modal, TextInput, Platform } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";


export default function MostrarUsuariosInactivos() {
    const [usuarioInactivo, setUsuarioInactivo] = useState([])
    const [loading, setLoading] = useState(false)
    const [refrescando, setRefrescando] = useState(false);
    const [modalActivo, setModalActivo] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);


//Funciones
    const mostrarUInactivos = async () => {
        setUsuarioSeleccionado(null)
        setModalActivo(false)
        setLoading(true)
        try {
            const url = 'http://192.168.0.108:3001/usuariosinactivos';
            const response = await axios.get(url);
            
            //Verificar si la respuesta enviada tiene el formato que se espera
            if(response.data.success && Array.isArray(response.data.datos)){
                setUsuarioInactivo(response.data.datos)
            } else {
                console.log('Formato de respuesta inesperado: ', response.data)
                setUsuarioInactivo([])
            }
        } catch (error) {
            console.error('Error al mostrar los usuarios', error)
            setUsuarioInactivo([]); //Se muestra la lista vacia y evita que rompa la app
        } finally {
            setLoading(false) //Se meustra el estado de carga
            setRefrescando(false)
        }
    }

    const alRefrescar = () => {
        setRefrescando(true);
        mostrarUInactivos();
    }

    const modalFuncionActivar = (usuario = null) => {
        setUsuarioSeleccionado(usuario)
        setModalActivo(!modalActivo)
    }


    const ejecutarReactivacion = async (id) => {
        try {
            const url = 'http://192.168.0.108:3001/reactivarusuario';
            const response = await axios.put(url, { id });

            if (response.data.success) {
                modalFuncionActivar()
                mostrarUInactivos();
            } else {
               console.error(response.data.message)
            }
        } catch (error) {
            console.error('Error completo:', error);
        }
    }

useEffect(() => {
    mostrarUInactivos();
}, []);
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Usuarios Inactivos</Text>
                <Text style={styles.subtitulo}>Lista de personal dado de baja</Text>
            </View>
            <View style={{ flex: 1 }}>
                {loading && !refrescando ? (
                    <ActivityIndicator size='large' color='#525FE1' style={{ marginTop: 20 }}/>
                ) : (
                    <FlatList
                        data={usuarioInactivo}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        renderItem={({ item }) => (
                            <View style={styles.containerCard}>
                                <View style={styles.colNombre}>
                                    <Text style={styles.textoInfo} numberOfLines={1}>
                                        <Text style={{fontWeight: 'bold'}}>Nombre:</Text> {item.nombre || 'Usuario'}
                                    </Text>
                                </View>
                                <View style={styles.colRol}>
                                    <Text style={styles.textoRol} numberOfLines={1}>
                                        <Text style={{fontWeight: 'bold'}}>Rol:</Text> {item.rol || 'Sin rol'}
                                    </Text>
                                </View>
                                <View style={styles.colIconos}>
                                    <TouchableOpacity 
                                        onPress={() => modalFuncionActivar(item)}
                                        style={styles.botonReactivar}
                                    >
                                        <FontAwesome5 name="user-check" size={20} color="#2ecc71" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No se encontraron usuarios inactivos.</Text>
                            </View>
                        }
                        refreshControl={
                            <RefreshControl refreshing={refrescando} onRefresh={alRefrescar} />
                        }
                        contentContainerStyle={{ paddingVertical: 10 }}
                    />
                )}
            </View>
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalActivo}
                    onRequestClose={() => modalFuncionActivar()}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitulo}>Reactivar Usuario</Text>
                            
                            <Text style={styles.label}>Nombre:</Text>
                            <TextInput 
                                style={styles.input} 
                                value={usuarioSeleccionado?.nombre || ''} 
                                editable={false} 
                            />

                            <Text style={styles.label}>¿Confirmas que deseas activar a este usuario?</Text>
                            
                            <View style={styles.modalBotones}>
                                <TouchableOpacity 
                                    onPress={() => modalFuncionActivar()}
                                    style={[styles.botonBase, styles.botonCancelar]}
                                >
                                    <Text style={styles.botonTexto}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => ejecutarReactivacion(usuarioSeleccionado?.id)}
                                    style={[styles.botonBase, styles.botonConfirmar]}
                                >
                                    <FontAwesome5 name="user-check" size={18} color="#fff" />
                                    <Text style={styles.botonTexto}> Activar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
               </Modal>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    titulo: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 4,
    },
    subtitulo: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    containerCard: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    colNombre: {
        flex: 2,
        marginRight: 10,
    },
    textoInfo: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: 'bold',
    },
    colRol: {
        flex: 1,
        marginRight: 10,
    },
    textoRol: {
        fontSize: 16,
        color: '#2c3e50',
    },
    colIconos: {
        flex: 0.5,
        alignItems: 'flex-end',
    },
    botonReactivar: {
        backgroundColor: '#e8f8f0',
        padding: 8,
        borderRadius: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    // Estilos del Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        color: '#2c3e50',
    },
    modalBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    botonBase: {
        flex: 1,
        flexDirection: 'row',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    botonCancelar: {
        backgroundColor: '#95a5a6',
    },
    botonConfirmar: {
        backgroundColor: '#2ecc71',
    },
    botonTexto: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
