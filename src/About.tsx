import { Clue } from "./clue";
import { Row, RowState } from "./Row";
import { gameName, maxGuesses } from "./util";

export function About() {
  return (
    <div className="App-about">
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
        <a href="https://github.com/lynn/hello-wordl" target="_blank" rel="noopener">Browse the original source code on GitHub</a>
      </p>
    </div>
  );
}
