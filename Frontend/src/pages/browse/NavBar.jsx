import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SearchIcon } from "./Icon";

import styles from "./NavBar.module.css";

// component NavBar dùng chung cho trang chủ và Search page
const NavBar = () => {
  const [isTransparent, setIsTransparent] = useState(true);

  // đều kiện thay đổi backgound
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 100) {
        setIsTransparent(false);
      } else {
        setIsTransparent(true);
      }
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  // chuyển trang
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate("/");
  };

  const searchHandler = () => {
    navigate("/search");
  };

  // class động cho việc thay đổi background
  const isTransparentClass = `${styles.navbar} ${
    isTransparent ? styles.transparent : styles.dark
  }`;

  return (
    <nav className={isTransparentClass}>
      <h1 className={styles.title} onClick={clickHandler}>
        Movie App
      </h1>
      <div className={styles.search} onClick={searchHandler}>
        <SearchIcon />
      </div>
    </nav>
  );
};

export default NavBar;
