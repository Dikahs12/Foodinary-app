import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: isWeb ? 24 : 16,
    maxWidth: isWeb ? 800 : '100%',
    alignSelf: isWeb ? 'center' : 'stretch',
    width: isWeb ? '100%' : 'auto',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: isWeb ? 24 : 16,
    paddingBottom: isWeb ? 100 : 80, // Space for bottom nav
  },
  
  // Typography - Responsive
  title: {
    fontSize: isWeb ? 32 : 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isWeb ? 22 : 20,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  body: {
    fontSize: isWeb ? 17 : 16,
    color: '#475569',
    lineHeight: 24,
  },
  caption: {
    fontSize: isWeb ? 15 : 14,
    color: '#64748b',
  },
  
  // Cards
  // Tambahkan di globalStyles.js jika ingin lebih banyak variasi
  welcomeCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  statsCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: isWeb ? 20 : 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'transform 0.2s',
    }),
  },
  cardHover: {
    transform: [{ scale: 1.02 }],
  },
  
  // Buttons
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: isWeb ? 14 : 12,
    paddingHorizontal: isWeb ? 28 : 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
  },
  buttonHover: {
    backgroundColor: '#dc2626',
    transform: [{ translateY: -1 }],
  },
  buttonText: {
    color: 'white',
    fontSize: isWeb ? 17 : 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0',
  },
  buttonSecondaryText: {
    color: '#475569',
  },
  
  // Inputs
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: isWeb ? 16 : 12,
    fontSize: isWeb ? 17 : 16,
    color: '#1e293b',
    ...(isWeb && {
      outlineStyle: 'none',
    }),
  },
  inputFocus: {
    borderColor: '#ef4444',
  },
  
  // Layout Utilities
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Grid for web
  grid: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: isWeb ? 'wrap' : 'nowrap',
    gap: 16,
  },
  gridItem: {
    flex: isWeb ? '1 1 300px' : 1,
    minWidth: isWeb ? 300 : 'auto',
  },
  
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: isWeb ? 12 : Platform.select({ ios: 32, android: 12 }),
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: isWeb ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  navItemActive: {
    backgroundColor: '#fef2f2',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#64748b',
  },
  navTextActive: {
    color: '#ef4444',
    fontWeight: '600',
  },
  
  // Footer
  footer: {
    backgroundColor: '#1e293b',
    padding: isWeb ? 40 : 24,
    marginTop: 40,
    borderRadius: 16,
  },
  footerText: {
    color: '#cbd5e1',
    textAlign: 'center',
    fontSize: isWeb ? 16 : 14,
  },
  
  // Category List
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  categoryChipActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  categoryChipText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: 'white',
  },
});

// Platform-specific helpers
export const isWebPlatform = isWeb;
export const isMobilePlatform = isMobile;