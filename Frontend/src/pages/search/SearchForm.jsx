import React, { useState } from 'react';

// dùng lại icon tạo cho Navbar làm label
import { SearchIcon } from '../browse/Icon';

import styles from './SearchForm.module.css';
import { getToken } from '../../util/auth';

const SearchForm = ({ setIsLoding, setError, setEnteredMovies }) => {
  const [inputSearch, setInputSearch] = useState('');
  const [more, setMore] = useState(false);

  const [genre, setGenre] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [language, setLanguage] = useState('');
  const [year, setYear] = useState('');

  // gọi API tìm phim
  const searchFetchMovie = async (queryValue, token) => {
    setIsLoding(true);
    setError(null);

    let url = `http://localhost:8080/api/movies/search?keyword=${encodeURIComponent(
      queryValue.searchValue
    )}`;

    if (queryValue.genre) {
      url += `&genre=${encodeURIComponent(queryValue.genre)}`;
    }

    if (queryValue.mediaType) {
      url += `&media_type=${encodeURIComponent(queryValue.mediaType)}`;
    }

    if (queryValue.language) {
      url += `&language=${encodeURIComponent(queryValue.language)}`;
    }

    if (queryValue.year) {
      url += `&year=${encodeURIComponent(queryValue.year)}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      console.log(url);

      // encodeURIComponent(query) để mã hóa tham số "query" trước khi nối nó vào URL.

      if (!response.ok) {
        const data = await response.json();
        console.log(data.message);

        throw new Error('Lỗi kết nối');
      }

      const data = await response.json();

      console.log(data);

      // nhập array phim bên trong data (data.results) vào array mới với mỗi phim là 1 object với key được viết tinh gọn
      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.id,
          title: movieData.title || movieData.name,
          vote: movieData.vote_average,
          date: movieData.release_date || movieData.first_air_date,
          overview: movieData.overview,
          poster: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
        };
      });
      // sau đó truyền lại cho component Search
      setEnteredMovies(transformedMovies);
    } catch (err) {
      setError(err.message || 'Đã xẫy ra lỗi');
    }

    // trong quá trình chạy, nó cũng truyền state Loading, Error về lại component Search.

    setIsLoding(false);
  };

  // hàm nhận input value
  const changeInputHandler = event => {
    setInputSearch(event.target.value);
  };

  const handleGenreChange = event => {
    setGenre(event.target.value);
  };

  const handleMediaTypeChange = event => {
    setMediaType(event.target.value);
  };

  const handleLanguageChange = event => {
    setLanguage(event.target.value);
  };

  const handleYearChange = event => {
    setYear(event.target.value);
  };

  // hàm khi nhấn Search, chỉ thực thi việc Search nếu không bỏ trống
  const clickSearchHandler = event => {
    event.preventDefault();

    const token = getToken();

    const queryValue = {};
    if (genre) {
      queryValue.genre = genre;
    }

    if (mediaType) {
      queryValue.mediaType = mediaType;
    }

    if (language) {
      queryValue.language = language;
    }

    if (year) {
      queryValue.year = year;
    }

    if (inputSearch.trim().length !== 0) {
      queryValue.searchValue = inputSearch;

      searchFetchMovie(queryValue, token);
    }
  };

  const clickMoreHandler = event => {
    event.preventDefault();
    setMore(pre => !pre);
  };

  // Hàm Reset, reset lại input và các phần đã render ra về Loading, error hay phim đã tìm được. (nếu có)
  const clickResetHandler = event => {
    event.preventDefault();
    setInputSearch('');
    setEnteredMovies(null);
    setGenre('');
    setMediaType('');
    setLanguage('');
    setYear('');
  };

  return (
    <form className={styles.searchForm}>
      <div className={styles.inputForm}>
        <input id='search' onChange={changeInputHandler} value={inputSearch} />
        <label htmlFor='search'>
          <SearchIcon />
        </label>
      </div>
      {more && (
        <div className={styles.formMore}>
          <div>
            <p>Genre:</p>
            <select name='country' value={genre} onChange={handleGenreChange}>
              <option value=''></option>
              <option value='Action'>Action</option>
              <option value='Adventure'>Adventure</option>
              <option value='Animation'>Animation</option>
              <option value='Comedy'>Comedy</option>
              <option value='Crime'>Crime</option>
              <option value='Documentary'>Documentary</option>
              <option value='Drama'>Drama</option>
              <option value='Family'>Family</option>
              <option value='Fantasy'>Fantasy</option>
              <option value='History'>History</option>
              <option value='Horror'>Horror</option>
              <option value='Music'>Music</option>
              <option value='Mystery'>Mystery</option>
              <option value='Romance'>Romance</option>
              <option value='Science Fiction'>Science Fiction</option>
              <option value='TV Movie'>TV Movie</option>
              <option value='Thriller'>Thriller</option>
              <option value='War'>War</option>
              <option value='Western'>Western</option>
            </select>
          </div>
          <div>
            <p>Media Type:</p>
            <select value={mediaType} onChange={handleMediaTypeChange}>
              <option value=''></option>
              <option value='All'>All</option>
              <option value='movie'>Movie</option>
              <option value='tv'>TV</option>
              <option value='person'>Person</option>
            </select>
          </div>
          <div>
            <p>Language:</p>
            <select value={language} onChange={handleLanguageChange}>
              <option value=''></option>
              <option value='en'>en-us</option>
              <option value='ja'>jp</option>
              <option value='ko'>kr</option>
            </select>
          </div>
          <div>
            <label>Year:</label>
            <input
              type='number'
              value={year}
              onChange={handleYearChange}
              min='1900'
              max='2025'
            />
          </div>
        </div>
      )}

      <button type='button' className={styles.more} onClick={clickMoreHandler}>
        {!more ? 'more..' : 'hide'}
      </button>
      <div className={styles.searchButton}>
        <button type='reset' onClick={clickResetHandler}>
          RESET
        </button>
        <button type='submit' onClick={clickSearchHandler}>
          SEARCH
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
