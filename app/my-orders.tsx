import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';

// Données factices de commandes
const ORDERS = [
  {
    id: 'ORDER-2401',
    date: 'Jan 24, 2025',
    status: 'Processing', // Processing, Completed, Cancelled
    total: '$210.00',
    items: 3,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORDER-2399',
    date: 'Jan 20, 2025',
    status: 'Completed',
    total: '$90.00',
    items: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORDER-2350',
    date: 'Dec 15, 2024',
    status: 'Cancelled',
    total: '$45.00',
    items: 1,
    image: 'https://images.unsplash.com/photo-1503602642458-2321114458ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
];

export default function MyOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Active'); // Active, Completed

  // Filtrer les commandes selon l'onglet
  const filteredOrders = ORDERS.filter(order => {
    if (activeTab === 'Active') return order.status === 'Processing';
    return order.status === 'Completed' || order.status === 'Cancelled';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return '#FFA500'; // Orange
      case 'Completed': return Colors.primary; // Rouge (ou vert '#4ADE80')
      case 'Cancelled': return '#FF6B6B'; // Rouge clair
      default: return '#666';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.imageContainer}>
         <Image source={{ uri: item.image }} style={styles.orderImage} />
      </View>
      
      <View style={styles.orderDetails}>
         <View style={styles.headerRow}>
             <Text style={styles.orderId}>{item.id}</Text>
             <Text style={styles.orderDate}>{item.date}</Text>
         </View>
         
         <Text style={styles.itemsText}>{item.items} items — Total: <Text style={styles.totalText}>{item.total}</Text></Text>
         
         <View style={styles.footerRow}>
             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                 <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
             </View>
             
             <TouchableOpacity style={styles.trackButton} onPress={() => router.push('/order-tracking' as any)}>
                 <Text style={styles.trackButtonText}>Track Order</Text>
             </TouchableOpacity>
         </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{width: 40}} /> 
      </View>

      {/* Tabs (Onglets) */}
      <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Active' && styles.activeTab]}
            onPress={() => setActiveTab('Active')}
          >
              <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
            onPress={() => setActiveTab('Completed')}
          >
              <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
          </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No orders found</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 5 },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Liste
  listContent: { padding: 20 },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f1f2f6',
    marginRight: 15,
  },
  orderImage: { width: '100%', height: '100%', borderRadius: 10 },
  orderDetails: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  orderId: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  orderDate: { fontSize: 12, color: '#888' },
  itemsText: { fontSize: 12, color: '#666', marginBottom: 10 },
  totalText: { fontWeight: 'bold', color: '#333' },
  
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  trackButton: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  trackButtonText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#888', marginTop: 10 },
});