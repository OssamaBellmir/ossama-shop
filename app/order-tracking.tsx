import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

const STEPS = [
  { title: 'Order Placed', date: '23 Aug 2025, 10:00 AM', completed: true },
  { title: 'Order Confirmed', date: '23 Aug 2025, 11:30 AM', completed: true },
  { title: 'Order Shipped', date: '24 Aug 2025, 08:00 PM', completed: true },
  { title: 'Out for Delivery', date: 'Pending', completed: false },
  { title: 'Delivered', date: 'Pending', completed: false },
];

export default function OrderTrackingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{width: 40}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Carte Produit */}
        <View style={styles.productCard}>
            <View style={styles.productInfo}>
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' }} 
                    style={styles.productImage} 
                />
                <View>
                    <Text style={styles.productName}>Nike Pegasus 39</Text>
                    <Text style={styles.productPrice}>$120.00 • 1 Item</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.orderId}>Order ID: #ORDER-2401</Text>
        </View>

        {/* Timeline (Suivi) */}
        <View style={styles.timelineContainer}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            
            <View style={styles.stepsWrapper}>
                {STEPS.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                        {/* Ligne verticale (sauf pour le dernier) */}
                        {index !== STEPS.length - 1 && (
                            <View style={[styles.stepLine, step.completed && styles.activeLine]} />
                        )}
                        
                        {/* Point (Cercle) */}
                        <View style={[styles.stepCircle, step.completed && styles.activeCircle]}>
                            {step.completed && <Ionicons name="checkmark" size={12} color="white" />}
                        </View>

                        {/* Textes */}
                        <View style={styles.stepTextContainer}>
                            <Text style={[styles.stepTitle, step.completed && styles.activeText]}>{step.title}</Text>
                            <Text style={styles.stepDate}>{step.date}</Text>
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
  scrollContent: { padding: 20 },

  // Carte Produit
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    elevation: 2,
  },
  productInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  productImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15, backgroundColor: '#eee' },
  productName: { fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 5 },
  productPrice: { color: '#666' },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  orderId: { textAlign: 'center', color: '#888', fontSize: 12 },

  // Timeline
  timelineContainer: { backgroundColor: 'white', borderRadius: 15, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  stepsWrapper: { paddingLeft: 10 },
  stepItem: { flexDirection: 'row', marginBottom: 30, position: 'relative' },
  
  stepLine: {
    position: 'absolute',
    left: 11, // Centré sous le cercle (width 24 / 2 - 1)
    top: 24,
    bottom: -30, // Connecte au suivant
    width: 2,
    backgroundColor: '#eee',
    zIndex: 0,
  },
  activeLine: { backgroundColor: Colors.primary },

  stepCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
    zIndex: 1,
  },
  activeCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  stepTextContainer: { flex: 1 },
  stepTitle: { fontSize: 16, color: '#999', marginBottom: 4 },
  activeText: { color: '#333', fontWeight: 'bold' },
  stepDate: { fontSize: 12, color: '#999' },
});