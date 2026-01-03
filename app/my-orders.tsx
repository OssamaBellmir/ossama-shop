import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';
import { auth, db } from '../firebase/firebaseConfig';

export default function MyOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Référence vers les commandes de l'utilisateur
    const ordersRef = collection(db, `users/${auth.currentUser.uid}/orders`);
    
    // Écoute en temps réel
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
        const ordersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Tri par date (du plus récent au plus ancien) en JavaScript pour éviter les index Firestore complexes
        ordersList.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setOrders(ordersList);
        setLoading(false);
    }, (error) => {
        console.error("Erreur commandes:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#4CAF50'; // Vert
      case 'Processing': return '#FF9800'; // Orange
      case 'Cancelled': return '#F44336'; // Rouge
      case 'Order Placed': return Colors.primary; // Bleu/Rouge (Thème)
      default: return '#333';
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
            <Text style={styles.orderNo}>Order No: {item.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
            <View style={styles.row}>
                <Text style={styles.label}>Tracking number:</Text>
                <Text style={styles.value}>{item.id.slice(0, 12).toUpperCase()}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Quantity:</Text>
                <Text style={styles.value}>{item.items?.length || 0}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Total Amount:</Text>
                <Text style={styles.totalAmount}>${item.totalAmount?.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.statusContainer, { alignItems: 'flex-end' }]}>
                 <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                 </Text>
            </View>
        </View>

        <TouchableOpacity 
            style={styles.detailButton}
            // On passe l'objet commande complet pour l'afficher dans le tracking
            onPress={() => router.push({ pathname: '/order-tracking', params: { order: JSON.stringify(item) } } as any)}
        >
            <Text style={styles.detailButtonText}>Details</Text>
        </TouchableOpacity>
    </View>
  );

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator color={Colors.primary}/></View>;

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

      {/* Liste des commandes */}
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No orders yet.</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 5 },
  listContent: { padding: 20 },
  
  orderCard: {
    backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderNo: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  orderDate: { color: '#999', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 10 },
  cardBody: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { color: '#888', fontSize: 14 },
  value: { color: '#333', fontWeight: '600', fontSize: 14 },
  totalAmount: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  statusContainer: { marginTop: 5 },
  statusText: { fontWeight: 'bold', fontSize: 14 },

  detailButton: {
    borderWidth: 1, borderColor: '#333', borderRadius: 25, paddingVertical: 10,
    alignItems: 'center',
  },
  detailButtonText: { fontWeight: 'bold', color: '#333' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', marginTop: 10 },
});