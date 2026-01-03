import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore'; // Import Firestore
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../constants/Colors';
import { auth, db } from '../firebase/firebaseConfig'; // Import Auth & DB

const { width } = Dimensions.get('window');

const SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Parsing du produit
  let product: any = {};
  try {
    if (params.item) {
      product = JSON.parse(params.item as string);
    }
  } catch (e) {
    console.error("Erreur parsing", e);
  }

  const [selectedSize, setSelectedSize] = useState('M');

  if (!product || !product.name) {
      return (
          <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
              <Text>Product not found</Text>
              <TouchableOpacity onPress={() => router.back()}><Text style={{color: Colors.primary, marginTop: 10}}>Go Back</Text></TouchableOpacity>
          </View>
      )
  }

  // Fonction d'ajout au panier (Firestore)
  const handleAddToCart = async () => {
    // Vérifier si connecté
    if (!auth.currentUser) {
        Alert.alert("Erreur", "Vous devez être connecté pour ajouter au panier.");
        return;
    }

    setLoading(true);
    try {
        // Ajout dans la collection: users / ID_USER / cart
        const cartRef = collection(db, `users/${auth.currentUser.uid}/cart`);
        
        await addDoc(cartRef, {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category || 'Item',
            size: selectedSize,
            quantity: 1, // Par défaut 1
            createdAt: new Date().toISOString()
        });

        Alert.alert("Succès", "Produit ajouté au panier !", [
            { text: "Continuer mes achats", style: "cancel" },
            { text: "Voir le panier", onPress: () => router.push('/(tabs)/cart' as any) }
        ]);

    } catch (error: any) {
        Alert.alert("Erreur", error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.iconButton}>
           <Ionicons name="heart-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageSection}>
            <Image 
                source={{ uri: product.image || 'https://via.placeholder.com/300' }} 
                style={styles.mainImage} 
            />
        </View>

        <View style={styles.detailsContainer}>
            <View style={styles.titleRow}>
                <View style={{flex: 1}}>
                    <Text style={styles.category}>{product.category || 'Item'}</Text>
                    <Text style={styles.productName}>{product.name}</Text>
                </View>
                <View style={styles.ratingBox}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating || '4.5'}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
                {product.description || "No description available. Lorem ipsum dolor sit amet."}
            </Text>

            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizeRow}>
                {SIZES.map((size) => (
                    <TouchableOpacity 
                        key={size} 
                        style={[styles.sizeButton, selectedSize === size && styles.activeSizeButton]}
                        onPress={() => setSelectedSize(size)}
                    >
                        <Text style={[styles.sizeText, selectedSize === size && styles.activeSizeText]}>{size}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
         <View>
             <Text style={styles.priceLabel}>Total Price</Text>
             <Text style={styles.priceValue}>${product.price}</Text>
         </View>
         <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} disabled={loading}>
             {loading ? (
                 <ActivityIndicator color="white" />
             ) : (
                 <>
                    <Ionicons name="bag-handle-outline" size={20} color="white" style={{marginRight: 10}}/>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                 </>
             )}
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { paddingBottom: 100 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#f8f9fa', 
  },
  iconButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', 
    justifyContent: 'center', alignItems: 'center', elevation: 2
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  imageSection: {
    backgroundColor: '#f8f9fa', alignItems: 'center', paddingBottom: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30, height: 350, justifyContent: 'center'
  },
  mainImage: { width: '80%', height: '80%', resizeMode: 'contain' },
  detailsContainer: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  category: { color: '#888', fontSize: 14 },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 5, borderRadius: 10 },
  ratingText: { fontWeight: 'bold', marginLeft: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  description: { color: '#666', lineHeight: 22, fontSize: 14 },
  sizeRow: { flexDirection: 'row', marginBottom: 10 },
  sizeButton: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#eee', 
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  activeSizeButton: { backgroundColor: 'black', borderColor: 'black' },
  sizeText: { color: '#666', fontWeight: 'bold' },
  activeSizeText: { color: 'white' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white',
    borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 30,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1, shadowRadius: 10,
  },
  priceLabel: { color: '#888', fontSize: 12 },
  priceValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  addToCartButton: {
    backgroundColor: Colors.primary, flexDirection: 'row', paddingVertical: 15,
    paddingHorizontal: 30, borderRadius: 30, alignItems: 'center',
  },
  addToCartText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});