import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TouchableOpacity
} from 'react-native';
import axios from "axios";
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from "@expo/vector-icons";


export default function PanelUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [eliminarUsuario, setEliminarUsuario] = useState(false);
    const [actualizarUsuario, setActualizarUsuario] = useState(false);
    const [nombreEdit, setNombreEdit] = useState('');
    const [rolEdit, setRolEdit] = useState('');


    //Funciones

    const modalFuncionEliminar = (usuario = null) => {
        setUsuarioSeleccionado(usuario);
        setModalVisible(!modalVisible);
    }

    const modalFuncionActualizar = (usuario = null) => {
        if (usuario) {
            setNombreEdit(usuario.nombre || '');
            setRolEdit(usuario.rol || '');
        }
        setUsuarioSeleccionado(usuario);
        setActualizarUsuario(!actualizarUsuario);
    }

    const fEliminarUsuario = async () => {
        if (!usuarioSeleccionado) return;
        try {
            const url = 'http://192.168.0.108:3001/eliminarusuario';
            const response = await axios.put(url, { id: usuarioSeleccionado.id });
            if (response.data.success) {
                modalFuncionEliminar(null);
                setEliminarUsuario(!eliminarUsuario);
                obtenerUsuarios();
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setEliminarUsuario(!eliminarUsuario);
        }
    }

    const fActualizarUsuario = async () => {
        if (!usuarioSeleccionado) return;
        try {
            const url = 'http://192.168.0.108:3001/actualizarusuario';
            const response = await axios.put(url, {
                id: usuarioSeleccionado.id,
                nombre: nombreEdit,
                rol: rolEdit
            });
            if (response.data.success) {
                modalFuncionActualizar(null);
                setActualizarUsuario(false);
                obtenerUsuarios();
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            setActualizarUsuario(false);
        }
    }

    const obtenerUsuarios = async () => {
        try {
            const url = 'http://192.168.0.108:3001/listausuarios'; // IP y ruta correctas
            const response = await axios.get(url);

            // Verifica si la respuesta tiene el formato esperado
            if (response.data.success && Array.isArray(response.data.datos)) {
                setUsuarios(response.data.datos);  // Guarda el array de usuarios
            } else {
                console.error('Formato de respuesta inesperado:', response.data);
                setUsuarios([]); // Evita que se rompa la app
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setUsuarios([]);
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    //FUncion para refrescar la lista de usuarios
    const alRefrescar = () => {
        setRefrescando(true);
        obtenerUsuarios();
    };

    //iconos


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Panel de Usuarios</Text>
                <Text style={styles.subtitulo}>Lista de usuarios registrados</Text>
            </View>
            {cargando ? (
                <ActivityIndicator size="large" color="#525FE1" style={{ marginTop: 50 }} />
            ) : (

                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item.id?.toString() || item.id?.toString() || Math.random().toString()}
                    renderItem={({ item }) => (
                        <View style={styles.containerCard}>
                            <View style={styles.colNombre}>
                                <Text style={styles.textoInfo} numberOfLines={1}><b>Nombre:</b> {item.nombre || 'Usuario'} </Text>
                            </View>
                            <View style={styles.colRol}>
                                <Text style={styles.textoRol} numberOfLines={1}><b>Rol:</b> {item.rol || 'Sin rol'}</Text>
                            </View>
                            <View style={styles.colIconos}>
                                <TouchableOpacity onPress={() => modalFuncionEliminar(item)} style={{ marginRight: 15 }}>
                                    <FontAwesome5 name="trash" size={24} color="#e74c3c" solid />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => modalFuncionActualizar(item)} style={{ marginRight: 15 }}>
                                    <FontAwesome5 name="user" size={24} color="#3498db" solid />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No se encontraron usuarios.</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refrescando} onRefresh={alRefrescar} />
                    }
                    contentContainerStyle={styles.listaContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Modal de Eliminar */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => modalFuncion(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Confirmar eliminación</Text>
                        <Text style={styles.modalText}>
                            ¿Estás seguro de que deseas eliminar a {usuarioSeleccionado?.nombre || usuarioSeleccionado?.nombre || 'este usuario'}?
                        </Text>
                        <View style={styles.modalBotones}>
                            <TouchableOpacity style={[styles.botonModal, styles.botonCancelar]} onPress={() => modalFuncionEliminar(null)}>
                                <Text style={styles.textoBotonModal}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.botonModal, styles.botonEliminar]} onPress={fEliminarUsuario}>
                                <Text style={styles.textoBotonModalBlanco}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Actualización */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={actualizarUsuario}
                onRequestClose={() => modalFuncionActualizar(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.label}>
                            Nombre:
                        </Text>
                        <TextInput style={styles.input} value={nombreEdit || ''} onChangeText={setNombreEdit} />
                        <Text style={styles.label}>
                            Seleccionar rol:
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                            <TouchableOpacity onPress={() => setRolEdit('admin')} style={{
                                backgroundColor: rolEdit === 'admin' ? '#3498db' : '#131313ff',
                                padding: 10,
                                borderRadius: 8,
                                marginRight: 10,
                                width: 'auto',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.textoBotonModalBlanco}>Admin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRolEdit('mantenimiento')} style={{
                                backgroundColor: rolEdit === 'mantenimiento' ? '#3498db' : '#131313ff',
                                padding: 10,
                                marginLeft: 10,
                                borderRadius: 8,
                                width: 'auto',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.textoBotonModalBlanco}>Mantenimiento</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBotones}>
                            <TouchableOpacity style={[styles.botonModal, styles.botonCancelar]} onPress={() => modalFuncionActualizar(null)}>
                                <Text style={styles.textoBotonModal}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.botonModal, styles.botonActualizar]} onPress={fActualizarUsuario}>
                                <Text style={styles.textoBotonModalBlanco}>Actualizar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )


};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F2F4F7' },
    containerCard: {
        backgroundColor: '#ffffff',    // Fondo blanco para la tarjeta
        borderRadius: 12,             // Bordes redondeados
        padding: 16,                  // Espacio interno
        marginVertical: 8,            // Separación vertical entre tarjetas
        marginHorizontal: 16,         // Margen lateral
        boxShadow: '0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%)',
        elevation: 3,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    colNombre: { flex: 2, alignItems: 'flex-start', justifyContent: 'center' },
    colRol: { flex: 1.5, alignItems: 'center', justifyContent: 'center' },
    colIconos: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' },
    textoInfo: { fontSize: 16, color: '#2c3e50', textAlign: 'left' },
    textoRol: { fontSize: 14, color: '#7f8c8d', textAlign: 'center' },
    header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4, marginBottom: 10 },
    titulo: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
    subtitulo: { fontSize: 14, color: '#7f8c8d', marginTop: 4, textAlign: 'center' },
    listaContainer: { padding: 15, paddingBottom: 30 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    // Estilos del Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
    modalText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 25 },
    modalBotones: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    botonModal: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
    botonCancelar: { backgroundColor: '#ecf0f1' },
    botonEliminar: { backgroundColor: '#e74c3c' },
    textoBotonModal: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
    textoBotonModalBlanco: { fontSize: 16, fontWeight: 'bold', color: '#ffffff'},
    botonActualizar: { backgroundColor: '#3498db' },
    input: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', backgroundColor: '#ecf0f1', padding: 10, borderRadius: 8, marginTop: 5, marginBottom: 10, borderColor: '#2c3e50', borderWidth: 1 },
});