import React, { useEffect, useState } from 'react';
import {View,Text,Image,StyleSheet,ScrollView,Dimensions,TouchableOpacity,Modal,ActivityIndicator,
Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Details({ route, navigation }) {
  const { movieId } = route.params;

  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=76fb730da20c26bcd7d05575d7dcf0c6&language=en-US`
        );
        if (!detailsResponse.ok) throw new Error('Failed to fetch movie details.');
        const detailsData = await detailsResponse.json();
        setMovieDetails(detailsData);

        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=76fb730da20c26bcd7d05575d7dcf0c6`
        );
        if (!creditsResponse.ok) throw new Error('Failed to fetch cast details.');
        const creditsData = await creditsResponse.json();
        setCast(creditsData.cast.slice(0, 5));

        const recommendationsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=76fb730da20c26bcd7d05575d7dcf0c6&language=en-US&page=1`
        );
        if (!recommendationsResponse.ok) throw new Error('Failed to fetch recommendations.');
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.results.slice(0, 5));

        await checkFavoriteStatus(detailsData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  const checkFavoriteStatus = async (movie) => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites);
        const found = favoritesArray.some(favMovie => favMovie.id === movie.id);
        setIsFavorite(found);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!movieDetails) return;

    try {
      let storedFavorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        favoritesArray = favoritesArray.filter(favMovie => favMovie.id !== movieDetails.id);
      } else {
        favoritesArray.push({
          id: movieDetails.id,
          title: movieDetails.title,
          poster_path: movieDetails.poster_path,
          release_date: movieDetails.release_date,
        });
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
          <Ionicons name="chevron-back" size={28} color="white" />
          <Text style={styles.backButtonText}>Go Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!movieDetails) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.noDataText}>No movie details found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
          <Ionicons name="chevron-back" size={28} color="white" />
          <Text style={styles.backButtonText}>Go Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const {
    title,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    vote_average,
    genres,
    runtime,
    homepage,
  } = movieDetails;

  const formattedReleaseDate = release_date
    ? new Date(release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    : 'N/A';

  const ratingStars = Math.round(vote_average / 2);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.appBarBackButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{
                uri: backdrop_path
                  ? `https://image.tmdb.org/t/p/w780/${backdrop_path}`
                  : `https://image.tmdb.org/t/p/w500/${poster_path}` || 'https://placehold.co/780x439/cccccc/333333?text=No+Backdrop',
              }}
              style={styles.backdropImage}
            />
          </TouchableOpacity>
          {poster_path && (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500/${poster_path}` }}
              style={styles.posterOverlayImage}
            />
          )}
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{formattedReleaseDate}</Text>
            </View>
            <TouchableOpacity onPress={toggleFavorite}>
              <AntDesign
                name={isFavorite ? "heart" : "hearto"}
                size={24}
                color="#FFD700"
                style={styles.favoriteIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <AntDesign
                key={i}
                name={i < ratingStars ? 'star' : 'staro'}
                size={20}
                color="#FFD700"
                style={styles.starIcon}
              />
            ))}
            <Text style={styles.voteCountText}>{movieDetails.vote_count}</Text>
          </View>

          <Text style={styles.overviewText}>{overview || 'No overview available.'}</Text>

          {genres && genres.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScrollView}>
              <View style={styles.tagsContainer}>
                {genres.map((genre) => (
                  <Text key={genre.id} style={styles.tagsCont}>
                    {genre.name}
                  </Text>
                ))}
              </View>
            </ScrollView>
          )}

          <View style={styles.metaInfoRow}>
            {runtime > 0 && (
              <Text style={styles.metaInfoText}>
                <Text style={styles.metaInfoLabel}>Duration:</Text>{' '}
                <Text style={styles.metaInfoValue}>{runtime} min</Text>
              </Text>
            )}
            {movieDetails.spoken_languages && movieDetails.spoken_languages.length > 0 && (
              <Text style={styles.metaInfoText}>
                <Text style={styles.metaInfoLabel}>Language:</Text>{' '}
                <Text style={styles.metaInfoValue}>
                  {movieDetails.spoken_languages[0].english_name}
                </Text>
              </Text>
            )}
          </View>

          {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
            <View style={styles.productionCompaniesContainer}>
              <Text style={styles.sectionTitle}>Production Companies</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {movieDetails.production_companies.map((company) => (
                  company.logo_path ? (
                    <View key={company.id} style={styles.companyLogoWrapper}>
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w200/${company.logo_path}` }}
                        style={styles.companyLogo}
                        resizeMode='contain'
                      />
                    </View>
                  ) : (
                    <Text key={company.id} style={styles.companyNameText}>{company.name}</Text>
                  )
                ))}
              </ScrollView>
            </View>
          )}

          {homepage && (
            <TouchableOpacity
              onPress={() => Linking.openURL(homepage)}
              style={styles.websiteButton}
            >
              <Text style={styles.websiteButtonText}>Visit Website</Text>
              <AntDesign name="link" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          )}

          {cast.length > 0 && (
            <View style={styles.castSection}>
              <Text style={styles.sectionTitle}>Top Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cast.map((person) => (
                  <View key={person.id} style={styles.castCard}>
                    <Image
                      source={{
                        uri: person.profile_path
                          ? `https://image.tmdb.org/t/p/w200/${person.profile_path}`
                          : 'https://via.placeholder.com/100x150?text=No+Image',
                      }}
                      style={styles.castImage}
                    />
                    <Text style={styles.castName} numberOfLines={1}>{person.name}</Text>
                    <Text style={styles.castCharacter} numberOfLines={1}>{person.character}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {recommendations.length > 0 && (
            <View style={styles.recommendationsSection}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendations.map((recMovie) => (
                  <TouchableOpacity
                    key={recMovie.id}
                    style={styles.recCard}
                    onPress={() => navigation.push('Details', { movieId: recMovie.id })}
                  >
                    <Image
                      source={{
                        uri: recMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w300/${recMovie.poster_path}`
                          : 'https://via.placeholder.com/150x225?text=No+Image',
                      }}
                      style={styles.recImage}
                    />
                    <Text style={styles.recTitle} numberOfLines={1}>
                      {recMovie.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{
              uri: backdrop_path
                ? `https://image.tmdb.org/t/p/original/${backdrop_path}`
                : `https://image.tmdb.org/t/p/original/${poster_path}` || 'https://placehold.co/1920x1080/000000/FFFFFF?text=No+Image',
            }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.modalCloseButtonAbsolute} onPress={() => setModalVisible(false)}>
            <Ionicons name="close-circle-outline" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  noDataText: {
    color: '#333',
    fontSize: 18,
    marginBottom: 20,
  },
  backButtonError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  appBarBackButton: {
    marginRight: 15,
    padding: 5,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: width * 0.6,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  posterOverlayImage: {
    width: 150,
    height: 225,
    borderRadius: 10,
    position: 'absolute',
    bottom: -100,
    left: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  detailsSection: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 120,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  favoriteIcon: {
    padding: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  starIcon: {
    marginRight: 2,
  },
  voteCountText: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 8,
  },
  overviewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsScrollView: {
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagsCont: {
    backgroundColor: '#FFD700',
    color: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 13,
  },
  metaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  metaInfoText: {
    marginRight: 25,
    fontSize: 15,
  },
  metaInfoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  metaInfoValue: {
    fontWeight: 'normal',
    color: '#666',
  },
  productionCompaniesContainer: {
    marginBottom: 20,
  },
  companyLogoWrapper: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    minHeight: 80,
  },
  companyLogo: {
    width: 60,
    height: 60,
  },
  companyNameText: {
    color: '#666',
    fontSize: 14,
    marginRight: 10,
    paddingVertical: 5,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  websiteButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  castSection: {
    marginBottom: 20,
  },
  castCard: {
    marginRight: 15,
    alignItems: 'center',
    width: 100,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  castName: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  castCharacter: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  recommendationsSection: {
    marginBottom: 30,
  },
  recCard: {
    marginRight: 15,
    width: 120,
    alignItems: 'center',
  },
  recImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  recTitle: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  modalCloseButtonAbsolute: {
    position: 'absolute',
    top: 60,
    right: 15,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 5,
  },
});