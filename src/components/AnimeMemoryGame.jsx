import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimeMemoryGame() {
  const [characters, setCharacters] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const API_URL = `https://api.jikan.moe/v4/characters?page=${randomPage}&limit=12`;

    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const formatted = data.data.map((char) => ({
        id: char.mal_id,
        name: char.name,
        images: [char.images.jpg.image_url],
      }));
      setCharacters(formatted);
      setShuffled(formatted.sort(() => 0.5 - Math.random()));
    } catch (err) {
      console.error('Error al obtener personajes:', err);
    }
  };

  const handleCardClick = (id) => {
    if (clicked.includes(id)) {
      setScore(0);
      setClicked([]);
    } else {
      const newScore = score + 1;
      setScore(newScore);
      setClicked([...clicked, id]);
      setBestScore(Math.max(bestScore, newScore));
    }
    setShuffled([...characters].sort(() => 0.5 - Math.random()));
  };

  return (
    <div className="container">
      <h1>Anime Memory Game</h1>
      <p>Score: {score} | Best Score: {bestScore}</p>

      <div className="grid">
        {shuffled.map((char) => (
          <motion.div
            key={char.id}
            whileHover={{ scale: 1.05 }}
            className="card"
            onClick={() => handleCardClick(char.id)}
          >
            <img
              src={char.images[0]}
              alt={char.name}
            />
            <p>{char.name}</p>
          </motion.div>
        ))}
      </div>

      <button className="shuffle-btn" onClick={fetchCharacters}>
        Shuffle Cards
      </button>
    </div>
  );
}
