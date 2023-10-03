const MovieList = require('../models/MovieList');
const GenreList = require('../models/GenreList');
const VideoList = require('../models/VideoList');

const paginate = require('../utils/paging');

// Phân trang và lấy phần dữ liệu tương ứng
const getPaginatedData = (movies, page, sortByField) => {
  if (sortByField) {
    // Sắp xếp movies theo sortByField giảm dần
    movies.sort((a, b) => b[sortByField] - a[sortByField]);
  }

  return paginate(movies, page);
};

//////////////////////////

// Lấy các phim đang Trending

exports.getTrending = (req, res) => {
  const page = parseInt(req.query.page) || 1;

  // gọi phương thức all từ MovieList nhận movies
  const movies = MovieList.all();

  const paginatedData = getPaginatedData(movies, page, 'popularity');

  const response = {
    results: paginatedData.data,
    page,
    total_pages: paginatedData.totalPages,
  };

  res.status(200).json(response);
};

//////////////////////////

// Lấy các phim có Rating cao

exports.getRating = (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const movies = MovieList.all();

  const paginatedData = getPaginatedData(movies, page, 'vote_average');

  const response = {
    results: paginatedData.data,
    page,
    total_pages: paginatedData.totalPages,
  };

  res.status(200).json(response);
};

//////////////////////////

// Lấy các phim theo thể loại

exports.getGenre = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const genreId = parseInt(req.query.genre);

  if (!genreId) {
    return res.status(400).json({ message: 'Not found gerne parram' });
  }

  const genre = GenreList.all();
  const genreMovie = genre.find(genre => genre.id === genreId);

  if (!genreMovie) {
    return res.status(400).json({ message: 'Not found that gerne id' });
  }

  const allMovies = MovieList.all();
  const movies = allMovies.filter(movie => movie.genre_ids.includes(genreId));

  const paginatedData = getPaginatedData(movies, page);

  const response = {
    results: paginatedData.data,
    page,
    total_pages: paginatedData.totalPages,
    genre_name: genreMovie.name,
  };

  res.status(200).json(response);
};

//////////////////////////

// Lấy trailer của một bộ phim

exports.getVideo = (req, res) => {
  const filmId = parseInt(req.query.film_id);
  if (!filmId) {
    return res.status(400).json({ message: 'Not found film_id parram' });
  }

  const idVideo = VideoList.all(filmId);
  if (!idVideo) {
    return res.status(404).json({ message: 'Not found video' });
  }

  // Thỏa mãn điều kiện & Ưu tiên trailer
  let hasVideo = idVideo.videos.filter(
    video =>
      video.official && video.site === 'YouTube' && video.type === 'Trailer'
  );

  if (hasVideo.length === 0) {
    hasVideo = idVideo.videos.filter(
      video =>
        video.official && video.site === 'YouTube' && video.type === 'Teaser'
    );
  }

  if (hasVideo.length === 0) {
    return res.status(404).json({ message: 'Not found video' });
  } else if (hasVideo.length === 1) {
    res.status(200).json({ results: hasVideo });
  } else {
    const mostRecent = hasVideo.reduce((prev, current) => {
      return new Date(prev.published_at) > new Date(current.published_at)
        ? prev
        : current;
    });

    // vì trong frontend đã viết code nhận array
    const video = [{ ...mostRecent }];
    res.status(200).json({ results: video });
  }
};

//////////////////////////

// Tìm kiếm phim theo từ khóa

exports.getSearch = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const keyword = req.query.keyword;
  const genre = req.query.genre || null;
  const mediaType = req.query.media_type || null;
  const language = req.query.language || null;
  const year = req.query.year || null;

  if (!keyword) {
    return res.status(400).json({ message: 'Not found keyword parram' });
  }

  const allMovies = MovieList.all();

  let matchedMovies = allMovies.filter(
    movie =>
      (movie.title &&
        movie.title.toLowerCase().includes(keyword.toLowerCase())) ||
      (movie.overview &&
        movie.overview.toLowerCase().includes(keyword.toLowerCase()))
  );

  // Xét các điều kiện khác (nếu có)
  if (genre) {
    const genres = GenreList.all();
    const genreMovie = genres.find(genr => genr.name === genre);
    const genreId = genreMovie.id;

    matchedMovies = matchedMovies.filter(movie =>
      movie.genre_ids.includes(genreId)
    );
  }

  if (mediaType && mediaType !== 'All') {
    matchedMovies = matchedMovies.filter(
      movie => movie.media_type === mediaType
    );
  }

  if (language) {
    matchedMovies = matchedMovies.filter(
      movie => movie.original_language === language
    );
  }

  if (year) {
    matchedMovies = matchedMovies.filter(
      movie =>
        (movie.release_date && movie.release_date.split('-')[0] === year) ||
        (movie.first_air_date && movie.first_air_date.split('-')[0] === year)
    );
  }

  const paginatedData = getPaginatedData(matchedMovies, page);

  const response = {
    results: paginatedData.data,
    page,
    total_pages: paginatedData.totalPages,
  };

  res.status(200).json(response);
};
