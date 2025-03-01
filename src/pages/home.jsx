import React, { useEffect, useState } from "react";
import LuckyWheel from "../components/LuckyWheel";
import { ParticlesComponent } from "../components/Particles";
import axios from "axios";

const Home = () => {
  const [prizes, setPrizes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setPrizes(allPrizes);
    } catch (error) {
      console.error("Error fetching prizes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);
  return (
    <div className="home-page">
      <ParticlesComponent />
      <LuckyWheel
        prizes={prizes}
        onSpinComplete={fetchPrizes}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;
