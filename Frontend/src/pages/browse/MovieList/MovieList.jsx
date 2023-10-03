import React, { useEffect, useState } from 'react';

import MovieDetail from './MovieDetail';

import useAPI from '../../../hooks/useAPI';
import styles from './MovieList.module.css';

// component render các list phim
const MovieList = () => {
  const { movies, isLoading, isError, fetchMovies } = useAPI();

  const [showMovie, setShowMovie] = useState(false);
  const [isMovie, setIsMovie] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const genres = [
    { title: 'Original', keyword: 'fetchTrending' },
    { title: 'Xu hướng', keyword: 'fetchNetflixOriginals' },
    { title: 'Xếp hạng cao', keyword: 'fetchTopRated' },
    { title: 'Hành động', keyword: 'fetchActionMovies' },
    { title: 'Hài', keyword: 'fetchComedyMovies' },
    { title: 'Kinh dị', keyword: 'fetchHorrorMovies' },
    { title: 'Lãng mạn', keyword: 'fetchRomanceMovies' },
    { title: 'Tài liệu', keyword: 'fetchDocumentaries' },
  ];

  useEffect(() => {
    genres.forEach(genre => {
      fetchMovies(genre.keyword);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMovies]);

  // xét các điều kiện để hiện/ẩn hay chuyển phim
  const clickHandler = (movie, genre) => {
    if (!showMovie) {
      setIsMovie(movie);
      setShowMovie(true);
      setSelectedGenre(genre);
    } else {
      if (movie.id === isMovie.id) {
        setShowMovie(false);
      } else {
        setIsMovie(movie);
        setSelectedGenre(genre);
      }
    }
  };

  return (
    <div>
      <ul className={styles.topList}>
        {isLoading && <p className={styles.reject}>Loading...</p>}
        {isError['fetchTrending'] && (
          <p className={styles.reject}>{isError['fetchTrending']}</p>
        )}
        {movies['fetchTrending'] &&
          movies['fetchTrending'].map(movie => (
            <li key={movie.id}>
              <img
                src={movie.poster}
                alt={movie.title}
                onClick={() => clickHandler(movie, 'fetchTrending')}
              />
            </li>
          ))}
      </ul>
      {showMovie && selectedGenre === 'fetchTrending' && (
        <MovieDetail movieData={isMovie} />
      )}
      {/* Các danh sách phim còn lại */}
      {genres.slice(1).map(genre => (
        <div key={genre.keyword}>
          <h2 className={styles.genres}>{genre.title}</h2>
          <ul className={styles.navList}>
            {isLoading && <p className={styles.reject}>Loading...</p>}
            {isError[genre.keyword] && (
              <p className={styles.reject}>{isError[genre.keyword]}</p>
            )}
            {movies[genre.keyword] &&
              movies[genre.keyword].map(movie => (
                <li className={styles.image} key={movie.id}>
                  <img
                    src={
                      movie.backdrop.indexOf('.jpg') === -1
                        ? movie.poster
                        : movie.backdrop
                    }
                    alt={movie.title}
                    onClick={() => clickHandler(movie, genre.keyword)}
                  />
                </li>
              ))}
          </ul>
          {showMovie && selectedGenre === genre.keyword && (
            <MovieDetail movieData={isMovie} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MovieList;
