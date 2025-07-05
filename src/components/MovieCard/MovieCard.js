import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const MovieCard = React.memo(({ item }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const vote = Math.round(item.vote_average * 10);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (vote / 100) * circumference;

  // ====== Check if movie is in favorites ======

  useFocusEffect(
    React.useCallback(() => {
      const checkFavorite = async () => {
        try {
          const favorites = await AsyncStorage.getItem('favorites');
          if (favorites) {
            const parsedFavorites = JSON.parse(favorites);
            setIsFavorite(parsedFavorites.some((fav) => fav.id === item.id));
          } else {
            setIsFavorite(false);
          }
        } catch (error) {
          console.error('Error checking favorites:', error);
        }
      };
      checkFavorite();
    }, [item.id])
  );

  // ======  Toggle favorite function ======
  const toggleFavorite = async () => {
    try {
      let favorites = await AsyncStorage.getItem('favorites');
      favorites = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favorites = favorites.filter((fav) => fav.id !== item.id);
      } else {
        favorites.push(item);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formattedDate = new Date(item.release_date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }
  );

  let strokeColor = vote >= 70 ? 'green' : vote >= 40 ? 'orange' : 'red';
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Details', { movieId: item.id });
  };
  return (
    <TouchableOpacity onPress={() => handlePress()}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
          }}
          style={styles.image}
        />
        <View style={styles.voteCircle}>
          <Svg width="36" height="36" viewBox="0 0 36 36">
            <Circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#222"
              strokeWidth="4"
            />
            <Circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              transform="rotate(-90 18 18)"
            />
            <SvgText
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              fontSize="8"
              fill="white"
              fontWeight="bold"
            >
              {vote}%
            </SvgText>
          </Svg>
        </View>

        <View style={styles.cardBody}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <View style={styles.footerRow}>
            <Text style={styles.date}>{formattedDate}</Text>
            {/* ====== [NEW] Clickable heart icon ====== */}
            <TouchableOpacity onPress={toggleFavorite}>
              <FontAwesome
                name="heart"
                size={16}
                color={isFavorite ? '#FF0000' : '#f0c420'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width / 2 - 16,
    margin: 6,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingBottom: 6,
  },
  image: {
    height: 250,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  voteCircle: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    width: 45,
    height: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    paddingTop: 25,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});

export default MovieCard;
