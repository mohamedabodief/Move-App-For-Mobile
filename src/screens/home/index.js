import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Header from '../../components/header';
import CardHome from '../../components/cardHome';
import Pagination from '../../components/pagination';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=76fb730da20c26bcd7d05575d7dcf0c6&language=en-US&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results.slice(0, 12));
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  return (
    <View style={styles.container}>
        <Header/>
      {loading ? (
        <ActivityIndicator size="large" color="#666" />
      ) : (
        <>
          <CardHome movies={movies} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
});
