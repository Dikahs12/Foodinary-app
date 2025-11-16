import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';

const SearchBar = ({ onSearch, placeholder = "Cari resep...", showSearchButton = true }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = () => {
    handleSearch();
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={[globalStyles.row, { gap: 8 }]}>
        <TextInput
          style={[
            globalStyles.input, 
            { 
              flex: 1,
              fontSize: isWebPlatform ? 16 : 14,
              height: isWebPlatform ? 50 : 45,
              backgroundColor: 'white'
            },
            isFocused && globalStyles.inputFocus
          ]}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        {showSearchButton && (
          <TouchableOpacity 
            style={[
              globalStyles.button,
              { 
                paddingHorizontal: isWebPlatform ? 20 : 16,
                height: isWebPlatform ? 50 : 45,
                opacity: query.trim() ? 1 : 0.7
              }
            ]}
            onPress={handleSearch}
            disabled={!query.trim()}
          >
            <Text style={globalStyles.buttonText}>
              {query.trim() ? 'Cari' : 'Cari'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {query.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear}
          style={{ alignSelf: 'flex-end', marginTop: 8 }}
        >
          <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '500' }}>
            ✕ Hapus pencarian
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;