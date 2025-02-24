import React, { useState, useEffect } from "react";
import "./LuckyWheel.css";
import { confetti } from "tsparticles-confetti";
import axios from "axios";
import Controls from "./CustomDropdown";
import { useResult } from "./ResultContext";
import AutoSpinCheckbox from "./AutoSpinCheckbox ";
import { Detail } from "./Detail";

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const LuckyWheel = () => {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(1);
  const [prizes, setPrizes] = useState([]);
  const [targetNum, setTargetNum] = useState("000");
  const [rolling, setRolling] = useState([false, false, false]);
  const [result, setResult] = useState(["0", "0", "0"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [stats, setStats] = useState({
    totalSpins: 0,
    remainingSpins: 0,
    winningNumbers: [],
  });
  const [spinCount, setSpinCount] = useState(0);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [winnerName, setWinnerName] = useState("");
  const [showWinner, setShowWinner] = useState(false);

  const [isAutoSpin, setIsAutoSpin] = useState(false);

  const { fetchResult } = useResult();

  const handleToggleAutoSpin = () => {
    setIsAutoSpin((prev) => !prev);
  };

  const API_BASE_URL = "https://koi-lottery-api.azurewebsites.net";

  useEffect(() => {
    fetchRounds();
  }, []);

  useEffect(() => {
    if (selectedRound) {
      fetchPrizes(selectedRound);
    }
  }, [selectedRound]);

  const fetchRounds = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/rounds`);

      setRounds(data);
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  const fetchPrizes = async (roundId) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/rounds/${roundId}/prizes`
      );

      setPrizes(data);
      setSpinCount(0);

      setStats((prev) => ({
        ...prev,
        remainingSpins: data[0]?.quantity || 0,
        totalSpins: data[0]?.quantity || 0,
      }));
    } catch (error) {
      console.error("Error fetching prizes:", error);
    }
  };

  const spinWheel = async () => {
    if (isSpinning || stats.remainingSpins <= 0) return;

    setIsSpinning(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/bingo?round=${selectedRound}&prize=${prizes[currentPrizeIndex]?.id}`
      );

      const newTargetNum = data.id.toString().padStart(3, "0");

      setSpinCount((prev) => prev + 1);

      setRolling([true, true, true]);

      const slotElements = document.querySelectorAll(".number-slot");
      slotElements.forEach((el) => {
        el.classList.add("spinning");
        el.style.transform = "translateY(0)";
        el.style.transition = "none";
      });

      const baseSpinTime = 2000;
      newTargetNum.split("").forEach((num, index) => {
        const delayStop = index * 1000;
        const totalSpinTime = baseSpinTime + delayStop;

        setTimeout(() => {
          const finalOffset = num * 160;
          const slotElement = slotElements[index];

          slotElement.classList.remove("spinning");
          slotElement.style.transition =
            "transform 1.5s cubic-bezier(0.15, 0.15, 0.25, 1)";
          slotElement.style.transform = `translateY(-${finalOffset}px)`;

          setTimeout(() => {
            setRolling((prev) => {
              const newRolling = [...prev];
              newRolling[index] = false;
              return newRolling;
            });
            setResult((prev) => {
              const newResult = [...prev];
              newResult[index] = num;
              return newResult;
            });
          }, 1500);
        }, totalSpinTime);
      });

      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setShowWinner(true);

        setStats((prev) => {
          const newRemainingSpins = prev.remainingSpins - 1;

          if (newRemainingSpins <= 0 && currentPrizeIndex < prizes.length - 1) {
            setCurrentPrizeIndex((prevIndex) => prevIndex + 1);
            setSpinCount(0);
            setIsSpinning(false);
            return {
              ...prev,
              remainingSpins: prizes[currentPrizeIndex + 1]?.quantity || 0,
            };
          }

          setIsSpinning(false);
          return {
            ...prev,
            remainingSpins: newRemainingSpins,
            winningNumbers: [...prev.winningNumbers, newTargetNum],
          };
        });
        setTargetNum(newTargetNum);
        setWinnerName(data.name);
      }, 4000);
      await fetchResult();
    } catch (error) {
      console.error("Error spinning wheel:", error);
      setIsSpinning(false);
    }
  };

  useEffect(() => {
    if (isAutoSpin && !isSpinning && stats.remainingSpins > 0) {
      const timeout = setTimeout(spinWheel, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSpinning, stats.remainingSpins]);

  return (
    <div className="lucky-wheel-container">
      <div className="lucky-wheel">
        <div className="info-container">
          <div style={{ flex: 1 }}>
            {showWinner ? (
              <div className="info-winner">
                <div className="info-winner-content">
                  Chúc mừng bạn <span>{winnerName}</span> Mã số
                  <span> {targetNum}</span> đã trúng giải
                </div>
              </div>
            ) : null}
          </div>
          <div className="btn-control">
            <Controls
              selectedRound={selectedRound}
              setSelectedRound={setSelectedRound}
              rounds={rounds}
              currentPrizeIndex={currentPrizeIndex}
              setCurrentPrizeIndex={setCurrentPrizeIndex}
              prizes={prizes}
            />
            <div className="spin-container">
              <div className="spin-status">
                <button
                  className="spin-button"
                  onClick={spinWheel}
                  disabled={isSpinning || stats.remainingSpins <= 0}
                >
                  <span>Quay</span>
                  <span style={{ fontSize: "16px" }}>
                    {spinCount}/{prizes[currentPrizeIndex]?.quantity || 0}
                  </span>
                </button>
              </div>
              <AutoSpinCheckbox onChange={handleToggleAutoSpin} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div className="number-container">
            {result.map((num, index) => (
              <div key={index} className="number-wrapper">
                <div
                  className="number-slot"
                  style={{
                    transform: rolling[index]
                      ? "none"
                      : "translateY(-" + num * 160 + "px)",
                  }}
                >
                  {numbers.map((n) => (
                    <div key={n} className="number">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Detail
        currentRound={rounds.find((round) => round.id === selectedRound)}
      />
    </div>
  );
};

export default LuckyWheel;
