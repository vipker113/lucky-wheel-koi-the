import axios from "axios";
import React, { useEffect, useState } from "react";
import "./VoteResult.css";

export const VoteResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const API_BASE_URL = "https://koi-lottery-api.azurewebsites.net";

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/votes`);
      const total = data.reduce((acc, item) => acc + item.totalVotes, 0);
      setVotes(data);
      setTotalVotes(total);
    } catch (error) {
      console.error("Error fetching votes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(votes);

  return (
    <div className="vote-result-page">
      <div className="vote-container">
        <h2 className="title">Các tiết mục trình diễn</h2>
        <p className="vote-count">{totalVotes} người đã bình chọn</p>
        {isLoading ? (
          <p className="loading">Đang tải...</p>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {votes.map((item) => (
              <div key={item.performanceId} className="vote-item">
                <span className="vote-info">{item.performanceName}</span>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${item.percentage}%`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "white", padding: "8px" }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
