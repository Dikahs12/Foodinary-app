import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import RecipeCard from '../components/RecipeCard';
import { getRecipes, subscribe } from '../data/recipes';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';


const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [categoryRecipes, setCategoryRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
    const unsubscribe = subscribe(loadRecipes);
    return unsubscribe;
  }, [category]);

  const loadRecipes = () => {
    const recipesData = getRecipes();
    setAllRecipes(recipesData);
    const filteredRecipes = recipesData.filter(recipe => 
      recipe.categories.includes(category)
    );
    setCategoryRecipes(filteredRecipes);
  };

  // Get related categories
  const getRelatedCategories = () => {
    const relatedCategories = new Set();
    categoryRecipes.forEach(recipe => {
      recipe.categories.forEach(cat => {
        if (cat !== category) {
          relatedCategories.add(cat);
        }
      });
    });
    return Array.from(relatedCategories).slice(0, 5);
  };

  const relatedCategories = getRelatedCategories();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollContainer}
      >
        <Text style={globalStyles.title}>{category}</Text>
        <Text style={[globalStyles.caption, { marginBottom: 24 }]}>
          {categoryRecipes.length} resep ditemukan dalam kategori ini
        </Text>
        
        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={[globalStyles.subtitle, { marginBottom: 12 }]}>Kategori Terkait</Text>
            <View style={globalStyles.categoryList}>
              {relatedCategories.map((cat) => (
                <Button
                  key={cat}
                  title={cat}
                  variant="secondary"
                  onPress={() => navigation.navigate('Category', { category: cat })}
                  style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                />
              ))}
            </View>
          </View>
        )}
        
        {/* Recipes Grid */}
        {categoryRecipes.length > 0 ? (
          <View style={isWebPlatform ? globalStyles.grid : {}}>
            {categoryRecipes.map(recipe => (
              <View key={recipe.id} style={isWebPlatform ? globalStyles.gridItem : { marginBottom: 12 }}>
                <RecipeCard
                  recipe={recipe}
                  onPress={() => navigation.navigate('RecipeDetail', { recipe })}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={[globalStyles.card, globalStyles.center, { padding: 40 }]}>
            <Text style={[globalStyles.body, { textAlign: 'center', marginBottom: 16 }]}>
              Belum ada resep dalam kategori {category}
            </Text>
            <Button 
              title="Tambah Resep"
              onPress={() => navigation.navigate('AddEditRecipe')}
            />
            <Button 
              title="Kembali ke Beranda"
              variant="secondary"
              onPress={() => navigation.navigate('Home')}
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {/* Category Stats */}
        {categoryRecipes.length > 0 && (
          <View style={[globalStyles.card, { backgroundColor: '#f0fdf4', borderLeftWidth: 4, borderLeftColor: '#22c55e' }]}>
            <Text style={[globalStyles.subtitle, { color: '#15803d', marginBottom: 8 }]}>
              📊 Statistik Kategori
            </Text>
            <View style={[globalStyles.row, { justifyContent: 'space-around' }]}>
              <View style={globalStyles.center}>
                <Text style={[globalStyles.body, { fontWeight: 'bold', color: '#15803d' }]}>
                  {categoryRecipes.length}
                </Text>
                <Text style={globalStyles.caption}>Total Resep</Text>
              </View>
              <View style={globalStyles.center}>
                <Text style={[globalStyles.body, { fontWeight: 'bold', color: '#15803d' }]}>
                  {Math.round(categoryRecipes.reduce((acc, recipe) => acc + recipe.calories, 0) / categoryRecipes.length) || 0}
                </Text>
                <Text style={globalStyles.caption}>Rata-rata Kalori</Text>
              </View>
              <View style={globalStyles.center}>
                <Text style={[globalStyles.body, { fontWeight: 'bold', color: '#15803d' }]}>
                  {Math.round(categoryRecipes.reduce((acc, recipe) => {
                    const time = parseInt(recipe.cookingTime);
                    return acc + (isNaN(time) ? 0 : time);
                  }, 0) / categoryRecipes.length) || 0}
                </Text>
                <Text style={globalStyles.caption}>Menit Rata-rata</Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={globalStyles.footer}>
          <Text style={[globalStyles.footerText, { marginBottom: 8 }]}>
            🍽️ Kategori {category}
          </Text>
          <Text style={globalStyles.footerText}>
            Jelajahi berbagai resep dalam kategori {category}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentRoute="Home" />
    </View>
  );
};

export default CategoryScreen;