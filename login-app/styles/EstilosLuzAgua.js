import { StyleSheet } from "react-native";

export const estilosLuzAgua = StyleSheet.create({
    scrollContainer:{
        flexGrow: 1,
        
    },
    main:{
        flex: 1,
        alignItems: 'center',
        padding: 12,
        paddingTop: 60,
        
    },
    titulo:{
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
        marginTop: 9,
        fontStyle: 'italic'
    },
    
    card:{
        width: '90%',
        backgroundColor: '#525FE1',
        borderRadius: 20,
        padding: 20,
        marginTop: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 8, 
    },
    inputTexto: {
        width: '100%',
        height: 55,
        borderRadius: 25,
        backgroundColor:'#D9D9D9',
        paddingHorizontal: 15,
        marginVertical: 10,
        color: '#000',
        borderBlockColor: 'transparent',
    },

    picker:{
        height: 55,
        width: '100%',
        borderRadius: 25,
        backgroundColor:'#D9D9D9',
        paddingHorizontal: 15,
        marginVertical: 10,
        color: '#000',
    },
    btn:{
        width: '100%',
        height: 60,
        borderRadius: 25,
        justifyContent: 'center',
        marginTop:20,
        backgroundColor: "#1b2163",
        borderRadius: 30,
        paddingVertical: 15,
        width: 160, 
        marginTop: 20,
    
    },
    btnText:{
       color:'#fff',
       fontSize: 18,
       fontWeight: '600',
       textAlign:'center'
    },
    input:{
         color: 'gray',
        fontSize: 16,
        fontWeight: '300',
        marginTop:15,
    }
})