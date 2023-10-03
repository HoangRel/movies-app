import React, { useState } from "react";

import NavBar from "../browse/NavBar";
import SearchForm from "./SearchForm";
import ResultList from "./ResultList";

import styles from "./Search.module.css";

const Search = () => {
  // các state nhận giá trị từ component SearchForm, xữ lý, sau đó truyền vào ResultList để render lên nếu thõa các điều kiện.
  const [movies, setMovies] = useState(null);
  const [isLoading, setIsLoding] = useState(false);
  const [error, setError] = useState(null);

  // các hàm nhận dữ liệu về từ việc lấy input và gọi API bên component SearchForm

  const searchMovies = (enteredMovie) => {
    setMovies(enteredMovie);
  };

  const loadingHandler = (isLoading) => {
    setIsLoding(isLoading);
  };

  const errorHanler = (error) => {
    setError(error);
  };

  // class "app" được viết sẳn từ file Stater Code

  return (
    <div className="app">
      <NavBar />
      <SearchForm
        setEnteredMovies={searchMovies}
        setIsLoding={loadingHandler}
        setError={errorHanler}
      />
      <React.Fragment>
        {isLoading && <p className={styles.mess}>Loading...</p>}
        {error && <p className={styles.mess}>{error}</p>}
        {movies && <ResultList movies={movies} />}
      </React.Fragment>
    </div>
  );
};

export default Search;
