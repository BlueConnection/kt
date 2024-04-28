"use client";

import { useCallback, useEffect, useState } from "react";
import Keycap from "./components/keycap/Keycap";
import { generateRandomSequence } from "./helpers";
import { Roboto_Mono } from "next/font/google";

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

  const keycaps = currentSequence.split("").map((c) => {
    return <Keycap key={crypto.randomUUID()} character={c.toUpperCase()} />;
  });

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

  useEffect(() => {
    setCurrentSequence(generateRandomSequence(currentLength));
  }, [currentLength]);

  return (
    <div className={`${robotoMono.className} h-full`}>
      <div className="flex flex-row justify-between">
        <div className="invisible">Version 1.0.0</div>

        <div className={isLevelStarted ? "" : "invisible"}>
          Level {currentLevel}
        </div>
        <div>Version 1.0.0</div>
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
          <div>Press enter to start level {currentLevel}</div>
        </div>
      )}
    </div>
  );
};

export default App;
