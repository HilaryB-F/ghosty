import "./App.scss";
import { useEffect, useState } from "react";
import Ghost from "./assets/Ghost.gif";

function App() {
  const GAME_HEIGHT = 500;
  const GAME_WIDTH = 500;
  const GHOST_HEIGHT = 25;
  const GRAVITY = 6;
  const JUMP_HEIGHT = 50;
  const BRANCH_WIDTH = 80;
  const BRANCH_GAP = 100;

  const [ghostPosition, setGhostPosition] = useState(250);
  const [gameStart, setGameStart] = useState(false);
  const [branchHeight, setBranchHeight] = useState(100);
  const [branchLeft, setBranchLeft] = useState(500);
  const [score, setScore] = useState(0);

  const branchBottomHeight = GAME_HEIGHT - BRANCH_GAP - branchHeight;

  useEffect(() => {
    let timeId;
    if (gameStart && ghostPosition < GAME_HEIGHT - GHOST_HEIGHT) {
      timeId = setInterval(() => {
        setGhostPosition((ghostPosition) => ghostPosition + GRAVITY);
      }, 24);
    }
    return () => {
      clearInterval(timeId);
    };
  }, [ghostPosition, gameStart]);

  useEffect(() => {
    let branchId;
    if (gameStart && branchLeft >= -BRANCH_WIDTH) {
      branchId = setInterval(() => {
        setBranchLeft((branchLeft) => branchLeft - 8);
      }, 24);
      return () => {
        clearInterval(branchId);
      };
    } else {
      setBranchLeft(GAME_WIDTH - BRANCH_WIDTH);
      setBranchHeight(Math.floor(Math.random() * (GAME_HEIGHT - BRANCH_GAP)));
      setScore ((score) => score + 1)
    }
  }, [branchLeft, gameStart]);

  useEffect(() => {
    const hasHit = ghostPosition >= 0 && ghostPosition < branchHeight;
    const hasHitBottom =
      ghostPosition <= 500 && ghostPosition >= 500 - branchBottomHeight;

    if (
      branchLeft >= 0 &&
      branchLeft <= BRANCH_WIDTH &&
      (hasHit || hasHitBottom)
    )
      setGameStart(false);
  }, [ghostPosition, branchHeight, branchBottomHeight, branchLeft]);

  const handleClick = () => {
    let newGhostPosition = ghostPosition - JUMP_HEIGHT;
    if (!gameStart) {
      setGameStart(true);
    }
    if (newGhostPosition < 0) {
      setGhostPosition(0);
    } else {
      setGhostPosition(newGhostPosition);
    }
  };

  return (
    <>
      <div className="game__container">
        <div
          className="game__box"
          onClick={handleClick}
          style={{ height: `${GAME_HEIGHT}px`, width: `${GAME_WIDTH}px` }}
        >
          <svg
            className="imgbranch"
            style={{
              position: "relative",
              top: 0,
              height: `${branchHeight}px`,
              left: `${branchLeft}px`,
            }}
          />
          <svg
            className="bottom"
            style={{
              position: "relative",
              top: `${GAME_HEIGHT - (branchHeight + branchBottomHeight)}`,
              height: `${branchBottomHeight}px`,
              left: `${branchLeft}px`,
            }}
          />
          <img
            src={Ghost}
            alt="Ghost"
            className="ghost"
            style={{
              top: `${ghostPosition}px`,
            }}
          />
          
        </div>
      </div>
      <button
        className="button"
        onClick={() => {
          setGameStart(false);
          setGhostPosition(250);
        }}
      >
        Pause
      </button>
      <span className="score">{score}</span>
    </>
  );
}
export default App;
