// React imports
import { FormEvent, useState } from "react";

// Next imports
import type { NextPage } from "next";
import Head from "next/head";

// Styles
import styles from "../styles/Home.module.css";

// Compilation process
import { lexicalAnalyzer } from "../lexicalAnalyzer/lexicalAnalyzer";

// Types
import { Token } from "../types/tokens";

// Components
import { displayToken } from "../components/token";
import syntacticAnalyzer from "../syntacticAnalyzer/syntacticalAnalyzer";

// React component
const Home: NextPage = () => {
  // Constants
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState([] as Token[]);
  const [errors, setErrors] = useState<{
    lexical: null | string;
    syntactical: null | string;
  }>({
    lexical: null,
    syntactical: null,
  });
  const [syntacticalAnalyzerLogs, setSyntacticalAnalyzerLogs] = useState<
    string[]
  >([]);

  // Functions
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let tokens: Token[] = [];

    try {
      // Run lexical analyzer
      tokens = lexicalAnalyzer(code);
      setTokens(tokens);
    } catch (e) {
      setErrors({
        syntactical: null,
        lexical: (e as Error).toString(),
      });
      setSyntacticalAnalyzerLogs([]);
      return;
    }

    try {
      // Run syntacticalAnalyzer
      const { logs, status } = syntacticAnalyzer(
        tokens.map((token) => token[0])
      );
      setSyntacticalAnalyzerLogs(logs);
    } catch (e) {
      setErrors({
        lexical: null,
        syntactical: (e as Error).toString(),
      });
      return;
    }

    // No errors
    setErrors({ lexical: null, syntactical: null });
  };

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
          <h2 className={styles.outputTitle}>Output:</h2>
          {errors.lexical ? (
            <div className={styles.outputLine}>
              <p
                style={{ color: "rgb(250, 100, 100)" }}
                className={styles.tokenComponent}
              >
                LEXICAL ANALYZER ERROR:
              </p>
              <p className={styles.tokenComponent}>{errors.lexical}</p>
            </div>
          ) : (
            <div className={styles.outputSectionContainer}>
              <h3 className={styles.outputSectionTitle}>
                {tokens.length > 0 ? "Tokens:" : null}
              </h3>
              {tokens.map((token, index) => {
                return (
                  <div key={index} className={styles.lineContainer}>
                    <p className={styles.lineNum}>{index + 1}</p>
                    <div className={styles.outputLine}>
                      {displayToken(token)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {errors.syntactical ? (
            <div className={styles.outputLine}>
              <p
                style={{ color: "rgb(250, 100, 100)" }}
                className={styles.tokenComponent}
              >
                SYNTACTICAL ERROR:
              </p>
              <p className={styles.tokenComponent}>{errors.syntactical}</p>
            </div>
          ) : (
            <div className={styles.outputSectionContainer}>
              <h3 className={styles.outputSectionTitle}>
                {syntacticalAnalyzerLogs.length > 0
                  ? "Syntactical analyzer logs:"
                  : null}
              </h3>
              {syntacticalAnalyzerLogs.map((log, index) => {
                return (
                  <div key={index} className={styles.lineContainer}>
                    <p className={styles.lineNum}>{index + 1}</p>
                    <div className={styles.outputLine}>{log}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
