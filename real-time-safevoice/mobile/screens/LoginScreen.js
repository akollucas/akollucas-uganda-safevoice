import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const res = await login(username, password, role);
            // Navigation will happen automatically because user state changes
        } catch (err) {
            Alert.alert('Error', 'Invalid credentials');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Staff Login</Text>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <View style={styles.pickerRow}>
                {['admin', 'policeAdmin', 'policeOfficer', 'volunteer'].map(r => (
                    <TouchableOpacity key={r} style={[styles.roleBtn, role === r && styles.roleActive]} onPress={() => setRole(r)}>
                        <Text style={role === r ? styles.roleActiveText : styles.roleText}>{r}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('VictimLogin')}>
                <Text style={styles.victimLink}>Victim? Login with Case ID & Access Code</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f3f4f6' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
    pickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    roleBtn: { padding: 8, borderRadius: 20, backgroundColor: '#e5e7eb', flex: 1, marginHorizontal: 4, alignItems: 'center' },
    roleActive: { backgroundColor: '#2563eb' },
    roleText: { color: '#1f2937' },
    roleActiveText: { color: 'white' },
    loginBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center' },
    loginText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    victimLink: { marginTop: 20, textAlign: 'center', color: '#2563eb' }
});