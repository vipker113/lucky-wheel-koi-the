import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://koi-lottery-api.azurewebsites.net";

const LotteryResults = () => {
  const [rounds, setRounds] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");
  const [selectedPrize, setSelectedPrize] = useState("all");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedRound) {
      fetchPrizes(selectedRound);
      fetchResults(selectedRound);
    }
  }, [selectedRound]);

  useEffect(() => {
    filterResults();
  }, [selectedPrize]);

  const fetchRounds = async () => {
    try {
      setIsLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 4000));
      const { data } = await axios.get(`${API_BASE_URL}/rounds`);
      setRounds([{ id: "all", name: "Tất cả các giải" }, ...data]);
      if (data.length > 0) setSelectedRound("all");
    } catch (error) {
      console.error("Error fetching rounds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrizes = async (roundId) => {
    try {
      setIsLoading(true);
      if (roundId === "all") {
        const allPrizes = new Set();
        const promises = rounds
          .filter((round) => round.id !== "all")
          .map((round) =>
            axios
              .get(`${API_BASE_URL}/rounds/${round.id}/prizes`)
              .then(({ data }) => data)
          );

        const results = await Promise.all(promises);
        results.forEach((prizes) => {
          prizes.forEach((prize) => {
            allPrizes.add(JSON.stringify(prize));
          });
        });

        const uniquePrizes = Array.from(allPrizes).map((prize) =>
          JSON.parse(prize)
        );
        setPrizes([{ id: "all", name: "Tất cả sản phẩm" }, ...uniquePrizes]);
      } else {
        const { data } = await axios.get(
          `${API_BASE_URL}/rounds/${roundId}/prizes`
        );
        setPrizes([{ id: "all", name: "Tất cả sản phẩm" }, ...data]);
      }
      setSelectedPrize("all");
    } catch (error) {
      console.error("Error fetching prizes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResults = async (roundId) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/results`);
      const filtered =
        roundId === "all"
          ? data
          : data.filter((item) => item.roundId === roundId);
      setResults(filtered);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = () => {
    if (selectedPrize === "all") return results;
    return results.filter((res) => res.prizeId === selectedPrize);
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsInitialLoading(true);
      await fetchRounds();
      setIsInitialLoading(false);
    };
    initializeData();
  }, []);

  return (
    <div className="result-page">
      {isInitialLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <div className="result-container">
          <h1>THỐNG KÊ QUAY THƯỞNG</h1>
          <Box sx={{ p: 2 }}>
            <div
              style={{
                display: "flex",
                marginBottom: "16px",
                gap: "16px",
                width: "100%",
              }}
            >
              <FormControl style={{ flex: 1 }}>
                <Select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: "8px",
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "white",
                      },
                    },
                  }}
                >
                  {rounds.map((round) => (
                    <MenuItem key={round.id} value={round.id}>
                      {round.id === "all" ? round.name : `Giải ${round.name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl style={{ flex: 2 }}>
                <Select
                  value={selectedPrize}
                  onChange={(e) => setSelectedPrize(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: "8px",
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "white",
                      },
                    },
                  }}
                >
                  {prizes.map((prize) => (
                    <MenuItem key={prize.id} value={prize.id}>
                      {prize.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress />
              </Box>
            ) : filterResults().length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 500, overflow: "auto", borderRadius: "8px" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>STT</b>
                      </TableCell>
                      <TableCell>
                        <b>Mã nhân viên</b>
                      </TableCell>
                      <TableCell>
                        <b>Tên nhân viên</b>
                      </TableCell>
                      <TableCell>
                        <b>Số điện thoại</b>
                      </TableCell>
                      <TableCell>
                        <b>Giải thưởng</b>
                      </TableCell>
                      <TableCell>
                        <b>Thời gian</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterResults().map((res, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{res.employeeId}</TableCell>
                        <TableCell>{res.employeeName}</TableCell>
                        <TableCell>{res.employeePhone}</TableCell>
                        <TableCell style={{ width: "250px" }}>
                          {res.prize}
                        </TableCell>
                        <TableCell>
                          {new Date(res.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ mt: 2, color: "white" }}
              >
                Chưa có kết quả cho giải thưởng này
              </Typography>
            )}
          </Box>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
        className="detail-icon"
        onClick={() => navigate("/")}
      >
        <Undo2 />
      </div>
    </div>
  );
};

export default LotteryResults;
