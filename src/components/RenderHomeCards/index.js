import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MovieCard from '../MovieCard/MovieCard';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2 - 16;

export default function RenderHomeCards() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=76fb730da20c26bcd7d05575d7dcf0c6&language=en-US&page=${page}`
      );
      const data = await res.json();
      setMovies((prev) => [...prev, ...data.results]);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const renderItem = ({ item }) => <MovieCard item={item} />;

  return (
    <>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#666"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={true}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum) {
              setPage((prev) => prev + 1);
              setOnEndReachedCalledDuringMomentum(true);
            }
          }}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReachedThreshold={0.75}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
    marginTop: 10,
  },
});
