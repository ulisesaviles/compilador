// React imports
import { FormEvent, useState } from "react";

// Next imports
import type { NextPage } from "next";
import Head from "next/head";

// Styles
import styles from "../styles/Home.module.css";

// Compilation process
import { lexicalAnalyzer } from "../compilationProcess/lexicalAnalyzer";

// Types
import { Token } from "../types/tokens";

// Components
import { displayToken } from "../components/token";
import syntacticAnalyzer from "../syntacticAnalyzer/syntacticAnalyzer";

// React component
const Home: NextPage = () => {
  // Constants
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState([] as Token[]);
  const [error, setError] = useState(null as null | string);

  // Functions
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Run lexical analyzer
      const tokens = lexicalAnalyzer(code);

      // Display result
      setTokens(tokens);

      setError(null);
    } catch (e) {
      setError((e as Error).toString());
    }
  };

  console.log(syntacticAnalyzer());

  // JSX
  return (
    <div className={styles.container}>
      <Head>
        <title>Lexical Analyzer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Input */}
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

        {/* Output */}
        <section className={styles.outputContainer}>
          {error ? (
            <div className={styles.outputLine}>
              <p
                style={{ color: "rgb(250, 100, 100)" }}
                className={styles.tokenComponent}
              >
                ERROR:
              </p>
              <p className={styles.tokenComponent}>{error}</p>
            </div>
          ) : (
            tokens.map((token) => {
              const index = tokens.indexOf(token);
              return (
                <div key={index} className={styles.lineContainer}>
                  <p className={styles.lineNum}>{index + 1}</p>
                  <div className={styles.outputLine}>{displayToken(token)}</div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
