import React, { useEffect, useState } from "react";
import LuckyWheel from "../components/LuckyWheel";
import { ParticlesComponent } from "../components/Particles";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [prizes, setPrizes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [securityCode, setSecurityCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("securityCode") === "1234"
  );

  const API_BASE_URL = "https://koi-lottery-api.azurewebsites.net";

  const fetchPrizes = async () => {
    setIsLoading(true);
    try {
      const { data: rounds } = await axios.get(`${API_BASE_URL}/rounds`);

      const allPrizesPromises = rounds.map(async (round) => {
        const { data: prizesData } = await axios.get(
          `${API_BASE_URL}/rounds/${round.id}/prizes?excludeOutOfQuantityPrizes=true`
        );
        return prizesData.map((prize) => ({
          ...prize,
          id_round: round.id.toString(),
        }));
      });

      const allPrizes = (await Promise.all(allPrizesPromises)).flat();
      const sortedPrizes = allPrizes.sort((a, b) => a.id - b.id);

      setPrizes(sortedPrizes);
    } catch (error) {
      console.error("Error fetching prizes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPrizes();
    }
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (securityCode === "1234") {
      localStorage.setItem("securityCode", "1234");
      setIsAuthenticated(true);
      toast.success("Xác thực thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.error("Mã bảo mật không đúng!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="home-page">
      <ParticlesComponent />
      <ToastContainer />

      {!isAuthenticated && (
        <div
          style={{
            padding: "2rem",
            width: "400px",
            margin: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "12px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nhập mã bảo mật"
              variant="outlined"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              sx={{
                marginBottom: 2,
                backgroundColor: "#f5e4bd",
                borderRadius: "4px",
                "& label": { color: "#3b5b5a", fontWeight: 500 },
                "& label.Mui-focused": {
                  color: "#3b5b5a",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b5b5a",
                    borderWidth: "2px",
                  },
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              style={{
                color: "white",
                height: "48px",
                fontSize: "1.1rem",
                border: "1px solid #f5e4bd",
                backgroundColor: "#3b5b5a",
              }}
            >
              Xác nhận
            </Button>
          </form>
        </div>
      )}

      {isAuthenticated && (
        <LuckyWheel
          prizes={prizes}
          onSpinComplete={fetchPrizes}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Home;
