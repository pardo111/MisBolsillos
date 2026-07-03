import { View, Text } from 'react-native';

export default function Transactions() {

    return (
        <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Transacciones</Text>
            <Text>Esta es la pantalla de transacciones.</Text>
        </View>
    );
}