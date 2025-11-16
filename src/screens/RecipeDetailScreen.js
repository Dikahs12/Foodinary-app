import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [servings, setServings] = useState(recipe.servings);

  const adjustServings = (adjustment) => {
    const newServings = servings + adjustment;
    if (newServings >= 1) {
      setServings(newServings);
    }
  };

  const calculateAdjustedAmount = (amount) => {
    if (!amount) return '';
    const multiplier = servings / recipe.servings;
    const adjusted = parseFloat(amount) * multiplier;
    return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollContainer}
      >
        <Image 
          source={{ uri: recipe.image }}
          style={{
            width: '100%',
            height: isWebPlatform ? 320 : 280,
            borderRadius: 16,
            marginBottom: 20,
          }}
        />
        
        <Text style={globalStyles.title}>{recipe.title}</Text>
        
        {/* Categories */}
        <View style={[globalStyles.row, { flexWrap: 'wrap', gap: 8, marginBottom: 16 }]}>
          {recipe.categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={globalStyles.categoryChip}
              onPress={() => navigation.navigate('Category', { category })}
            >
              <Text style={globalStyles.categoryChipText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Recipe Info */}
        <View style={[globalStyles.card, globalStyles.spaceBetween, { marginBottom: 24 }]}>
          <View style={globalStyles.center}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>⏱</Text>
            <Text style={globalStyles.caption}>{recipe.cookingTime}</Text>
          </View>
          
          <View style={globalStyles.center}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>👨‍👩‍👧‍👦</Text>
            <View style={[globalStyles.row, { gap: 16 }]}>
              <TouchableOpacity 
                onPress={() => adjustServings(-1)}
                style={{
                  backgroundColor: '#fef2f2',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, color: '#ef4444', fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              <Text style={[globalStyles.caption, { fontSize: 16, fontWeight: '600' }]}>{servings} porsi</Text>
              <TouchableOpacity 
                onPress={() => adjustServings(1)}
                style={{
                  backgroundColor: '#fef2f2',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, color: '#ef4444', fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={globalStyles.center}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>🔥</Text>
            <Text style={globalStyles.caption}>{recipe.calories} kal</Text>
          </View>
        </View>

        {/* Ingredients */}
        <Text style={globalStyles.subtitle}>Bahan-bahan</Text>
        <View style={[globalStyles.card, { marginBottom: 24 }]}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={[globalStyles.row, { marginBottom: 12, alignItems: 'flex-start' }]}>
              <Text style={{ color: '#ef4444', marginRight: 12, fontSize: 16 }}>•</Text>
              <Text style={[globalStyles.body, { flex: 1 }]}>
                <Text style={{ fontWeight: '600' }}>
                  {calculateAdjustedAmount(ingredient.amount)} {ingredient.unit}
                </Text> {ingredient.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <Text style={globalStyles.subtitle}>Cara Membuat</Text>
        <View style={globalStyles.card}>
          {recipe.instructions.map((step, index) => (
            <View key={index} style={[globalStyles.row, { marginBottom: 20, alignItems: 'flex-start' }]}>
              <View style={{
                backgroundColor: '#ef4444',
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                marginTop: 2,
              }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[globalStyles.body, { flex: 1, lineHeight: 24 }]}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={[globalStyles.card, { backgroundColor: '#fffbeb', borderLeftWidth: 4, borderLeftColor: '#f59e0b' }]}>
          <Text style={[globalStyles.subtitle, { color: '#92400e', marginBottom: 8 }]}>
            💡 Tips Memasak
          </Text>
          <Text style={[globalStyles.body, { color: '#475569' }]}>
            • Baca seluruh resep sebelum memulai{'\n'}
            • Siapkan semua bahan terlebih dahulu{'\n'}
            • Ikuti langkah-langkah secara berurutan{'\n'}
            • Sesuaikan bumbu sesuai selera
          </Text>
        </View>

        {/* Footer */}
        <View style={globalStyles.footer}>
          <Text style={[globalStyles.footerText, { marginBottom: 8 }]}>
            🍳 Selamat Memasak!
          </Text>
          <Text style={globalStyles.footerText}>
            Nikmati hasil masakan Anda dan bagikan pengalaman memasak
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentRoute="Home" />
    </View>
  );
};

export default RecipeDetailScreen;