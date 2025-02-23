import React from "react";
import LuckyWheel from "./components/LuckyWheel";
import { ParticlesComponent } from "./components/Particles";
import { Detail } from "./components/Detail";
import { Helmet } from "react-helmet";
import { ResultProvider } from "./components/ResultContext";

const Component = () => {
  return (
    <ResultProvider>
      <div className="container">
        <Helmet>
          <title>Koi Thé</title>
          <link
            rel="icon"
            type="image/png"
            href="assets/favicon/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="assets/favicon/favicon.svg"
          />
          <link rel="shortcut icon" href="assets/favicon/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Helmet>
        <ParticlesComponent />
        <LuckyWheel />
        <Detail />
      </div>
    </ResultProvider>
  );
};

export default Component;
