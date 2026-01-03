import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

// --- DONNÉES FACTICES (MOCK DATA) ---
const CATEGORIES = [
  { id: '1', name: 'Clothes', icon: 'shirt-outline' },
  { id: '2', name: 'Electronics', icon: 'laptop-outline' },
  { id: '3', name: 'Shoes', icon: 'footsteps-outline' },
  { id: '4', name: 'Watch', icon: 'watch-outline' },
  { id: '5', name: 'Jewelry', icon: 'diamond-outline' },
  { id: '6', name: 'Kitchen', icon: 'restaurant-outline' },
  { id: '7', name: 'Toys', icon: 'game-controller-outline' },
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Modern Sofa Chair',
    price: '$180.00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Image chaise
  },
  {
    id: '2',
    name: 'Nike Pegasus 39',
    price: '$120.00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Image chaussure
  },
  {
    id: '3',
    name: 'Light Brown Coat',
    price: '$90.00',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Image manteau
  },
  {
    id: '4',
    name: 'Wooden Chair',
    price: '$65.00',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1503602642458-2321114458ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Image chaise bois
  },
];

const TABS = ['All', 'Newest', 'Popular', 'Clothes'];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('All');

  // Rendu d'un produit (Card)
  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity style={styles.favoriteButton}>
           <Ionicons name="heart-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.ratingContainer}>
         <Ionicons name="star" size={12} color="#FFD700" />
         <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* --- HEADER ROUGE --- */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <View>
             <Text style={styles.locationLabel}>Location</Text>
             <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color="white" />
                <Text style={styles.locationText}> Meknes, Morocco</Text>
                <Ionicons name="chevron-down" size={16} color="white" />
             </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
             <Ionicons name="notifications" size={20} color="white" />
             <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Barre de Recherche */}
        <View style={styles.searchContainer}>
           <Ionicons name="search" size={20} color={Colors.primary} style={styles.searchIcon} />
           <TextInput placeholder="Search" style={styles.searchInput} placeholderTextColor="#999"/>
           <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="white" />
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- BANNIÈRE PROMO --- */}
        <View style={styles.bannerContainer}>
           <View style={styles.bannerTextContainer}>
              <View style={styles.promoBadge}>
                  <Text style={styles.promoText}>Limited time!</Text>
              </View>
              <Text style={styles.bannerTitle}>Get Special Offer</Text>
              <Text style={styles.bannerSubtitle}>Up to <Text style={styles.bannerPercent}>40%</Text></Text>
           </View>
           {/* Image femme (placeholder) */}
           <Image 
              source={{ uri: 'https://img.freepik.com/free-photo/portrait-young-happy-woman-beret_171337-12467.jpg' }} 
              style={styles.bannerImage} 
              resizeMode="cover"
           />
        </View>

        {/* --- CATÉGORIES --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Category</Text>
           <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
           {CATEGORIES.map((cat) => (
             <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                <View style={styles.categoryIconContainer}>
                   <Ionicons name={cat.icon as any} size={24} color={Colors.black} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
             </TouchableOpacity>
           ))}
        </ScrollView>

        {/* --- FLASH SALE TABS --- */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
           <Text style={styles.sectionTitle}>Flash Sale</Text>
           <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Closing in : <Text style={{fontWeight:'bold', color: Colors.primary}}>02 : 12 : 56</Text></Text>
           </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsList}>
            {TABS.map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                  onPress={() => setActiveTab(tab)}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* --- GRILLE PRODUITS --- */}
        <FlatList
          data={PRODUCTS}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false} // On laisse le ScrollView principal gérer le scroll
          style={{ marginTop: 10 }}
        />

        {/* Espace vide en bas pour ne pas être caché par la TabBar */}
        <View style={{ height: 20 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  
  // Header Rouge
  headerBackground: {
    backgroundColor: Colors.primary,
    paddingTop: 50, // Pour la barre d'état
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginHorizontal: 5 },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700', // Point jaune
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  // Barre de recherche
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: '100%', color: '#333' },
  filterButton: { padding: 5 },

  scrollContent: { padding: 20 },

  // Bannière
  bannerContainer: {
    backgroundColor: '#333', // Fond gris foncé/noir comme sur l'image
    borderRadius: 20,
    flexDirection: 'row',
    height: 150,
    overflow: 'hidden',
    marginBottom: 25,
    padding: 20,
    alignItems: 'center',
  },
  bannerTextContainer: { flex: 1, zIndex: 2 },
  promoBadge: { backgroundColor: Colors.primary, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 10 },
  promoText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  bannerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bannerSubtitle: { color: 'white', fontSize: 14 },
  bannerPercent: { fontSize: 24, fontWeight: 'bold' },
  bannerImage: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 140,
    height: 180,
    resizeMode: 'cover',
  },

  // Catégories
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAllText: { color: Colors.primary, fontWeight: '600' },
  categoriesList: { flexDirection: 'row' },
  categoryItem: { alignItems: 'center', marginRight: 20 },
  categoryIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#F3F4F6', // Gris très clair
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: { fontSize: 12, color: '#666' },

  // Tabs Flash Sale
  timerContainer: { flexDirection: 'row', alignItems: 'center' },
  timerText: { fontSize: 12, color: '#666' },
  tabsList: { flexDirection: 'row', marginBottom: 20 },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 10,
    backgroundColor: 'white',
  },
  activeTabItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: { color: '#666', fontWeight: '600' },
  activeTabText: { color: 'white' },

  // Grid Produits
  productCard: {
    width: (width - 50) / 2, // 2 colonnes avec espace
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImage: { width: '90%', height: '90%', resizeMode: 'contain' },
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 15,
    elevation: 2,
  },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ratingText: { fontSize: 10, color: '#666', marginLeft: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
});