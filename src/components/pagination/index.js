import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxVisible = 5;
  let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisible + 1, 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <View style={styles.container}>
      {currentPage > 1 && (
        <TouchableOpacity onPress={() => onPageChange(currentPage - 1)} style={styles.button}>
          <Text style={styles.arrow}>&laquo;</Text>
        </TouchableOpacity>
      )}

      {startPage > 1 && <Text style={styles.ellipsis}>...</Text>}

      {visiblePages.map((num) => (
        <TouchableOpacity
          key={num}
          onPress={() => onPageChange(num)}
          style={[
            styles.pageButton,
            num === currentPage && styles.activePage,
          ]}
        >
          <Text style={[styles.pageText, num === currentPage && styles.activeText]}>
            {num}
          </Text>
        </TouchableOpacity>
      ))}

      {endPage < totalPages && <Text style={styles.ellipsis}>...</Text>}

      {currentPage < totalPages && (
        <TouchableOpacity onPress={() => onPageChange(currentPage + 1)} style={styles.button}>
          <Text style={styles.arrow}>&raquo;</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  arrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pageText: {
    fontWeight: 'bold',
    color: '#000',
  },
  activePage: {
    backgroundColor: '#FFD700',
    borderColor: '#0d6efd',
  },
  activeText: {
    color: '#000',
  },
  ellipsis: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    fontSize: 16,
  },
});
