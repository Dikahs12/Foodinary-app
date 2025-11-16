import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';

const CategoryCard = ({ category, count, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity 
      style={[
        globalStyles.card, 
        { 
          marginRight: 12, 
          minWidth: isWebPlatform ? 140 : 120,
          backgroundColor: '#fef2f2',
          borderLeftWidth: 4,
          borderLeftColor: '#ef4444',
        },
        isHovered && globalStyles.cardHover
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      onMouseEnter={() => isWebPlatform && setIsHovered(true)}
      onMouseLeave={() => isWebPlatform && setIsHovered(false)}
    >
      <Text style={{
        fontSize: isWebPlatform ? 17 : 16,
        fontWeight: '600',
        color: '#dc2626',
        marginBottom: 4,
      }}>
        {category}
      </Text>
      <Text style={{
        fontSize: isWebPlatform ? 15 : 14,
        color: '#ef4444',
      }}>
        {count} resep
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;