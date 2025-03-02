import React, { useEffect, useState } from "react";
import "./LuckyWheel.css";
import { confetti } from "tsparticles-confetti";
import axios from "axios";
import useWindowSize from "../hook/useWindowSize";
import CustomDropDown from "./CustomDropdown";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FileText, Gift, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LuckyWheel = ({ prizes, onSpinComplete, isLoading }) => {
  const [selectedPrize, setSelectedPrize] = useState(prizes[0]);
  const [targetNum, setTargetNum] = useState("000");
  const [result, setResult] = useState(["4", "3", "0"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(selectedPrize?.drawnQuantity || 0);
  const [winnerName, setWinnerName] = useState("");
  const [showWinner, setShowWinner] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [spinResults, setSpinResults] = useState([]);
  const [currentSpinPrize, setCurrentSpinPrize] = useState(null);

  const navigate = useNavigate();

  const API_BASE_URL = "https://koi-lottery-api.azurewebsites.net";

  useEffect(() => {
    const availablePrize = prizes.find(
      (prize) => prize.drawnQuantity < prize.quantity
    );
    if (availablePrize) {
      setSelectedPrize(availablePrize);
      setSpinCount(availablePrize.drawnQuantity);
    }
  }, [prizes]);

  const spinWheel = async () => {
    if (isSpinning || !selectedPrize) return;
    setIsSpinning(true);
    setCurrentSpinPrize(selectedPrize);

    const remainingSpins = selectedPrize.quantity - spinCount;
    let allResults = [];
    let lastResult;

    const animationInterval = 20;
    const fakeAnimations = [null, null, null];

    fakeAnimations.forEach((_, index) => {
      fakeAnimations[index] = setInterval(() => {
        setResult((prev) => {
          const newResult = [...prev];
          newResult[index] = Math.floor(Math.random() * 10).toString();
          return newResult;
        });
      }, animationInterval);
    });

    try {
      for (let i = 0; i < remainingSpins; i++) {
        const { data } = await axios.post(
          `${API_BASE_URL}/bingo?round=${selectedPrize.id_round}&prize=${selectedPrize.id}`
        );
        allResults.push(data);
        lastResult = data;
        setSpinCount((prev) => prev + 1);
      }

      fakeAnimations.forEach((interval) => clearInterval(interval));

      const newTargetNum = lastResult.id.toString().padStart(3, "0");
      const animations = [null, null, null];

      newTargetNum.split("").forEach((_, index) => {
        animations[index] = setInterval(() => {
          setResult((prev) => {
            const newResult = [...prev];
            newResult[index] = Math.floor(Math.random() * 10).toString();
            return newResult;
          });
        }, animationInterval);
      });

      newTargetNum.split("").forEach((targetDigit, index) => {
        const stopDelay = 2000 + index * 1000;
        setTimeout(() => {
          clearInterval(animations[index]);
          setResult((prev) => {
            const newResult = [...prev];
            newResult[index] = targetDigit;
            return newResult;
          });
        }, stopDelay);
      });

      setTimeout(async () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setShowWinner(true);
        setTargetNum(newTargetNum);
        setWinnerName(lastResult.name);
        setIsSpinning(false);
        setSpinResults(allResults);
        if (selectedPrize.quantity !== 1) {
          setShowStatsModal(true);
        }

        await onSpinComplete();
        setSelectedPrize(prizes[0]);
        setSpinCount(prizes[0]?.drawnQuantity || 0);
      }, 4000);
    } catch (error) {
      console.error("Error spinning wheel:", error);
      fakeAnimations.forEach((interval) => clearInterval(interval));
      setIsSpinning(false);
    }
  };

  const { width, height } = useWindowSize();
  const widthNumber = width / 7;
  const heightNumber = height / 3.5;

  return (
    <div className="lucky-wheel-container">
      <div className="lucky-wheel">
        <div className="info-container">
          <div style={{ flex: 1 }}>
            {showWinner && (
              <div className="info-winner">
                <div className="info-winner-content">
                  Chúc mừng bạn <span>{winnerName}</span> Mã số
                  <span> {targetNum}</span> đã trúng giải
                </div>
              </div>
            )}
          </div>
          <div className="btn-control">
            <CustomDropDown
              prizes={prizes}
              selectedPrize={selectedPrize}
              setSelectedPrize={setSelectedPrize}
              onPrizeSelect={setSelectedPrize}
              isLoading={isLoading}
              isSpinning={isSpinning}
            />
            <div className="spin-container">
              <div className="spin-status">
                <button
                  className="spin-button"
                  onClick={spinWheel}
                  disabled={
                    isSpinning ||
                    !selectedPrize ||
                    spinCount >= selectedPrize.quantity
                  }
                >
                  <span>Quay</span>
                  <span style={{ fontSize: "16px" }}>
                    {spinCount}/{selectedPrize?.quantity || 0}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="number-container">
          {result.map((num, index) => (
            <div
              key={index}
              className="number-wrapper"
              style={{ width: widthNumber, height: heightNumber }}
            >
              <div className="number">{num}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="detail-container">
        <div className="detail-icon" onClick={() => navigate("/result")}>
          <Gift />
        </div>
        <div className="detail-icon" onClick={() => setShowStatsModal(true)}>
          <FileText />
        </div>
      </div>
      <Dialog
        open={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
          transition: { duration: 0.3 },
          style: {
            backgroundColor: "#f5e4bd",
            color: "#3b5b5a",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            backgroundColor: "#ebd6a5",
            borderRadius: "12px",
            padding: "12px 20px",
          }}
        >
          Kết quả quay thưởng:
          <strong style={{ color: "#a74844" }}>{currentSpinPrize?.name}</strong>
          <IconButton
            onClick={() => setShowStatsModal(false)}
            sx={{ color: "#a74844" }}
          >
            <X size={24} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ marginTop: "16px" }}>
          {spinResults.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                overflow: "auto",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["STT", "Mã số", "Tên nhân viên", "Giải thưởng"].map(
                      (text, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            fontWeight: "bold",
                            color: "white",
                            backgroundColor: "#3b5b5a",
                            textAlign: "center",
                            padding: "12px",
                          }}
                        >
                          {text}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {spinResults.map((result, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: "white",
                      }}
                    >
                      {[
                        index + 1,
                        result.id.toString().padStart(3, "0"),
                        result.name,
                        currentSpinPrize?.name,
                      ].map((text, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          {text}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Chưa có kết quả cho vòng quay này.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LuckyWheel;
