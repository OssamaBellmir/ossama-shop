import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';

// Étapes fixes pour l'exemple (car gérer un vrai tracking backend est complexe pour ce tuto)
const STEPS = [
  { title: 'Order Placed', date: 'Done', completed: true },
  { title: 'Processing', date: 'In Progress', completed: true },
  { title: 'Shipped', date: 'Pending', completed: false },
  { title: 'Out for Delivery', date: 'Pending', completed: false },
  { title: 'Delivered', date: 'Pending', completed: false },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let order: any = {};
  try {
      if (params.order) order = JSON.parse(params.order as string);
  } catch(e) {}

  // Prendre le premier item de la commande pour l'affichage (image, nom)
  const firstItem = order.items && order.items.length > 0 ? order.items[0] : {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{width: 40}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Info Commande */}
        <View style={styles.productCard}>
            <View style={styles.productInfo}>
                <Image 
                    source={{ uri: firstItem.image || 'https://via.placeholder.com/150' }} 
                    style={styles.productImage} 
                />
                <View style={{flex:1}}>
                    <Text style={styles.productName}>{firstItem.name || 'Product'}</Text>
                    {order.items?.length > 1 && (
                        <Text style={{fontSize:12, color:'#666'}}>+ {order.items.length - 1} other items</Text>
                    )}
                    <Text style={styles.productPrice}>Total: ${order.totalAmount}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.orderId}>Order ID: #{order.id?.slice(0,10).toUpperCase()}</Text>
            <Text style={[styles.orderId, {marginTop:5, color: Colors.primary}]}>Status: {order.status}</Text>
        </View>

        {/* Timeline (Statique pour démo) */}
        <View style={styles.timelineContainer}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <View style={styles.stepsWrapper}>
                {STEPS.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                        {index !== STEPS.length - 1 && (
                            <View style={[styles.stepLine, step.completed && styles.activeLine]} />
                        )}
                        <View style={[styles.stepCircle, step.completed && styles.activeCircle]}>
                            {step.completed && <Ionicons name="checkmark" size={12} color="white" />}
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={[styles.stepTitle, step.completed && styles.activeText]}>{step.title}</Text>
                            <Text style={styles.stepDate}>{step.title === 'Order Placed' ? order.date : step.date}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

      </ScrollView>
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
  scrollContent: { padding: 20 },
  productCard: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 25, elevation: 2 },
  productInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  productImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15, backgroundColor: '#eee' },
  productName: { fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 5 },
  productPrice: { color: '#666', fontWeight:'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  orderId: { textAlign: 'center', color: '#888', fontSize: 12 },
  timelineContainer: { backgroundColor: 'white', borderRadius: 15, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  stepsWrapper: { paddingLeft: 10 },
  stepItem: { flexDirection: 'row', marginBottom: 30, position: 'relative' },
  stepLine: { position: 'absolute', left: 11, top: 24, bottom: -30, width: 2, backgroundColor: '#eee', zIndex: 0 },
  activeLine: { backgroundColor: Colors.primary },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'white', borderWidth: 2, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 15, zIndex: 1 },
  activeCircle: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepTextContainer: { flex: 1 },
  stepTitle: { fontSize: 16, color: '#999', marginBottom: 4 },
  activeText: { color: '#333', fontWeight: 'bold' },
  stepDate: { fontSize: 12, color: '#999' },
});