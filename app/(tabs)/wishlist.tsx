import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

// Données factices (Produits favoris)
const FAVORITES = [
  {
    id: '1',
    name: 'Modern Sofa Chair',
    price: '$180.00',
    rating: 4.5,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Nike Pegasus 39',
    price: '$120.00',
    rating: 4.8,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Wooden Chair',
    price: '$65.00',
    rating: 4.0,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1503602642458-2321114458ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: 'Smart Watch',
    price: '$250.00',
    rating: 4.9,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

export default function WishlistScreen() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState(FAVORITES);

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push('/product-details' as any)}
    >
      <View style={styles.imageContainer}>
         <Image source={{ uri: item.image }} style={styles.image} />
         <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => removeFromWishlist(item.id)}
         >
            <Ionicons name="heart" size={18} color={Colors.primary} />
         </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingRow}>
             <Ionicons name="star" size={12} color="#FFD700" />
             <Text style={styles.rating}>{item.rating} (Review)</Text>
          </View>
          <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity style={styles.searchButton}>
           <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tags (Catégories rapides) */}
      <View style={styles.tagsContainer}>
         <TouchableOpacity style={[styles.tag, styles.activeTag]}>
            <Text style={styles.activeTagText}>All</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Clothes</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Shoes</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Furniture</Text>
         </TouchableOpacity>
      </View>

      {/* Grille */}
      <FlatList
        data={wishlist}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="heart-dislike-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Your wishlist is empty</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  searchButton: { padding: 5 },

  // Tags
  tagsContainer: { flexDirection: 'row', padding: 20 },
  tag: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 10,
    backgroundColor: 'white',
  },
  activeTag: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagText: { color: '#666', fontWeight: '600' },
  activeTagText: { color: 'white', fontWeight: '600' },

  // Liste
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    width: (width - 50) / 2,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: { width: '90%', height: '90%', resizeMode: 'contain' },
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  details: { paddingHorizontal: 5 },
  name: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  rating: { fontSize: 10, color: '#888', marginLeft: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#888', marginTop: 10 },
});