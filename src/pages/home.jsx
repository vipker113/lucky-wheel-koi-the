import React from "react";
import LuckyWheel from "../components/LuckyWheel";
import { ParticlesComponent } from "../components/Particles";

const Home = () => {
  return (
    <div className="home-page">
      <ParticlesComponent />
      <LuckyWheel />
    </div>
  );
};

export default Home;
