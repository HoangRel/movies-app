const express = require('express');

const movie = require('../controllers/movie');

const router = express.Router();

// Lấy các phim đang Trending
router.get('/trending', movie.getTrending);

// Lấy các phim có Rating cao
router.get('/top-rate', movie.getRating);

// Lấy các phim theo thể loại
router.get('/discover', movie.getGenre);

// Lấy trailer của một bộ phim
router.get('/video', movie.getVideo);

// Tìm kiếm phim theo từ khóa
router.get('/search', movie.getSearch);

module.exports = router;
