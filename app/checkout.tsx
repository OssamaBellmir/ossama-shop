import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../constants/Styles';
import { auth, db } from '../firebase/firebaseConfig';

export default function CheckoutScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // 1. Récupérer le panier pour le total
  useEffect(() => {
    if (!auth.currentUser) return;
    
    const fetchCart = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${auth.currentUser?.uid}/cart`));
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCartItems(items);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchCart();
  }, []);

  // Calculs (Identiques au panier)
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 25.00 : 0;
  const discount = cartItems.length > 0 ? 35.00 : 0;
  const totalRaw = subTotal + deliveryFee - discount;
  const total = totalRaw > 0 ? totalRaw : 0;

  // 2. Gérer le paiement et la création de commande
  const handlePayment = async () => {
    if (cartItems.length === 0) {
        Alert.alert("Erreur", "Votre panier est vide.");
        return;
    }

    setProcessing(true);
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // A. Créer la commande dans Firestore
        const orderData = {
            items: cartItems,
            totalAmount: total,
            status: 'Order Placed', // Statut initial
            date: new Date().toLocaleString(),
            createdAt: new Date().toISOString(),
            shippingAddress: "Home, Meknes, Morocco" // Adresse par défaut pour l'exemple
        };

        await addDoc(collection(db, `users/${userId}/orders`), orderData);

        // B. Vider le panier (Supprimer tous les documents de 'cart')
        const batch = writeBatch(db);
        cartItems.forEach(item => {
            const itemRef = doc(db, `users/${userId}/cart`, item.id);
            batch.delete(itemRef);
        });
        await batch.commit();

        // C. Succès !
        Alert.alert(
            "Paiement Réussi ! 🎉",
            "Votre commande a été enregistrée avec succès.",
            [{ 
                text: "Voir mes commandes", 
                onPress: () => {
                    // On retourne à la racine puis on va vers les commandes pour éviter les problèmes de navigation
                    router.dismissAll(); 
                    router.replace('/my-orders' as any);
                } 
            }]
        );

    } catch (error: any) {
        Alert.alert("Erreur", "Le paiement a échoué : " + error.message);
    } finally {
        setProcessing(false);
    }
  };

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator color={Colors.primary}/></View>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{width: 40}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Adresse */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.card}>
            <View style={styles.addressRow}>
                <View style={styles.iconBox}>
                    <Ionicons name="location" size={20} color={Colors.primary} />
                </View>
                <View>
                    <Text style={styles.addressType}>Home</Text>
                    <Text style={styles.addressText}>123, Main Street, Meknes, Morocco</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="pencil" size={18} color="#666" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Aperçu rapide des articles */}
        <Text style={styles.sectionTitle}>Order Items ({cartItems.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsList}>
            {cartItems.map((item, index) => (
                <View key={index} style={styles.miniItemCard}>
                    <Image source={{uri: item.image}} style={styles.miniItemImage} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.quantity}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>

        {/* Méthode de Paiement (Visuel seulement pour l'instant) */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethods}>
             <TouchableOpacity style={[styles.paymentCard, styles.activePayment]}>
                <Ionicons name="card" size={24} color={Colors.primary} />
                <Text style={styles.paymentText}>Card</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.paymentCard}>
                <Ionicons name="logo-paypal" size={24} color="#666" />
                <Text style={styles.paymentText}>PayPal</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.paymentCard}>
                <Ionicons name="cash-outline" size={24} color="#666" />
                <Text style={styles.paymentText}>Cash</Text>
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
                <Text style={styles.totalLabel}>Total Payment</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
        </View>

        {/* Bouton de Paiement */}
        <TouchableOpacity 
            style={[globalStyles.primaryButton, {marginTop: 20}]}
            onPress={handlePayment}
            disabled={processing}
        >
            {processing ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={globalStyles.primaryButtonText}>Pay Now</Text>
            )}
        </TouchableOpacity>

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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 1 },
  addressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  addressType: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  addressText: { color: '#666', fontSize: 12, maxWidth: 200 },
  
  itemsList: { flexDirection: 'row', marginBottom: 10 },
  miniItemCard: { width: 70, height: 70, backgroundColor: 'white', borderRadius: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', elevation: 1, position: 'relative' },
  miniItemImage: { width: 50, height: 50, resizeMode: 'contain' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: Colors.primary, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  paymentMethods: { flexDirection: 'row', justifyContent: 'space-between' },
  paymentCard: { width: '30%', backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  activePayment: { borderColor: Colors.primary, backgroundColor: '#fff5f5' },
  paymentText: { marginTop: 5, fontSize: 12, fontWeight: '600', color: '#333' },

  summaryContainer: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginTop: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#888', fontSize: 14 },
  summaryValue: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalLabel: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  totalValue: { fontWeight: 'bold', fontSize: 18, color: Colors.primary },
});