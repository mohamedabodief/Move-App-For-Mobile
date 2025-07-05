import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text, FlatList, ActivityIndicator } from 'react-native';
import MovieCard from '../../components/MovieCard/MovieCard';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Search() {
  const navigation = useNavigation();
  const [searchWord, setSearchWord] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState(new Set());

  const debounceTimeoutRef = useRef(null);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites);
        setFavoriteMovieIds(new Set(favoritesArray.map(movie => movie.id)));
      }
    } catch (error) {
      console.error("Error loading favorite IDs:", error);
    }
  };

  useEffect(() => {
    loadFavorites();
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchMovies = async (query) => {
    if (!query.trim()) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=76fb730da20c26bcd7d05575d7dcf0c6&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchWord.trim() !== "") {
      setMovies([]);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchMovies(searchWord);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchWord]);

  const renderItem = ({ item }) => {
    const isFav = favoriteMovieIds.has(item.id);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { movieId: item.id })}
        activeOpacity={0.7}
      >
        <MovieCard item={item} isFavorite={isFav} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={searchWord}
          onChangeText={(newWord) => setSearchWord(newWord)}
          placeholder='Search for your film...'
        />
        <TouchableOpacity style={styles.btn} onPress={() => fetchMovies(searchWord)}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searchWord.trim() !== "" && (
        <Text style={styles.searchWord}>Search result for <Text style={{ fontWeight: '600' }}>{searchWord}</Text></Text>
      )}

      {loading && movies.length === 0 ? (
        <ActivityIndicator size="large" color="#f5a623" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          numColumns={2}
        />
      )}

      {!loading && searchWord.trim() !== '' && movies.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResults}>Not found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Search

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    height: 40,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 7,
  },
  btn: {
    backgroundColor: '#FFE353',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 7,
    marginLeft: 10,
  },
  btnText: {
    fontWeight: 'bold',
    color: '#000',
  },
  endText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 14,
  },
  noResults: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    textAlign: 'center',
    fontSize: 20,
    color: '#888',
    fontWeight: '700',
  },
  searchWord: {
    paddingLeft: 20,
    paddingBottom: 4
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})