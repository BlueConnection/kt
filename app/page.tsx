"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Keycap from "./components/keycap/Keycap";
import { generateRandomSequence } from "./helpers";
import { Roboto_Mono } from "next/font/google";
import useLocalStorageState from "use-local-storage-state";
import { useTimer } from "react-timer-hook";
import "./page.css";
import {
  LossByLetGoInformation,
  LossByTimeInformation,
  LossByWrongInputInformation,
} from "./types";
import {
  BEGINNING_LENGTH,
  BEGINNING_LEVEL,
  BEGINNING_TIMER,
} from "./constants";

const robotoMono = Roboto_Mono({
  weight: "400",
  subsets: ["latin"],
});

const App = () => {
  const [currentLevel, setCurrentLevel] = useState(BEGINNING_LEVEL);
  const [currentLength, setCurrentLength] = useState(BEGINNING_LENGTH);
  const [currentInput, setCurrentInput] = useState("");
  const [currentSequence, setCurrentSequence] = useState("");
  const [isLevelStarted, setIsLevelStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(BEGINNING_TIMER);
  const [lossByLetGo, setLossByLetGo] = useState<LossByLetGoInformation | null>(
    null
  );
  const [lossByWrongInput, setLossByWrongInput] =
    useState<LossByWrongInputInformation | null>(null);
  const [lossByTime, setLossByTime] = useState<LossByTimeInformation | null>(
    null
  );
  const [lastEnteredKey, setLastEnteredKey] = useState("");
  const [highScore, setHighScore] = useLocalStorageState("highScore", {
    defaultValue: 0,
  });
  const { seconds, restart } = useTimer({
    expiryTimestamp: (() => {
      const time = new Date();

      time.setSeconds(time.getSeconds() + BEGINNING_TIMER);

      return time;
    })(),
    autoStart: false,
    onExpire: () => {
      const time = new Date();

      time.setSeconds(time.getSeconds() + BEGINNING_TIMER);

      restart(time, false);

      setLossByTime({
        level: currentLevel,
        sequence: currentSequence,
      });
      setIsLevelStarted(false);
      setCurrentLevel(BEGINNING_LEVEL);
      setCurrentInput("");
      setCurrentSequence(generateRandomSequence(currentLength));
    },
  });

  const keycaps = useMemo(
    () =>
      currentSequence.split("").map((c) => {
        return (
          <Keycap
            key={crypto.randomUUID()}
            character={c.toUpperCase()}
            isPressed={currentInput.includes(c)}
          />
        );
      }),
    [currentSequence, currentInput]
  );

  const onKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      setLastEnteredKey(event.key);

      if (!isLevelStarted && event.key === "Enter") {
        setLossByLetGo(null);
        setLossByWrongInput(null);
        setLossByTime(null);
        setCurrentInput("");
        setIsLevelStarted(true);

        const time = new Date();

        time.setSeconds(time.getSeconds() + timerSeconds);

        restart(time, true);
      }

      if (!isLevelStarted) {
        return;
      }

      if (event.repeat) {
        return;
      }

      setCurrentInput((prev) => prev + event.key);
    },
    [isLevelStarted, restart, timerSeconds]
  );

  const onKeyUp = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (
        isLevelStarted &&
        currentInput !== currentSequence &&
        event.key !== "Enter"
      ) {
        const time = new Date();

        time.setSeconds(time.getSeconds() + BEGINNING_TIMER);

        restart(time, false);

        setIsLevelStarted(false);
        setCurrentLevel(BEGINNING_LEVEL);
        setCurrentInput("");
        setCurrentSequence(generateRandomSequence(currentLength));
        setLossByLetGo({
          level: currentLevel,
          sequence: currentSequence,
          character: event.key,
        });
      }
    },
    [
      currentInput,
      currentLength,
      currentSequence,
      isLevelStarted,
      restart,
      currentLevel,
    ]
  );

  // KEY COUNT INCREASES
  useEffect(() => {
    switch (currentLevel) {
      case 1:
        setCurrentLength(BEGINNING_LENGTH); // 3
        setTimerSeconds(BEGINNING_TIMER); // 5
        break;
      case 5:
        setCurrentLength((prev) => ++prev); // 4
        setTimerSeconds((prev) => ++prev); // 6
        break;
      case 15:
        setCurrentLength((prev) => ++prev); // 5
        setTimerSeconds((prev) => prev + 2); // 8
        break;
      case 30:
        setCurrentLength((prev) => ++prev); // 6
        setTimerSeconds((prev) => prev + 2); // 10
        break;
      case 50:
        setCurrentLength((prev) => ++prev); // 7
        setTimerSeconds((prev) => prev + 2); // 12
        break;
      case 75:
        setCurrentLength((prev) => ++prev); // 8
        setTimerSeconds((prev) => ++prev); // 13
        break;
      case 105:
        setCurrentLength((prev) => ++prev); // 9
        setTimerSeconds((prev) => ++prev); // 14
        break;
      case 140:
        setCurrentLength((prev) => ++prev); // 10
        setTimerSeconds((prev) => ++prev); // 15
        break;
      case 145:
        setCurrentLength((prev) => ++prev); // 11
        setTimerSeconds((prev) => ++prev); // 16
        break;
      case 150:
        setCurrentLength((prev) => ++prev); // 12
        setTimerSeconds((prev) => ++prev); // 17
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
      const time = new Date();

      time.setSeconds(time.getSeconds() + BEGINNING_TIMER);

      restart(time, false);

      setLossByWrongInput({
        level: currentLevel,
        sequence: currentSequence,
        character: lastEnteredKey,
        expectedCharacter:
          currentSequenceToCompare[currentSequenceToCompare.length - 1],
      });
      setIsLevelStarted(false);
      setCurrentLevel(BEGINNING_LEVEL);
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

      const time = new Date();

      time.setSeconds(time.getSeconds() + timerSeconds);

      restart(time, false);

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
    restart,
    timerSeconds,
    lastEnteredKey,
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
        <div className="flex flex-col justify-center items-center gap-20 h-[calc(100%-20px)]">
          <div className="invisible text-xl">{seconds}</div>
          <div className="flex flex-row gap-4">{keycaps}</div>
          <div className="text-xl">{seconds}</div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-20 h-[calc(100%-20px)]">
          {currentLevel === 1 && (
            <div className="flex flex-col justify-center items-center">
              {lossByLetGo && (
                <div className="mb-20 text-red-400">
                  You lost on level {lossByLetGo.level} by letting go of{" "}
                  {lossByLetGo.character.toUpperCase()} in{" "}
                  {lossByLetGo.sequence.toUpperCase()}.
                </div>
              )}
              {lossByWrongInput && (
                <div className="mb-20 text-red-400">
                  You lost on level {lossByWrongInput.level} by pressing{" "}
                  {lossByWrongInput.character.toUpperCase()} instead of{" "}
                  {lossByWrongInput.expectedCharacter.toUpperCase()} in{" "}
                  {lossByWrongInput.sequence.toUpperCase()}.
                </div>
              )}
              {lossByTime && (
                <div className="mb-20 text-red-400">
                  You lost on level {lossByTime.level} by running out of time
                  finishing {lossByTime.sequence.toUpperCase()}.
                </div>
              )}
              <div className="mb-5">RULES:</div>
              <div className="mr-auto">
                - Enter each key you see from left to right while not letting go
                of any of them before the time runs out.
              </div>
              <div className="mr-auto">
                - If needed, feel free to use other parts of your body other
                than your fingers.
              </div>
              <div className="mr-auto">
                - Be one with your keeb and have fun.
              </div>
            </div>
          )}
          <div className="blink">PRESS ENTER TO START LEVEL {currentLevel}</div>
        </div>
      )}
    </div>
  );
};

export default App;
