import { Text, StyleSheet, View, TouchableOpacity, FlatList, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { estiloListaGasto } from '../styles/EstiloListaGasto'
import axios from 'axios';


export default function Mantenimiento({ navigation, route }) {
    // Los parámetros llegan directamente desde el Stack (Login -> Mantenimiento)
    const { idUsuario, nombreUsuario } = route.params || {};
    
    const [gastos, setGastos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Lógica de recordatorio de 3 días
    const verificarAntiguedad = (datosServidor) => {
        const hoy = new Date();
        const TRES_DIAS = 3 * 24 * 60 * 60 * 1000;

        datosServidor.forEach(item => {
            const ultimaFecha = new Date(item.ultima_fecha);
            const diferencia = hoy - ultimaFecha;

            if (diferencia > TRES_DIAS) {
                Alert.alert(
                    "⚠️ Recordatorio",
                    `Han pasado más de 3 días desde el último registro de: ${item.tipo}.`,
                    [
                        { text: "Después", style: "cancel" },
                        { 
                            text: "Registrar ahora", 
                            onPress: () => navigation.navigate('CrearLuzAgua', { idUsuario, nombreUsuario }) 
                        }
                    ]
                );
            }
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await cargarGasto();
        setRefreshing(false);
    };
    
    const cargarGasto = async () => {
        try {
            const url = 'http://192.168.0.108:3001/listagastos';
            const respuesta = await axios.post(url);

            if (respuesta.data.success) {
                setGastos(respuesta.data.datos);
            }

            const ruta = 'http://192.168.0.108:3001/verificarfecha';
            const Alertas = await axios.post(ruta);
            if (Alertas.data.success) {
                verificarAntiguedad(Alertas.data.datos);
            }

        } catch (error) {
            console.log('Error al cargar la información:', error)
        }
    }

    useEffect(() => {
        // Esto refresca la lista cada vez que el usuario vuelve a esta pantalla
        const unsusbcribe = navigation.addListener('focus', cargarGasto);
        return unsusbcribe;
    }, [navigation])

    const renderGasto = ({ item }) => (
        <View style={estiloListaGasto.Carta}>
            <View style={styles.cardContent}>
                <View>
                    <Text style={estiloListaGasto.tipoGasto}>
                        {item.tipo === 'Agua' ? '💧 Agua' : '⚡ Luz'}
                    </Text>
                    <Text style={estiloListaGasto.fecha}>{item.fecha_lista}</Text>
                </View>
                <View style={styles.valorContainer}>
                    <Text style={styles.valorTexto}>{item.lectura_valor}</Text>
                    <Text style={styles.subtext}>Lectura</Text>
                </View>
            </View>
            <Text style={estiloListaGasto.usuarioRegistro}>Registrado por: {item.nombre}</Text>
        </View>
    )
    
    return (
        <View style={styles.contenedorPrincipal}>
            <View style={styles.header}>
                <Text style={styles.tituloPancarta}>Panel de Mantenimiento</Text>
                <Text style={styles.subtitulo}>Operador: {nombreUsuario || 'Mantenimiento'}</Text>
            </View>
            
            <View style={styles.seccionBoton}>
                <TouchableOpacity 
                    style={styles.botonNuevo} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CrearLuzAgua', { idUsuario, nombreUsuario })} 
                >
                    <Text style={styles.iconoBoton}>➕</Text>
                    <Text style={styles.btnTextNuevo}>Nuevo Registro de Gasto</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.tituloSeccion}>Historial Reciente</Text>

            <FlatList 
                data={gastos} 
                keyExtractor={(item) => item.id.toString()} 
                renderItem={renderGasto} 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#95a5a6' }}>
                        No hay registros recientes.
                    </Text>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contenedorPrincipal: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 15,
        marginBottom: 20,
    },
    tituloPancarta: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitulo: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 4,
    },
    seccionBoton: {
        marginBottom: 25,
    },
    botonNuevo: {
        backgroundColor: '#525FE1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    iconoBoton: {
        fontSize: 20,
        marginRight: 10,
    },
    btnTextNuevo: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    tituloSeccion: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 12,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    valorContainer: {
        alignItems: 'flex-end',
    },
    valorTexto: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#525FE1',
    },
    subtext: {
        fontSize: 12,
        color: '#bdc3c7',
    }
})