// Types
import { Token } from "../types/tokens";

// Styles
import styles from "../styles/Home.module.css";

// JSX
export const displayToken = (token: Token) => (
  <>
    (
    <p
      style={{ color: "rgb(100, 250, 150)" }}
      className={styles.tokenComponent}
    >
      {token[0]}
    </p>
    ,
    <p
      style={{ color: "rgb(100, 200, 250)" }}
      className={styles.tokenComponent}
    >
      {token[1]}
    </p>
    )
  </>
);
