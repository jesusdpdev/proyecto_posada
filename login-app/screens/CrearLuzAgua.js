import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { estilosLuzAgua } from '../styles/EstilosLuzAgua';

export default function CrearLuzAgua({ navigation, route }) {
    const { idUsuario, nombreUsuario } = route.params || {};
    const [tipo, setTipo] = useState('Agua');
    const [valor, setValor] = useState('');

    const guardar = async () => {
        if (!valor || isNaN(valor)) return Alert.alert("Error", "Ingresa un valor numérico");

        try {
            const res = await axios.post('http://192.168.0.108:3001/registrogasto', {
                tipo: tipo,
                lectura_valor: parseFloat(valor),
                registrado_por: idUsuario
            });

            if (res.data.success) {
                Alert.alert("Éxito", "Registro guardado correctamente");
                // Regresa automáticamente a Admin o Mantenimiento
                navigation.goBack(); 
            }
        } catch (e) {
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    return (
        <ScrollView contentContainerStyle={estilosLuzAgua.scrollContainer}>
            <View style={estilosLuzAgua.main}>
                <Text style={estilosLuzAgua.titulo}>Registro de Gasto</Text>
                <Text style={{marginBottom: 15}}>Registrado por: {nombreUsuario}</Text>
                
                <View style={estilosLuzAgua.card}>
                    <Text style={{fontWeight: 'bold'}}>Servicio:</Text>
                    <Picker selectedValue={tipo} onValueChange={(v) => setTipo(v)} style={estilosLuzAgua.picker}>
                        <Picker.Item label="Agua (Tanque)" value="Agua" />
                        <Picker.Item label="Luz (Contador)" value="Luz" />
                    </Picker>

                    <Text style={{fontWeight: 'bold', marginTop: 15}}>Lectura Actual:</Text>
                    <TextInput 
                        placeholder="0.00" 
                        keyboardType="numeric" 
                        onChangeText={setValor} 
                        style={estilosLuzAgua.inputTexto} 
                    />

                    <TouchableOpacity onPress={guardar} style={estilosLuzAgua.btn}>
                        <Text style={estilosLuzAgua.btnText}>Guardar en Base de Datos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}