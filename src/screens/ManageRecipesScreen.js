import { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import RecipeCard from '../components/RecipeCard';
import { deleteRecipe, getRecipes, initializeRecipes, subscribe } from '../data/recipes';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';

const ManageRecipesScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load data dengan useCallback
  const loadRecipesData = useCallback(() => {
    console.log('Loading manage recipes data...');
    const allRecipes = getRecipes();
    setRecipes(allRecipes);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Initializing manage recipes...');
      await initializeRecipes();
      loadRecipesData();
      setLoading(false);
    };

    loadInitialData();
    
    // Subscribe to changes
    const unsubscribe = subscribe(loadRecipesData);
    
    return () => {
      console.log('Cleaning up manage recipes...');
      unsubscribe();
    };
  }, [loadRecipesData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeRecipes();
    loadRecipesData();
    setRefreshing(false);
  }, [loadRecipesData]);

  const handleDelete = (recipe) => {
    Alert.alert(
      'Hapus Resep',
      `Yakin ingin menghapus "${recipe.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
              Alert.alert('Sukses!', 'Resep berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus resep');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.center, { flex: 1 }]}>
        <Text style={globalStyles.body}>Memuat resep...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={[globalStyles.spaceBetween, { marginBottom: 24 }]}>
          <View>
            <Text style={globalStyles.title}>Kelola Resep Saya</Text>
            <Text style={globalStyles.caption}>
              {recipes.length} resep tersimpan
            </Text>
          </View>
          <Button 
            title="+ Tambah"
            onPress={() => navigation.navigate('AddEditRecipe')}
            style={{ paddingHorizontal: 16 }}
          />
        </View>

        {recipes.length === 0 ? (
          <View style={[globalStyles.center, { padding: 40 }]}>
            <Text style={[globalStyles.body, { textAlign: 'center', marginBottom: 24 }]}>
              Belum ada resep. Tambahkan resep pertama Anda!
            </Text>
            <Button 
              title="Tambah Resep Pertama"
              onPress={() => navigation.navigate('AddEditRecipe')}
            />
          </View>
        ) : (
          <View style={isWebPlatform ? globalStyles.grid : {}}>
            {recipes.map(recipe => (
              <View key={recipe.id} style={isWebPlatform ? globalStyles.gridItem : { marginBottom: 16 }}>
                <View style={globalStyles.card}>
                  <RecipeCard
                    recipe={recipe}
                    onPress={() => navigation.navigate('RecipeDetail', { recipe: recipe })}
                  />
                  <View style={[globalStyles.row, { gap: 8, marginTop: 12 }]}>
                    <Button 
                      title="Edit"
                      variant="secondary"
                      onPress={() => navigation.navigate('AddEditRecipe', { recipe: recipe })}
                      style={{ flex: 1 }}
                    />
                    <Button 
                      title="Hapus"
                      variant="danger"
                      onPress={() => handleDelete(recipe)}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Stats */}
        {recipes.length > 0 && (
          <View style={[globalStyles.card, { backgroundColor: '#f0f9ff', borderLeftWidth: 4, borderLeftColor: '#0ea5e9', marginTop: 16 }]}>
            <Text style={[globalStyles.subtitle, { color: '#0369a1', marginBottom: 12 }]}>
              📊 Statistik Anda
            </Text>
            <View style={[globalStyles.row, { justifyContent: 'space-around' }]}>
              <View style={globalStyles.center}>
                <Text style={[globalStyles.body, { fontWeight: 'bold', color: '#0369a1', fontSize: 18 }]}>
                  {recipes.length}
                </Text>
                <Text style={[globalStyles.caption, { textAlign: 'center' }]}>Total Resep</Text>
              </View>
              <View style={globalStyles.center}>
                <Text style={[globalStyles.body, { fontWeight: 'bold', color: '#0369a1', fontSize: 18 }]}>
                  {new Set(recipes.flatMap(recipe => recipe.categories)).size}
                </Text>
                <Text style={[globalStyles.caption, { textAlign: 'center' }]}>Kategori</Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={[globalStyles.footer, { marginTop: 24 }]}>
          <Text style={globalStyles.footerText}>
            Kelola resep favorit Anda dengan mudah
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentRoute="ManageRecipes" />
    </View>
  );
};

export default ManageRecipesScreen;