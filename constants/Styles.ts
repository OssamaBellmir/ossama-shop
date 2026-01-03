// constants/Styles.ts
import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const globalStyles = StyleSheet.create({
  // Style du bouton rouge principal (arrondi)
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30, // Très arrondi comme sur le design
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // Ombre Android
    width: '100%',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    // Si vous installez une police plus tard, on l'ajoutera ici
  },
  // Style du bouton "retour" rond (flèche gauche)
  backButtonCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  // Titres
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textGray,
    lineHeight: 22,
  },
});