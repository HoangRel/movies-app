import React, { useState } from "react";
import MovieDetail from "../browse/MovieList/MovieDetail";

import styles from "./ResultList.module.css";

const ResultList = ({ movies }) => {
  const [showMovie, setShowMovie] = useState(false);
  const [isMovie, setIsMovie] = useState(null);

  // một số movie không thể lấy được poster image do không có đuôi .jpg ở poster. Nên lọc bỏ những movie đó đi.
  const filteredMovies = movies.filter((movie) =>
    movie.poster.includes(".jpg")
  );

  // (Ẩn / hiện / thay đổi nội dung phim) của popup thông tin phim chi tiết.
  const clickHandler = (movie) => {
    if (!showMovie) {
      setIsMovie(movie);
      setShowMovie(true);
    } else {
      if (movie.id === isMovie.id) {
        setShowMovie(false);
      } else {
        setIsMovie(movie);
      }
    }
  };

  // state Loading và Error đã thiết lập trong component cha.

  // có 2 trường hợp: Không tìm thấy phim nào sau khi đã tìm và lọc (theo điều kiện trên)   .& Tìm thấy phim
  if (filteredMovies.length === 0) {
    return <p className={styles.mess}>Không có kết quả trùng khớp!</p>;
  } else {
    return (
      <React.Fragment>
        <h2 className={styles.searchTitle}>Search Result</h2>
        <ul className={styles.ul}>
          {filteredMovies.map((movie) => (
            <li key={movie.id} className={styles.li}>
              <img
                src={movie.poster}
                alt={movie.title}
                onClick={() => clickHandler(movie)}
              />
            </li>
          ))}
        </ul>
        {/* popup thông tin chi tiết phim */}
        {showMovie && <MovieDetail movieData={isMovie} />}
      </React.Fragment>
    );
  }
};

export default ResultList;
