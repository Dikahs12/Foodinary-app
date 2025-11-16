import { useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Platform } from 'react-native'; // Pastikan ada di file lain

const BottomNavigation = ({ navigation, currentRoute }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const navItems = [
    { key: 'Home', label: 'Beranda', icon: '🏠' },
    { key: 'Search', label: 'Cari', icon: '🔍' },
    { key: 'ManageRecipes', label: 'Resep Saya', icon: '📝' },
  ];

  const handleNavigation = (route) => {
    // Smooth animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      navigation.navigate(route);
    }, 50);
  };

  return (
    <View style={globalStyles.bottomNav}>
      <View style={globalStyles.bottomNavContent}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              globalStyles.navItem,
              currentRoute === item.key && globalStyles.navItemActive
            ]}
            onPress={() => handleNavigation(item.key)}
            activeOpacity={0.7}
          >
            <Animated.Text 
              style={{ 
                fontSize: 20,
                transform: [{ scale: scaleAnim }]
              }}
            >
              {item.icon}
            </Animated.Text>
            <Text style={[
              globalStyles.navText,
              currentRoute === item.key && globalStyles.navTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomNavigation;