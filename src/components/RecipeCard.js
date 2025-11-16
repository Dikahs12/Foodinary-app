import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';

const RecipeCard = ({ recipe, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity 
      style={[
        globalStyles.card,
        isHovered && globalStyles.cardHover
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      onMouseEnter={() => isWebPlatform && setIsHovered(true)}
      onMouseLeave={() => isWebPlatform && setIsHovered(false)}
    >
      <Image 
        source={{ uri: recipe.image }}
        style={{
          width: '100%',
          height: isWebPlatform ? 180 : 160,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <Text style={{
        fontSize: isWebPlatform ? 20 : 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
      }}>
        {recipe.title}
      </Text>
      <View style={[globalStyles.row, { gap: 16 }]}>
        <Text style={globalStyles.caption}>
          ⏱ {recipe.cookingTime}
        </Text>
        <Text style={globalStyles.caption}>
          👨‍👩‍👧‍👦 {recipe.servings} porsi
        </Text>
        <Text style={globalStyles.caption}>
          🔥 {recipe.calories} kal
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;