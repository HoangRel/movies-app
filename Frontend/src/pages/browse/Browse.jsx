import React from "react";

import NavBar from "./NavBar";
import Banner from "./Banner/Banner";
import MovieList from "./MovieList/MovieList";

function Browse() {
  return (
    <div className="app">
      <NavBar />
      <Banner />
      <MovieList />
    </div>
  );
}

export default Browse;
