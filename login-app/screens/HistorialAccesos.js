import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

export default function HistorialAccesos() {
    const [accesos, setAccesos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);

    // Función para obtener los datos del servidor
    const obtenerAccesos = async () => {
        try {
            const url = 'http://192.168.0.108:3001/historial-accesos';
            const res = await axios.get(url);
            if (res.data.success) {
                setAccesos(res.data.datos);
            }
        } catch (error) {
            console.error("Error al obtener accesos:", error);
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    };

    useEffect(() => {
        obtenerAccesos();
    }, []);

    // Función para jalar y refrescar la lista
    const alRefrescar = () => {
        setRefrescando(true);
        obtenerAccesos();
    };

    // Diseño de cada "cuadrado" o tarjeta de acceso
    const renderAcceso = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.indicadorVerde} />
            <View style={styles.infoContainer}>
                <Text style={styles.nombreUsuario}>{item.nombre_usuario}</Text>
                <View style={styles.fechaContainer}>
                    <Text style={styles.iconoReloj}>🕒</Text>
                    <Text style={styles.fechaTexto}>{item.fecha_formateada}</Text>
                </View>
            </View>
            <View style={styles.tag}>
                <Text style={styles.tagText}>Ingreso</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Historial de Accesos</Text>
                <Text style={styles.subtitulo}>Registros de entrada recientes</Text>
            </View>

            {cargando ? (
                <ActivityIndicator size="large" color="#525FE1" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={accesos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAcceso}
                    contentContainerStyle={styles.listaContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refrescando} onRefresh={alRefrescar} />
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No hay registros de acceso aún.</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F2F4F7' },
    header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4, marginBottom: 10 },
    titulo: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
    subtitulo: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
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
    indicadorVerde: { width: 4, height: '100%', backgroundColor: '#2ecc71', borderRadius: 2, marginRight: 15 },
    infoContainer: { flex: 1 },
    nombreUsuario: { fontSize: 17, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
    fechaContainer: { flexDirection: 'row', alignItems: 'center' },
    iconoReloj: { fontSize: 12, marginRight: 5 },
    fechaTexto: { fontSize: 13, color: '#95a5a6' },
    tag: { backgroundColor: '#E8F8F0', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    tagText: { color: '#2ecc71', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#bdc3c7', fontSize: 16 }
});