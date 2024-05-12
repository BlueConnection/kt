"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Keycap from "./components/keycap/Keycap";
import { generateRandomSequence } from "./helpers";
import { Roboto_Mono } from "next/font/google";
import useLocalStorageState from "use-local-storage-state";
import { ColorHex, CountdownCircleTimer } from "react-countdown-circle-timer";
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
import { themeChange } from "theme-change";

const robotoMono = Roboto_Mono({
  weight: "400",
  subsets: ["latin"],
});

const colors: { 0: ColorHex } & { 1: ColorHex } & ColorHex[] = [
  "#5BFF65",
  "#FCFF2E",
  "#FFA21A",
  "#FF1616",
  "#000000",
];

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
  const [theme, setTheme] = useLocalStorageState("theme", {
    defaultValue: "default",
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

  const colorsTime = useMemo<{ 0: number } & { 1: number } & number[]>(() => {
    const increment = Math.floor(timerSeconds / 5);

    const stageTwo = increment * 4;
    const stageThree = increment * 3;
    const stageFour = increment * 2;

    return [timerSeconds, stageTwo, stageThree, stageFour, 0];
  }, [timerSeconds]);

  const onKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      setLastEnteredKey(event.key);

      if (!isLevelStarted && event.key === "Enter") {
        setLossByLetGo(null);
        setLossByWrongInput(null);
        setLossByTime(null);
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
    [currentInput, currentLength, currentSequence, isLevelStarted, currentLevel]
  );

  const onComplete = useCallback(() => {
    setLossByTime({
      level: currentLevel,
      sequence: currentSequence,
    });
    setIsLevelStarted(false);
    setCurrentLevel(BEGINNING_LEVEL);
    setCurrentInput("");
    setCurrentSequence(generateRandomSequence(currentLength));
  }, [currentLength, currentLevel, currentSequence]);

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

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className={`${robotoMono.className} h-full`}>
      <div className="flex flex-row justify-between">
        <div
          className={isLevelStarted ? "dropdown invisible w-32" : "dropdown"}
        >
          <div tabIndex={0} role="button" className="btn !text-base">
            Theme
            <svg
              width="12px"
              height="12px"
              className="h-2 w-2 fill-current opacity-60 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 mt-1"
          >
            <li>
              <input
                data-set-theme="default"
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Default"
                value="default"
                checked={theme === "default"}
                onChange={() => {
                  setTheme("default");
                }}
              />
            </li>
            <li>
              <input
                data-set-theme="light"
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Light"
                value="light"
                checked={theme === "light"}
                onChange={() => {
                  setTheme("light");
                }}
              />
            </li>
            <li>
              <input
                data-set-theme="dark"
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dark"
                value="dark"
                checked={theme === "dark"}
                onChange={() => {
                  setTheme("dark");
                }}
              />
            </li>
            <li>
              <input
                data-set-theme="coffee"
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Coffee"
                value="coffee"
                checked={theme === "coffee"}
                onChange={() => {
                  setTheme("coffee");
                }}
              />
            </li>
          </ul>
        </div>
        {isLevelStarted && <div>LEVEL {currentLevel}</div>}
        <div className="w-32">HIGH SCORE: {highScore}</div>
      </div>
      {isLevelStarted ? (
        <div className="flex flex-col justify-center items-center gap-20 h-[calc(100%-20px)]">
          <div className="invisible">
            <CountdownCircleTimer
              isPlaying={isLevelStarted}
              duration={timerSeconds}
              colors={colors}
              colorsTime={colorsTime}
              onComplete={onComplete}
              size={100}
            />
          </div>
          <div className="flex flex-row gap-4">{keycaps}</div>
          <div>
            <CountdownCircleTimer
              isPlaying={isLevelStarted}
              duration={timerSeconds}
              colors={colors}
              colorsTime={colorsTime}
              onComplete={onComplete}
              size={100}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-20 h-[calc(100%-20px)]">
          {currentLevel === 1 && (
            <div className="flex flex-col justify-center items-center">
              {lossByLetGo && (
                <div className="text-red-400">
                  You lost on level {lossByLetGo.level} by letting go of{" "}
                  {lossByLetGo.character.toUpperCase()} in{" "}
                  {lossByLetGo.sequence.toUpperCase()}.
                </div>
              )}
              {lossByWrongInput && (
                <div className="text-red-400">
                  You lost on level {lossByWrongInput.level} by pressing{" "}
                  {lossByWrongInput.character.toUpperCase()} instead of{" "}
                  {lossByWrongInput.expectedCharacter.toUpperCase()} in{" "}
                  {lossByWrongInput.sequence.toUpperCase()}.
                </div>
              )}
              {lossByTime && (
                <div className="text-red-400">
                  You lost on level {lossByTime.level} by running out of time
                  finishing {lossByTime.sequence.toUpperCase()}.
                </div>
              )}
              {!lossByLetGo && !lossByTime && !lossByWrongInput && (
                <>
                  <div className="mb-5">RULES:</div>
                  <div className="mr-auto">
                    - Enter each key you see from left to right while not
                    letting go of any of them before the time runs out.
                  </div>
                  <div className="mr-auto">
                    - If needed, feel free to use other parts of your body other
                    than your fingers.
                  </div>
                  <div className="mr-auto">
                    - Be one with your keeb and have fun.
                  </div>
                </>
              )}
            </div>
          )}
          <div className="blink">PRESS ENTER TO START LEVEL {currentLevel}</div>
        </div>
      )}
    </div>
  );
};

export default App;
