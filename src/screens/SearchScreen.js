import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import Button from '../components/Button';
import BottomNavigation from '../components/BottomNavigation';
import { getRecipes, subscribe } from '../data/recipes';

const SearchScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
    const unsubscribe = subscribe(loadRecipes);
    return unsubscribe;
  }, []);

  const loadRecipes = () => {
    setAllRecipes(getRecipes());
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const results = allRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients.some(ingredient =>
        ingredient.name.toLowerCase().includes(query.toLowerCase())
      ) ||
      recipe.categories.some(category =>
        category.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollContainer}
      >
        <SearchBar onSearch={handleSearch} />
        
        {hasSearched ? (
          <>
            <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
              <Text style={globalStyles.caption}>
                {searchResults.length} resep ditemukan untuk "{searchQuery}"
              </Text>
              <Button 
                title="Hapus"
                variant="secondary"
                onPress={handleClearSearch}
                style={{ paddingHorizontal: 16 }}
              />
            </View>

            {searchResults.length > 0 ? (
              <View style={isWebPlatform ? globalStyles.grid : {}}>
                {searchResults.map(recipe => (
                  <View key={recipe.id} style={isWebPlatform ? globalStyles.gridItem : { marginBottom: 12 }}>
                    <RecipeCard
                      recipe={recipe}
                      onPress={() => navigation.navigate('RecipeDetail', { recipe })}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={[globalStyles.center, { padding: 40 }]}>
                <Text style={[globalStyles.subtitle, { textAlign: 'center', marginBottom: 8 }]}>
                  Resep tidak ditemukan
                </Text>
                <Text style={[globalStyles.body, { textAlign: 'center', marginBottom: 24 }]}>
                  Tidak ada resep yang cocok dengan pencarian "{searchQuery}"
                </Text>
                <Button 
                  title="Cari Resep Lain"
                  onPress={handleClearSearch}
                />
              </View>
            )}
          </>
        ) : (
          <View style={[globalStyles.center, { padding: 40 }]}>
            <Text style={[globalStyles.subtitle, { textAlign: 'center', marginBottom: 8 }]}>
              Cari Resep Favorit
            </Text>
            <Text style={[globalStyles.body, { textAlign: 'center', marginBottom: 24 }]}>
              Ketik nama resep, bahan, atau kategori di kolom pencarian di atas
            </Text>
            <Button 
              title="Kembali ke Beranda"
              variant="secondary"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        )}

        {/* Footer */}
        <View style={globalStyles.footer}>
          <Text style={[globalStyles.footerText, { marginBottom: 8 }]}>
            🔍 Cari Resep Favorit
          </Text>
          <Text style={globalStyles.footerText}>
            Temukan resep berdasarkan nama, bahan, atau kategori
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentRoute="Search" />
    </View>
  );
};

export default SearchScreen;