import { StyleSheet } from "react-native";

export const estiloListaGasto = StyleSheet.create({
    listaContenedor:{
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingBottom: 80,
    },
    Carta:{
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    tipoGasto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,

    },
    gasto:{
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    fecha:{
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    usuarioRegistro:{
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    noteShortDesc:{
        fontSize: 16,
        color: '#666'
    },
    
    btn:{
        backgroundColor: "#525FE1",
        borderRadius: 30,
        paddingVertical: 15,
        width: 150, 
        marginTop: 20,
    
    },
    btnText:{
       color:'#fff',
       fontSize: 12,
       fontWeight: '600',
       textAlign:'center'
    },
    padreboton: {
        alignItems: "center",
    },
})