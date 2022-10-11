// React imports
import { FormEvent, useState } from "react";

// Next imports
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

// Styles
import styles from "../styles/Home.module.css";
import {
  lexicalAnalyzer,
  stringifyToken,
} from "../compilationProcess/lexicalAnalyzer";
import { Token } from "../types/tokens";

// React component
const Home: NextPage = () => {
  // Constants
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState([] as Token[]);

  // Functions
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tokens = lexicalAnalyzer(code);
    setTokens(tokens);
  };

  // JSX
  return (
    <div className={styles.container}>
      <Head>
        <title>Lexical Analyzer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section>
          <form onSubmit={submit} autoComplete="off" className={styles.form}>
            <textarea
              name="input"
              id="input"
              className={styles.input}
              onChange={(e) => setCode(e.target.value)}
            />
            <input type="submit" value="Submit" />
          </form>
        </section>
        <section className={styles.outputContainer}>
          {tokens.map((token) => {
            const index = tokens.indexOf(token);
            return (
              <div key={index} className={styles.lineContainer}>
                <p className={styles.lineNum}>{index + 1}</p>
                <p className={styles.outputLine}>{stringifyToken(token)}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Home;
