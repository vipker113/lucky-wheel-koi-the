import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [result, setResult] = useState([]);

  const fetchResult = async () => {
    try {
      const { data } = await axios.get(
        "https://koi-lottery-api.azurewebsites.net/results"
      );
      setResult(data);
    } catch (error) {
      console.error("Error fetching result:", error);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  return (
    <ResultContext.Provider value={{ result, fetchResult }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => useContext(ResultContext);
