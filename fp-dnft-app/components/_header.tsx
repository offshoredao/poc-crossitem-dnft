import React from "react";
import styles from "../styles/Theme.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <div>
        <img src={`/logo.png`} width={40} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
}
