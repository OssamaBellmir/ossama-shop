import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

// Tailles factices pour l'exemple
const SIZES = ['S', 'M', 'L', 'XL'];
// Images miniatures
const THUMBNAILS = [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1503602642458-2321114458ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
];

export default function ProductDetailsScreen() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImage, setActiveImage] = useState(THUMBNAILS[0]);

  return (
    <View style={styles.container}>
      {/* HEADER Flottant (Retour + Favoris) */}
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
        
        {/* GRANDE IMAGE & IMAGES */}
        <View style={styles.imageSection}>
            <Image source={{ uri: activeImage }} style={styles.mainImage} />
            
            {/* Miniatures */}
            <View style={styles.thumbnailRow}>
                {THUMBNAILS.map((img, index) => (
                    <TouchableOpacity 
                        key={index} 
                        onPress={() => setActiveImage(img)}
                        style={[styles.thumbnailContainer, activeImage === img && styles.activeThumbnail]}
                    >
                        <Image source={{ uri: img }} style={styles.thumbnail} />
                    </TouchableOpacity>
                ))}
                {/* Petit badge "+10" comme sur le design */}
                <View style={styles.moreImagesBadge}>
                    <Text style={styles.moreImagesText}>+10</Text>
                </View>
            </View>
        </View>

        {/* DETAILS DU PRODUIT */}
        <View style={styles.detailsContainer}>
            <View style={styles.titleRow}>
                <View>
                    <Text style={styles.category}>Clothes</Text>
                    <Text style={styles.productName}>Light Brown Coat</Text>
                </View>
                <View style={styles.ratingBox}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>4.5</Text>
                </View>
            </View>

            {/* Vendeur */}
            <View style={styles.sellerRow}>
                <Image 
                    source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
                    style={styles.sellerAvatar} 
                />
                <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.sellerName}>Jenny Doe</Text>
                    <Text style={styles.sellerRole}>Manager</Text>
                </View>
                <View style={styles.sellerActions}>
                    <TouchableOpacity style={styles.actionIcon}><Ionicons name="chatbubble-ellipses-outline" size={20} color="#666"/></TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}><Ionicons name="call-outline" size={20} color="#666"/></TouchableOpacity>
                </View>
            </View>

            {/* Description */}
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                <Text style={styles.readMore}> Read more</Text>
            </Text>

            {/* Sélection de Taille */}
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

            {/* Sélection Couleur (Texte simple pour l'instant) */}
             <Text style={styles.sectionTitle}>Select Color : <Text style={{fontWeight:'normal', color:'#666'}}>Brown</Text></Text>

        </View>
      </ScrollView>

      {/* FOOTER (Prix + Bouton Ajouter) */}
      <View style={styles.footer}>
         <View>
             <Text style={styles.priceLabel}>Total Price</Text>
             <Text style={styles.priceValue}>$120.00</Text>
         </View>
         <TouchableOpacity style={styles.addToCartButton}>
             <Ionicons name="bag-handle-outline" size={20} color="white" style={{marginRight: 10}}/>
             <Text style={styles.addToCartText}>Add to Cart</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { paddingBottom: 100 },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa', // Fond gris clair pour le haut
  },
  iconButton: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 2
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  // Images
  imageSection: {
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  mainImage: { width: 250, height: 300, resizeMode: 'contain', marginBottom: 20 },
  thumbnailRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnailContainer: {
    padding: 3,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  activeThumbnail: { borderColor: Colors.primary },
  thumbnail: { width: 50, height: 50, borderRadius: 8 },
  moreImagesBadge: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    marginLeft: 5
  },
  moreImagesText: { color: Colors.primary, fontWeight: 'bold' },

  // Détails
  detailsContainer: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  category: { color: '#888', fontSize: 14 },
  productName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontWeight: 'bold', marginLeft: 5 },

  // Vendeur
  sellerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sellerAvatar: { width: 45, height: 45, borderRadius: 22.5 },
  sellerName: { fontWeight: 'bold', fontSize: 16 },
  sellerRole: { color: '#888', fontSize: 12 },
  sellerActions: { flexDirection: 'row', gap: 10 },
  actionIcon: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 1, borderColor: '#eee', justifyContent: 'center', alignItems: 'center' },

  // Textes
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  description: { color: '#666', lineHeight: 20, fontSize: 14 },
  readMore: { color: Colors.primary, fontWeight: 'bold' },

  // Tailles
  sizeRow: { flexDirection: 'row', marginBottom: 10 },
  sizeButton: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#eee', justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  activeSizeButton: { backgroundColor: 'black', borderColor: 'black' },
  sizeText: { color: '#666', fontWeight: 'bold' },
  activeSizeText: { color: 'white' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  priceLabel: { color: '#888', fontSize: 12 },
  priceValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  addToCartButton: {
    backgroundColor: Colors.primary, // Rouge
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  addToCartText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});