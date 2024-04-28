"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Keycap from "./components/keycap/Keycap";
import { generateRandomSequence } from "./helpers";
import { Roboto_Mono } from "next/font/google";
import useLocalStorageState from "use-local-storage-state";

const robotoMono = Roboto_Mono({
  weight: "400",
  subsets: ["latin"],
});

const App = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLength, setCurrentLength] = useState(3);
  const [currentInput, setCurrentInput] = useState("");
  const [currentSequence, setCurrentSequence] = useState("");
  const [isLevelStarted, setIsLevelStarted] = useState(false);
  const [highScore, setHighScore] = useLocalStorageState("highScore", {
    defaultValue: 0,
  });

  const keycaps = useMemo(
    () =>
      currentSequence.split("").map((c) => {
        return <Keycap key={crypto.randomUUID()} character={c.toUpperCase()} />;
      }),
    [currentSequence]
  );

  const onKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (!isLevelStarted && event.key === "Enter") {
        setCurrentInput("");
        setIsLevelStarted(true);
      }

      if (!isLevelStarted) {
        return;
      }

      if (event.repeat) {
        return;
      }

      setCurrentInput((prev) => prev + event.key);
    },
    [isLevelStarted]
  );

  const onKeyUp = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (
        isLevelStarted &&
        currentInput !== currentSequence &&
        event.key !== "Enter"
      ) {
        setIsLevelStarted(false);
        setCurrentLevel(1);
        setCurrentInput("");
        setCurrentSequence(generateRandomSequence(currentLength));
      }
    },
    [currentInput, currentLength, currentSequence, isLevelStarted]
  );

  // KEY COUNT INCREASES
  useEffect(() => {
    switch (currentLevel) {
      case 5:
        setCurrentLength((prev) => ++prev); // 4
        break;
      case 15:
        setCurrentLength((prev) => ++prev); // 5
        break;
      case 30:
        setCurrentLength((prev) => ++prev); // 6
        break;
      case 50:
        setCurrentLength((prev) => ++prev); // 7
        break;
      case 75:
        setCurrentLength((prev) => ++prev); // 8
        break;
      case 105:
        setCurrentLength((prev) => ++prev); // 9
        break;
      case 140:
        setCurrentLength((prev) => ++prev); // 10
        break;
      case 145:
        setCurrentLength((prev) => ++prev); // 11
        break;
      case 150:
        setCurrentLength((prev) => ++prev); // 12
        break;
      default:
        break;
    }
  }, [currentLevel]);

  // INPUT TYPE WIN & LOSE CONDITIONS
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

    // WIN LEVEL
    if (
      currentSequence.length === currentLength &&
      currentInput === currentSequence
    ) {
      if (currentLevel > highScore) {
        setHighScore(currentLevel);
      }

      setIsLevelStarted(false);
      setCurrentLevel((prev) => ++prev);
      setCurrentInput("");
      setCurrentSequence(generateRandomSequence(currentLength));
    }
  }, [
    currentInput,
    currentSequence,
    currentLength,
    currentLevel,
    highScore,
    setHighScore,
  ]);

  // ADD & REMOVE EVENT HANDLERS
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    if (isLevelStarted) {
      document.addEventListener("keyup", onKeyUp);
    } else {
      document.removeEventListener("keyup", onKeyUp);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [isLevelStarted, onKeyDown, onKeyUp]);

  // FIX HYDRATION ISSUE
  useEffect(() => {
    setCurrentSequence(generateRandomSequence(currentLength));
  }, [currentLength]);

  return (
    <div className={`${robotoMono.className} h-full`}>
      <div className="flex flex-row justify-between">
        <div className="invisible">HIGH SCORE: {highScore}</div>

        <div className={isLevelStarted ? "" : "invisible"}>
          LEVEL {currentLevel}
        </div>
        <div>HIGH SCORE: {highScore}</div>
      </div>
      {isLevelStarted ? (
        <div className="flex flex-col justify-center items-center h-[calc(100%-20px)]">
          <div className="flex flex-row gap-4">{keycaps}</div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-20 h-[calc(100%-20px)]">
          {currentLevel === 1 && (
            <div className="flex flex-col justify-center items-center">
              <div className="mb-5">Rules:</div>
              <div className="mr-auto">
                - Enter each key you see from left to right while not letting go
                of any of them.
              </div>
              <div className="mr-auto">
                - If needed, feel free to use other parts of your body other
                than your fingers.
              </div>
            </div>
          )}
          <div>PRESS ENTER TO START LEVEL {currentLevel}</div>
        </div>
      )}
    </div>
  );
};

export default App;
