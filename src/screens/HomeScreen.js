import { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import RecipeCard from '../components/RecipeCard';
import { CATEGORIES, getFeaturedRecipes, getRecipes, initializeRecipes, subscribe } from '../data/recipes';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load data dengan useCallback untuk prevent unnecessary re-renders
  const loadData = useCallback(() => {
    console.log('Loading home data...');
    const allRecipes = getRecipes();
    
    // Featured recipes (newest recipes)
    setFeaturedRecipes(getFeaturedRecipes());

    // Categories with count
    const categoryCount = {};
    allRecipes.forEach(recipe => {
      recipe.categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });
    
    // Only show categories that have recipes
    const availableCategories = CATEGORIES.filter(cat => categoryCount[cat] > 0)
      .map(cat => ({
        name: cat,
        count: categoryCount[cat]
      }));
    
    setCategories(availableCategories);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Initializing home data...');
      await initializeRecipes();
      loadData();
      setLoading(false);
    };

    loadInitialData();
    
    // Subscribe to changes
    const unsubscribe = subscribe(loadData);
    
    return () => {
      console.log('Cleaning up home screen...');
      unsubscribe();
    };
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeRecipes();
    loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const filteredRecipes = selectedCategory 
    ? featuredRecipes.filter(recipe => recipe.categories.includes(selectedCategory))
    : featuredRecipes;

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.center, { flex: 1 }]}>
        <Text style={globalStyles.body}>Memuat resep...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER TERINTEGRASI - Background merah sama dengan tombol */}
      <View style={{
        backgroundColor: '#ef4444',
        paddingHorizontal: isWebPlatform ? 24 : 16,
        paddingTop: isWebPlatform ? 24 : Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}>
        <View style={[
          globalStyles.spaceBetween, 
          { 
            alignItems: 'flex-start',
          }
        ]}>
          {/* Logo dan Judul */}
          <View style={[globalStyles.row, { alignItems: 'center', flex: 1 }]}>
            <Text style={{ 
              fontSize: isWebPlatform ? 40 : 36, 
              marginRight: 12,
              color: 'white'
            }}>🍳</Text>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: isWebPlatform ? 32 : 28,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 4
              }}>
                FOODINARY
              </Text>
              <Text style={{
                fontSize: isWebPlatform ? 16 : 14,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Kreator Resep Personal
              </Text>
            </View>
          </View>

          {/* Tombol Cari dengan Icon 🔍 */}
          <TouchableOpacity 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              paddingHorizontal: isWebPlatform ? 16 : 14,
              paddingVertical: isWebPlatform ? 16 : 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              width: isWebPlatform ? 60 : 50,
              height: isWebPlatform ? 60 : 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleSearchPress}
          >
            <Text style={{
              color: 'white',
              fontSize: isWebPlatform ? 24 : 20,
              fontWeight: '600'
            }}>
              🔍
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          globalStyles.scrollContainer,
          { 
            paddingTop: isWebPlatform ? 24 : 20,
            paddingBottom: isWebPlatform ? 100 : 80
          }
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* WELCOME SECTION - DESIGN MODERN & MINIMALIST */}
        <View style={{ 
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#f1f5f9',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background Accent */}
          <View style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            backgroundColor: '#fef2f2',
            borderBottomLeftRadius: 80,
            opacity: 0.8,
          }} />
          
          <View style={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            backgroundColor: '#f0f9ff',
            borderRadius: 40,
            opacity: 0.6,
          }} />

          {/* Content */}
          <View style={{ position: 'relative', zIndex: 1 }}>
            <View style={[globalStyles.row, { alignItems: 'center', marginBottom: 16 }]}>
              <View style={{
                width: 48,
                height: 48,
                backgroundColor: '#ef4444',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <Text style={{ fontSize: 24, color: 'white' }}>👨‍🍳</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: isWebPlatform ? 28 : 24,
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: 4,
                }}>
                  Hai, Chef!
                </Text>
                <Text style={{
                  fontSize: isWebPlatform ? 16 : 14,
                  color: '#64748b',
                  fontWeight: '500',
                }}>
                  Siap berkreasi hari ini?
                </Text>
              </View>
            </View>

            <Text style={{
              fontSize: isWebPlatform ? 18 : 16,
              color: '#475569',
              lineHeight: 24,
              marginBottom: 20,
              fontWeight: '400',
            }}>
              Mulai petualangan kuliner Anda. <Text style={{ fontWeight: '600', color: '#ef4444' }}>Racik, simpan, dan bagikan</Text> resep kreasi sendiri dengan mudah.
            </Text>

            <View style={[globalStyles.row, { gap: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                }}>
                  Total Resep
                </Text>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1e293b',
                }}>
                  {getRecipes().length}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#e2e8f0', height: 30 }} />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                }}>
                  Kategori
                </Text>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1e293b',
                }}>
                  {categories.length}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#e2e8f0', height: 30 }} />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                }}>
                  Terbaru
                </Text>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1e293b',
                }}>
                  {featuredRecipes.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[globalStyles.row, { gap: 12, marginBottom: 24 }]}>
          <Button 
            title="📝 Buat Resep Baru"
            variant="secondary"
            onPress={() => navigation.navigate('AddEditRecipe')}
            style={{ flex: 1 }}
          />
          <Button 
            title="⭐ Resep Favorit"
            variant="secondary"
            onPress={() => navigation.navigate('Search', { filter: 'favorite' })}
            style={{ flex: 1 }}
          />
        </View>

        {/* Categories Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={globalStyles.subtitle}>Kategori Kreasi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '500' }}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Category Cards */}
          {categories.length > 0 ? (
            <FlatList
              data={categories.slice(0, 8)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item.name}
                  count={item.count}
                  onPress={() => navigation.navigate('Category', { category: item.name })}
                />
              )}
              contentContainerStyle={{ paddingRight: 16 }}
              style={{ marginBottom: 8 }}
            />
          ) : (
            <View style={[globalStyles.center, { padding: 20 }]}>
              <Text style={[globalStyles.body, { color: '#64748b', textAlign: 'center' }]}>
                Belum ada kategori tersedia
              </Text>
            </View>
          )}
        </View>

        {/* Featured Recipes Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={globalStyles.subtitle}>
              {selectedCategory ? `Kreasi ${selectedCategory}` : 'Kreasi Terbaru ✨'}
            </Text>
            <View style={globalStyles.row}>
              {selectedCategory && (
                <TouchableOpacity 
                  onPress={() => setSelectedCategory(null)}
                  style={{ marginRight: 16 }}
                >
                  <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '500' }}>
                    Hapus Filter
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '500' }}>
                  Jelajahi
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {filteredRecipes.length > 0 ? (
            <View style={isWebPlatform ? globalStyles.grid : {}}>
              {filteredRecipes.slice(0, isWebPlatform ? 6 : 4).map(recipe => (
                <View key={recipe.id} style={isWebPlatform ? globalStyles.gridItem : { marginBottom: 16 }}>
                  <RecipeCard
                    recipe={recipe}
                    onPress={() => navigation.navigate('RecipeDetail', { recipe })}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={[
              globalStyles.card, 
              globalStyles.center, 
              { 
                padding: 40,
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderStyle: 'dashed',
              }
            ]}>
              <Text style={[
                globalStyles.body, 
                { 
                  textAlign: 'center', 
                  marginBottom: 16,
                  color: '#64748b'
                }
              ]}>
                {selectedCategory 
                  ? `Belum ada kreasi dalam kategori "${selectedCategory}"`
                  : 'Belum ada kreasi terbaru. Mulai buat resep pertama Anda!'
                }
              </Text>
              <Button 
                title="🎨 Buat Resep Pertama"
                onPress={() => navigation.navigate('AddEditRecipe')}
              />
            </View>
          )}
        </View>

        {/* Inspiration Section */}
        <View style={[
          globalStyles.card, 
          { 
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#e2e8f0',
          }
        ]}>
          <Text style={[
            globalStyles.subtitle, 
            { 
              color: '#475569', 
              marginBottom: 12,
              textAlign: 'center'
            }
          ]}>
            💡 Tips Kreasi Resep
          </Text>
          <View style={[globalStyles.row, { flexWrap: 'wrap', gap: 12 }]}>
            <View style={{ flex: 1, minWidth: 120 }}>
              <Text style={[globalStyles.body, { fontWeight: '600', color: '#ef4444', marginBottom: 4 }]}>
                Foto Menarik
              </Text>
              <Text style={[globalStyles.caption, { color: '#64748b' }]}>
                Gunakan foto berkualitas untuk resep Anda
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 120 }}>
              <Text style={[globalStyles.body, { fontWeight: '600', color: '#ef4444', marginBottom: 4 }]}>
                Langkah Detail
              </Text>
              <Text style={[globalStyles.caption, { color: '#64748b' }]}>
                Tulis langkah memasak dengan jelas
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 120 }}>
              <Text style={[globalStyles.body, { fontWeight: '600', color: '#ef4444', marginBottom: 4 }]}>
                Bahan Akurat
              </Text>
              <Text style={[globalStyles.caption, { color: '#64748b' }]}>
                Cantumkan takaran bahan dengan tepat
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={[
          { 
            marginTop: 32,
            padding: 16,
            backgroundColor: 'transparent',
          }
        ]}>
          <Text style={[
            globalStyles.footerText, 
            { 
              color: '#64748b',
              marginBottom: 8,
              textAlign: 'center'
            }
          ]}>
            🍳 {getRecipes().length} Kreasi Resep • {categories.length} Kategori
          </Text>
          <Text style={[
            globalStyles.footerText, 
            { 
              color: '#94a3b8',
              fontSize: isWebPlatform ? 14 : 12,
              textAlign: 'center'
            }
          ]}>
            FOODINARY - Platform kreasi resep personal Anda
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentRoute="Home" />
    </View>
  );
};

export default HomeScreen;