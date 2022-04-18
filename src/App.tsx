import "./App.css";
import { maxGuesses } from "./util";
import Game from "./Game";
import { useEffect, useState } from "react";
import { Row, RowState } from "./Row";
import { Clue } from "./clue";

function useSetting<T>(
  key: string,
  initial: T
): [T, (value: T | ((t: T) => T)) => void] {
  const [current, setCurrent] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch (e) {
      return initial;
    }
  });
  const setSetting = (value: T | ((t: T) => T)) => {
    try {
      const v = value instanceof Function ? value(current) : value;
      setCurrent(v);
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {}
  };
  return [current, setSetting];
}

function App() {
  type Page = "game" | "about" | "settings";
  const [page, setPage] = useState<Page>("game");
  const [colorBlind, setColorBlind] = useSetting<boolean>("colorblind", false);
  const [keyboard, setKeyboard] = useSetting<string>(
    "keyboard",
    "qwertyuiop-asdfghjkl-BzxcvbnmE"
  );
  const [enterLeft, setEnterLeft] = useSetting<boolean>("enter-left", false);

  useEffect(() => {
    setTimeout(() => {
      // Avoid transition on page load
      document.body.style.transition = "0.3s background-color ease-out";
    }, 1);
  });

  const link = (text: string, page: Page) => (
    <a
      href="#"
      className=""
      onClick={() => setPage(page)}
    >
      {text}
    </a>
  );

  return (
    <div className={"App-container" + (colorBlind ? " color-blind" : "")}>
      <h1>
        <img src="logo.png"
          style={{
            position: "relative",
            top: "20px",
          }}
          alt={"VR"}
          aria-label={"VR"}
        ></img>
        dle
      </h1>
      <div className="top-right">
        {page !== "game" ? (
          link("Back", "game")
        ) : (
          <>
            {link("About", "about")}
          </>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: 5,
          top: 5,
          visibility: page === "game" ? "visible" : "hidden",
        }}
      >
      </div>
      {page === "about" && <div className="App-about">
        <div className="Settings">
          <div className="Settings-setting">
            <input
              id="colorblind-setting"
              type="checkbox"
              checked={colorBlind}
              onChange={() => setColorBlind((x: boolean) => !x)}
            />
            <label htmlFor="colorblind-setting">High-contrast colors</label>
          </div>
          <div className="Settings-setting">
            <select
              name="keyboard-setting"
              id="keyboard-setting"
              value={keyboard}
              onChange={(e) => setKeyboard(e.target.value)}
            >
              <option value="qwertyuiop-asdfghjkl-BzxcvbnmE">QWERTY</option>
              <option value="azertyuiop-qsdfghjklm-BwxcvbnE">AZERTY</option>
              <option value="qwertzuiop-asdfghjkl-ByxcvbnmE">QWERTZ</option>
              <option value="BpyfgcrlE-aoeuidhtns-qjkxbmwvz">Dvorak</option>
              <option value="qwfpgjluy-arstdhneio-BzxcvbkmE">Colemak</option>
            </select>
            <label htmlFor="keyboard-setting">Keyboard layout</label>
          </div>
        </div>
        <br />
        <Row
          rowState={RowState.LockedIn}
          wordLength={4}
          cluedLetters={[
            { clue: Clue.Absent, letter: "w" },
            { clue: Clue.Absent, letter: "o" },
            { clue: Clue.Correct, letter: "r" },
            { clue: Clue.Elsewhere, letter: "d" },
          ]}
        />
        <p>
          <b>W</b> and <b>O</b> aren't in the target word at all.
        </p>
        <p>
          <b className={"green-bg"}>R</b> is correct! The third letter is{" "}
          <b className={"green-bg"}>R</b>
          .<br />
          <strong>(There may still be a second R in the word.)</strong>
        </p>
        <p>
          <b className={"yellow-bg"}>D</b> occurs <em>elsewhere</em> in the target
          word.
          <br />
          <strong>(Perhaps more than once.)</strong>
        </p>
        <hr />
        <p>
          Let's move the <b>D</b> in our next guess:
        </p>
        <Row
          rowState={RowState.LockedIn}
          wordLength={4}
          cluedLetters={[
            { clue: Clue.Correct, letter: "d" },
            { clue: Clue.Correct, letter: "a" },
            { clue: Clue.Correct, letter: "r" },
            { clue: Clue.Absent, letter: "k" },
          ]}
          annotation={"So close!"}
        />
        <Row
          rowState={RowState.LockedIn}
          wordLength={4}
          cluedLetters={[
            { clue: Clue.Correct, letter: "d" },
            { clue: Clue.Correct, letter: "a" },
            { clue: Clue.Correct, letter: "r" },
            { clue: Clue.Correct, letter: "t" },
          ]}
          annotation={"Got it!"}
        />
        <hr />
        <p style={{ fontSize: "10px" }}>
          MIT License

          Copyright (c) 2022 Lynn

          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the "Software"), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:

          The above copyright notice and this permission notice shall be included in all
          copies or substantial portions of the Software.

          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
          SOFTWARE.
          <br />
          <br />
          <a href="https://github.com/lynn/hello-wordl" target="_blank" rel="noreferrer noopener">View the original source code on GitHub</a>
        </p>
      </div>}
      <Game
        maxGuesses={maxGuesses}
        hidden={page !== "game"}
        colorBlind={colorBlind}
        keyboardLayout={keyboard.replaceAll(
          /[BE]/g,
          (x) => (enterLeft ? "EB" : "BE")["BE".indexOf(x)]
        )}
      />
    </div>
  );
}

export default App;
