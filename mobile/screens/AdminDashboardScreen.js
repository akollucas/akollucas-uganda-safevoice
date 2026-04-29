import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import api from '../api/client';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';

export default function AdminDashboardScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => { /* same as web */ };
  const fetchStats = async () => { /* same as web */ };

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Admin Dashboard</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 16 }}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('CasesFilter', { status: 'pending' })}>
            <Text style={{ fontSize: 20 }}>{stats.pending}</Text>
            <Text>Pending</Text>
          </TouchableOpacity>
          {/* other stat cards */}
        </View>
        <VictoryChart>
          <VictoryBar data={stats.districtData} x="district" y="count" />
        </VictoryChart>
        <FlatList data={reports} keyExtractor={item => item.id} renderItem={({ item }) => <CaseCard case={item} />} />
      </View>
    </ScrollView>
  );
}