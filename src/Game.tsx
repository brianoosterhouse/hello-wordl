import { useEffect, useRef, useState } from "react";
import { Row, RowState } from "./Row";
import dictionary from "./dictionary.json";
import { Clue, clue, describeClue } from "./clue";
import { Keyboard } from "./Keyboard";
import targets from "./targets.json";
import { currentDay, parseHtml, speak } from "./util";

enum GameState {
  Playing,
  Won,
  Lost,
}

interface GameProps {
  maxGuesses: number;
  hidden: boolean;
  colorBlind: boolean;
  keyboardLayout: string;
}

function parseLength(target: string) {
  return target.split('').length;
}

function Game(props: GameProps) {
  const [gameState, setGameState] = useState(GameState.Playing);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [target] = useState(() => {
    const currentTarget = Object.keys(targets)[currentDay()];
    if (currentTarget !== '') {
      return currentTarget;
    } else { // use a random word
      return Object.keys(targets)[Math.floor(Math.random() * Object.keys(targets).length)];
    }
  });
  const [wordLength] = useState(
    Number(parseLength(target))
  );
  let targetDefinition = '';
  const [hint, setHint] = useState<string>(`Make your first guess!`);
  const tableRef = useRef<HTMLTableElement>(null);

  const onKey = (key: string) => {
    if (gameState !== GameState.Playing) return;
    if (guesses.length === props.maxGuesses) return;
    if (/^[a-z]$/i.test(key)) {
      setCurrentGuess((guess) =>
        (guess + key.toLowerCase()).slice(0, wordLength)
      );
      tableRef.current?.focus();
      setHint("");
    } else if (key === "Backspace") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setHint("");
    } else if (key === "Enter") {
      if (currentGuess.length !== wordLength) {
        setHint("Too short");
        return;
      }
      if (!dictionary.includes(currentGuess) && !Object.keys(targets).includes(currentGuess)) {
        setHint("Not a valid word");
        return;
      }
      setGuesses((guesses) => guesses.concat([currentGuess]));
      setCurrentGuess((guess) => "");

      const gameOver = (verbed: string) => {
        Object.values(targets).forEach((definition, i) => {
          if (Object.keys(targets)[i] === target) {
            targetDefinition = definition;
          }
        });
        return parseHtml(
          `You ${verbed}! The answer was <span style="color: #F70000; font-weight: 600;">${target.toUpperCase()}</span>.<p>${targetDefinition}</p>`
        );
      }

      if (currentGuess === target) {
        setHint(gameOver("won"));
        setGameState(GameState.Won);
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(gameOver("lost"));
        setGameState(GameState.Lost);
      } else {
        setHint("");
        speak(describeClue(clue(currentGuess, target)));
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentGuess, gameState]);

  let letterInfo = new Map<string, Clue>();
  const tableRows = Array(props.maxGuesses)
    .fill(undefined)
    .map((_, i) => {
      const guess = [...guesses, currentGuess][i] ?? "";
      const cluedLetters = clue(guess, target);
      const lockedIn = i < guesses.length;
      if (lockedIn) {
        for (const { clue, letter } of cluedLetters) {
          if (clue === undefined) break;
          const old = letterInfo.get(letter);
          if (old === undefined || clue > old) {
            letterInfo.set(letter, clue);
          }
        }
      }
      return (
        <Row
          key={i}
          wordLength={wordLength}
          rowState={
            lockedIn
              ? RowState.LockedIn
              : i === guesses.length
              ? RowState.Editing
              : RowState.Pending
          }
          cluedLetters={cluedLetters}
        />
      );
    });

  return (
    <div className="Game" style={{ display: props.hidden ? "none" : "block" }}>
      <table
        className="Game-rows"
        tabIndex={0}
        aria-label="Table of guesses"
        ref={tableRef}
      >
        <tbody>{tableRows}</tbody>
      </table>
      <p
        role="alert"
        style={{
          userSelect: /https?:/.test(hint) ? "text" : "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {hint || `\u00a0`}
      </p>
      <Keyboard
        layout={props.keyboardLayout}
        letterInfo={letterInfo}
        onKey={onKey}
        style={gameState === GameState.Playing ? "flex" : "none"}
      />
      <br />
      <br />
      <br />
      <div className="Game-options">
        <button
          className={"vr-button secondary"}
          disabled={gameState !== GameState.Playing || guesses.length === 0}
          onClick={() => {
            if (gameState === GameState.Playing) {
              Object.values(targets).forEach((definition, i) => {
                if (Object.keys(targets)[i] === target) {
                  targetDefinition = definition;
                }
              });
              if (targetDefinition === '') {
                setHint(
                  parseHtml(
                    `The answer was <span style="color: #F70000; font-weight: 600;">${target.toUpperCase()}</span>.`
                  )
                );
              } else {
                setHint(
                  parseHtml(
                    `The answer was <span style="color: #F70000; font-weight: 600;">${target.toUpperCase()}</span>. <p>${targetDefinition}</p>`
                  )
                );
              }
              setGameState(GameState.Lost);
              (document.activeElement as HTMLElement)?.blur();
            }
          }}
        >
          Give up
        </button>
        <div>
          <h4
            className="Game-over-message"
            style={{
              display: gameState === GameState.Playing ? "none" : "block",
            }}
          >
          Check back tomorrow for a new word!
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Game;
