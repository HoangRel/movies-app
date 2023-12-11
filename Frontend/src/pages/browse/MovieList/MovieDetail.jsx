import React, { useEffect, useState } from 'react';

import YouTube from 'react-youtube';

import styles from './MovieDetail.module.css';
import Ticket from '../../ticket/Ticket';

// hiển thị chi tiết bộ phim
const MovieDetail = props => {
  // false là dùng ảnh, true là dùng video từ youtube
  const [isMedia, setIsMedia] = useState(false);
  const [isBook, setIsBook] = useState(false);

  const [isYoutube, setIsYoutube] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // state này cho việc mở popup thông tin phim lên. vì mặc định image là được dùng từ đầu trước khi kiểm tra xem có thể dùng video hay không. State này để tránh việc render image từ đầu không cần thiết.
  const [isStart, setIsStart] = useState(false);

  // gọi fetch API
  useEffect(() => {
    const fetchMovieDetail = async () => {
      const token = localStorage.getItem('token');
      setIsStart(false);
      // mặc định là dùng ảnh để render
      setIsMedia(false);
      setIsLoading(true);

      try {
        const response = await fetch(
          // `https://api.themoviedb.org/3//movie/${props.movieData.id}/videos?api_key=${API_KEY}`
          `http://localhost:8080/api/movies/video?film_id=${props.movieData.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );

        // // nếu có lỗi thì thoát
        // if (!response.ok) {
        //   return null;
        // }

        const data = await response.json();

        // nếu không có video nào thì thoát
        if (data.results.length === 0) {
          return null;
        }

        // nếu có video chọn video đầu tiên thõa điều kiện
        const filterMovie = data.results.find(movie => {
          if (movie.site === 'YouTube') {
            switch (movie.type) {
              case 'Trailer':
                return movie;
              case 'Teaser':
                return movie;
              default:
                break;
            }
          }
          return null;
        });
        // Nếu đã tìm thấy bộ phim đủ điều kiện.
        if (filterMovie) {
          setIsYoutube(filterMovie);

          // dùng video
          setIsMedia(true);
        }
      } catch (err) {
        return null;
      } finally {
        // dù hàm chạy thành công hay không thì vẫn sẽ tắt state Loading & mở popup chi tiết phim
        // nếu hàm chạy không thành công thì sẽ theo mặc định (render image), nếu thành công tìm thấy video thì render video
        setIsStart(true);
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [props.movieData.id]);

  const opts = {
    // height: "400",
    // width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const onCloseHandler = () => {
    setIsBook(false);
  };

  return (
    <section className={styles.section}>
      {isBook && (
        <Ticket movieId={props.movieData.id} onClose={onCloseHandler} />
      )}
      <div>
        <h1>{props.movieData.title}</h1>
        <hr></hr>
        {props.movieData.date && <h3>Release Date: {props.movieData.date}</h3>}
        <h3>Vote: {props.movieData.vote}/10</h3>
        <p>{props.movieData.overview}</p>
      </div>
      <button type='button' onClick={() => setIsBook(true)}>
        Book tickets
      </button>
      <div>
        {isLoading && <p>Loading...</p>}
        {isStart && !isMedia && (
          <img
            className={styles.image}
            src={
              // dùng Backdrop
              // nhưng một số bộ phim có link backdrop (bị lỗi?) không có đuôi .jpg nên không thể lấy ảnh về render được. Nên dùng poster thay thế cho số ít trường hợp đó.
              props.movieData.backdrop.indexOf('.jpg') === -1
                ? props.movieData.poster
                : props.movieData.backdrop
            }
            alt={props.movieData.title}
          />
        )}
        {isStart && isMedia && (
          <YouTube
            className={styles.image}
            videoId={isYoutube.key}
            opts={opts}
          />
        )}
      </div>
    </section>
  );
};

export default MovieDetail;
