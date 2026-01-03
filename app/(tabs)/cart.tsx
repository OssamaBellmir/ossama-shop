import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../constants/Styles';

// Données factices pour le panier
const INITIAL_CART = [
  {
    id: '1',
    name: 'Light Brown Coat',
    category: 'Clothes',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Nike Pegasus 39',
    category: 'Shoes',
    price: 90.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    quantity: 1,
  },
  {
    id: '3',
    name: 'Wooden Chair',
    category: 'Furniture',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1503602642458-2321114458ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    quantity: 2,
  },
];

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  // Calculs
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 25.00;
  const discount = 35.00;
  const total = subTotal + deliveryFee - discount;

  // Fonctions de gestion (Simulées)
  const incrementQty = (id: string) => {
    setCartItems(items => 
      items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decrementQty = (id: string) => {
    setCartItems(items => 
      items.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        {/* On peut ajouter une icône ici si besoin */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Liste des produits */}
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            {/* Image */}
            <View style={styles.imageContainer}>
               <Image source={{ uri: item.image }} style={styles.itemImage} />
            </View>

            {/* Infos */}
            <View style={styles.itemDetails}>
               <Text style={styles.itemName}>{item.name}</Text>
               <Text style={styles.itemCategory}>{item.category}</Text>
               <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            {/* Actions (Quantité + Supprimer) */}
            <View style={styles.actionsContainer}>
               <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
               </TouchableOpacity>

               <View style={styles.qtyContainer}>
                  <TouchableOpacity onPress={() => decrementQty(item.id)} style={styles.qtyBtn}>
                     <Ionicons name="remove" size={16} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => incrementQty(item.id)} style={[styles.qtyBtn, {backgroundColor: Colors.primary}]}>
                     <Ionicons name="add" size={16} color="white" />
                  </TouchableOpacity>
               </View>
            </View>
          </View>
        ))}

        {/* Code Promo */}
        <View style={styles.promoContainer}>
           <TextInput 
              placeholder="Promo Code" 
              style={styles.promoInput} 
              placeholderTextColor="#999"
           />
           <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
           </TouchableOpacity>
        </View>

        {/* Résumé des coûts */}
        <View style={styles.summaryContainer}>
           <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub-Total</Text>
              <Text style={styles.summaryValue}>${subTotal.toFixed(2)}</Text>
           </View>
           <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
           </View>
           <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, {color: Colors.primary}]}>-${discount.toFixed(2)}</Text>
           </View>
           
           <View style={styles.divider} />
           
           <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Cost</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
           </View>
        </View>

        {/* Bouton Checkout */}
        <TouchableOpacity 
          style={globalStyles.primaryButton}
          onPress={() => {
             // Redirection vers le Checkout (Prochaine étape)
             // router.push('/checkout');
             alert('Prochaine étape : Paiement');
          }}
        >
           <Text style={globalStyles.primaryButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 20 },

  // Item Panier
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: { width: 70, height: 70, resizeMode: 'contain' },
  itemDetails: { flex: 1, marginLeft: 15 },
  itemName: { fontWeight: 'bold', fontSize: 14, color: '#333', marginBottom: 5 },
  itemCategory: { color: '#888', fontSize: 12, marginBottom: 5 },
  itemPrice: { fontWeight: 'bold', fontSize: 16, color: '#333' },
   
  // Actions Droite
  actionsContainer: { alignItems: 'flex-end', justifyContent: 'space-between', height: 80 },
  deleteButton: { padding: 5 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 20, padding: 3 },
  qtyBtn: { width: 25, height: 25, borderRadius: 12.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  qtyText: { marginHorizontal: 10, fontWeight: 'bold' },

  // Promo
  promoContainer: { flexDirection: 'row', marginBottom: 20, marginTop: 10 },
  promoInput: { flex: 1, backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, height: 50, marginRight: 10, elevation: 1 },
  applyButton: { backgroundColor: Colors.primary, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 20 },
  applyButtonText: { color: 'white', fontWeight: 'bold' },

  // Résumé
  summaryContainer: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#888', fontSize: 14 },
  summaryValue: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalLabel: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  totalValue: { fontWeight: 'bold', fontSize: 18, color: Colors.primary },
});