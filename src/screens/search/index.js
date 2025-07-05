import React, { useState, useEffect } from 'react'
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text, FlatList, ActivityIndicator } from 'react-native'
import MovieCard from '../../components/MovieCard/MovieCard'
import Header from '../../components/header'

function Search() {
  const [searchWord, setSearchWord] = useState("")
  const [movies, setMovies] = useState([])
  const [endReached, setEndReached] = useState(false)
  const [loading, setLoading] = useState(false)

  const handelSearch = async () => {
    if (searchWord.trim().length < 1) {
      setMovies([]);
      setEndReached(false);
      return;
    }

    try {
      setLoading(true)
      const Data = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=76fb730da20c26bcd7d05575d7dcf0c6&query=${searchWord}`)
      const films = await Data.json()
      setMovies(films.results)
      setEndReached(films.results.length === 0)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      handelSearch()
    }, 100)

    return () => clearTimeout(delay)
  }, [searchWord])

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={searchWord}
          onChangeText={(newWord) => setSearchWord(newWord)}
          placeholder='Search for your film...'
        />
        <TouchableOpacity style={styles.btn} onPress={handelSearch}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searchWord && (
        <Text style={styles.searchWord}>Search result for <Text style={{ fontWeight: '600' }}>{searchWord}</Text></Text>
      )}

      {loading && (
        <ActivityIndicator size="large" color="#f5a623" style={{ marginTop: 5 }} />
      )}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard item={item} />}
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
        numColumns={2}
        onEndReached={() => setEndReached(true)}
        onEndReachedThreshold={0.7}
      />

      {endReached && movies.length > 0 && (
        <Text style={styles.endText}>No more results</Text>
      )}

      {!loading && searchWord.trim() !== '' && movies.length === 0 && (
        <Text style={styles.noResults}>Not found</Text>
      )}
    </SafeAreaView>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
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
  }
})

