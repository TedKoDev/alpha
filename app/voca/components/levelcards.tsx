import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import FlipCard from './flipcard';

const LevelCards = () => {
  const cards = Array.from({ length: 100 }, (_, index) => ({
    frontText: `Lv ${index + 1}`,
    backText: `Word ${String.fromCharCode(65 + (index % 26))}`,
    detailRoute: `/voca/detail/${index + 1}`,
  }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {cards.map((card, index) => (
        <FlipCard
          key={index}
          frontText={card.frontText}
          backText={card.backText}
          detailRoute={card.detailRoute}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default LevelCards;
