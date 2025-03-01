import React from "react";
import { Helmet } from "react-helmet";
import { ResultProvider } from "./components/ResultContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Result from "./pages/result";
import { Vote } from "./pages/vote";
import { VoteResult } from "./pages/vote-result";

const Component = () => {
  return (
    <ResultProvider>
      <div className="container">
        <Helmet>
          <title>KOI Thé</title>
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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/vote-result" element={<VoteResult />} />
        </Routes>
      </div>
    </ResultProvider>
  );
};

export default Component;
