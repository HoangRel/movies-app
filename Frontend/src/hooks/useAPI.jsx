import { useState, useCallback } from 'react';

const useAPI = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enteredBanner, setEnteredBanner] = useState(null);
  const [errorBanner, setErrorBanner] = useState(false);
  const [movies, setMovies] = useState({});

  const [isError, setIsError] = useState({
    fetchTrending: false,
    fetchNetflixOriginals: false,
    fetchTopRated: false,
    fetchActionMovies: false,
    fetchComedyMovies: false,
    fetchHorrorMovies: false,
    fetchRomanceMovies: false,
    fetchDocumentaries: false,
  });

  const API_KEY = '83000cd8936af060f3b23e85fc264318';

  // hàm gọi API
  const fetchMovies = useCallback(async keyword => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    setErrorBanner(null);
    setIsError({
      fetchTrending: false,
      fetchNetflixOriginals: false,
      fetchTopRated: false,
      fetchActionMovies: false,
      fetchComedyMovies: false,
      fetchHorrorMovies: false,
      fetchRomanceMovies: false,
      fetchDocumentaries: false,
    });

    const requests = {
      fetchTrending: `/movies/trending`,
      fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
      fetchTopRated: `/movies/top-rate`,
      fetchActionMovies: `/movies/discover?genre=28`,
      fetchComedyMovies: `/movies/discover?genre=35`,
      fetchHorrorMovies: `/movies/discover?genre=27`,
      fetchRomanceMovies: `/movies/discover?genre=10749`,
      fetchDocumentaries: `/movies/discover?genre=99`,
      fetchSearch: `/search/movie?api_key=${API_KEY}&language=en-US`,
    };

    try {
      let url = `http://localhost:8080/api${requests[keyword]}`;

      if (keyword === 'fetchNetflixOriginals') {
        url = `https://api.themoviedb.org/3${requests[keyword]}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.message);
      }

      if (response.status === 401) {
        const data = await response.json();
        return console.error(data.message);
      }

      if (!response.ok) {
        throw new Error('Lỗi kết nối!');
      }

      const data = await response.json();

      // Biến đổi dữ liệu nhận được từ API
      const transformedMovie = data.results.map(movieData => {
        return {
          id: movieData.id,
          title: movieData.title || movieData.name,
          vote: movieData.vote_average,
          date: movieData.release_date,
          overview: movieData.overview,
          poster: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
        };
      });

      setMovies(prevMovies => ({
        ...prevMovies,
        [keyword]: transformedMovie,
      }));

      ////////////////
      // Phần code cho Banner

      // Chọn ngẫu nhiên một phim có trong array đã gọi với keyword là fetchNetflixOriginals từ component Banner
      const bannerMovieIndex = Math.floor(Math.random() * data.results.length);
      const bannerMovie = data.results[bannerMovieIndex];
      const transformedMovieBanner = {
        id: bannerMovie.id,
        title: bannerMovie.title || bannerMovie.name,
        overview: bannerMovie.overview.split(' ').slice(0, 26).join(' '),
        backdrop: `https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path}`,
      };
      setEnteredBanner(transformedMovieBanner);

      ////////////////
    } catch (err) {
      console.log(err.message);
      setErrorBanner(err.message || 'Đã xẫy ra lỗi!');

      // nhập vào các lỗi đúng theo key từng thể loại.
      setIsError(prevError => ({
        ...prevError,
        [keyword]: err.message || 'Đã xẫy ra lỗi!',
      }));
    }
    setIsLoading(false);
  }, []);

  return {
    movies,
    enteredBanner,
    isLoading,
    errorBanner,
    isError,
    fetchMovies,
  };
};

export default useAPI;
