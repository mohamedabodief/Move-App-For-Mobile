import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';


const MovieCard = React.memo(({ item }) => {
  const vote = Math.round(item.vote_average * 10);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (vote / 100) * circumference;

  const formattedDate = new Date(item.release_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  let strokeColor = vote >= 70 ? 'green' : vote >= 40 ? 'orange' : 'red';

  return (
    <View style={styles.card}>
      <View style={styles.image}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
          style={styles.image}
        />
        <View style={styles.voteCircle}>
          <Svg width="36" height="36" viewBox="0 0 36 36">
            <Circle cx="18" cy="18" r="16" fill="none" stroke="#222" strokeWidth="4" />
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
      </View>

      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.date}>{formattedDate}</Text>
          <FontAwesome name="heart" size={16} color="#f0c420" />
        </View>
      </View>
    </View>
  );
});

export default MovieCard;

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
    bottom: -20,
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
