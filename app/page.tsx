"use client";

import { useCallback, useEffect, useState } from "react";
import Keycap from "./components/keycap/Keycap";
import { generateRandomSequence } from "./helpers";

const App = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLength, setCurrentLength] = useState(3);
  const [currentInput, setCurrentInput] = useState("");
  const [currentSequence, setCurrentSequence] = useState("");
  const [isLevelStarted, setIsLevelStarted] = useState(false);

  const keycaps = currentSequence.split("").map((c) => {
    return <Keycap key={crypto.randomUUID()} character={c.toUpperCase()} />;
  });

  const onKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (!isLevelStarted && event.key === "Enter") {
        setCurrentInput("");
        setIsLevelStarted(true);
      } else {
        if (event.repeat) {
          return;
        }

        setCurrentInput((prev) => prev + event.key);
      }
    },
    [isLevelStarted]
  );

  useEffect(() => {
    // LOSE BY WRONG INPUT
    const currentSequenceToCompare = currentSequence.substring(
      0,
      currentInput.length
    );

    if (currentInput !== currentSequenceToCompare) {
      setIsLevelStarted(false);
      setCurrentLevel(1);
      setCurrentInput("");
      setCurrentSequence(generateRandomSequence(currentLength));
    }

    console.log("currentSequenceToCompare", currentSequenceToCompare);
    console.log("currentInput", currentInput);

    // WIN
    if (
      currentSequence.length === currentLength &&
      currentInput === currentSequence
    ) {
      setIsLevelStarted(false);
      setCurrentLevel((prev) => ++prev);
      setCurrentInput("");
      setCurrentSequence(generateRandomSequence(currentLength));
    }
  }, [currentInput, currentSequence, currentLength, currentLevel]);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    setCurrentSequence(generateRandomSequence(currentLength));
  }, [currentLength]);

  return (
    <>
      <div>
        <div className="flex justify-end pr-4 mt-4">- WORK IN PROGRESS -</div>
        {isLevelStarted && (
          <div className="flex flex-col justify-center items-center">
            <h2>Level</h2>
            <div>{currentLevel}</div>
          </div>
        )}
      </div>
      {isLevelStarted ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-row gap-4">{keycaps}</div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen gap-20">
          {currentLevel === 1 && (
            <div className="flex flex-col justify-center items-center">
              <div>Rules:</div>
              <div>
                - Enter each key you see from left to right while not letting go
                of any of them.
              </div>
              <div>
                - If needed, feel free to use other parts of your body other
                than your fingers.
              </div>
            </div>
          )}
          <div>PRESS ENTER TO START</div>
        </div>
      )}
    </>
  );
};

export default App;
