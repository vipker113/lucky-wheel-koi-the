import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "../assets/images/1.jpeg";

export const Vote = () => {
  const API_BASE_URL = "https://koi-lottery-api.azurewebsites.net";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [performances, setPerformances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/employees/${phoneNumber}`
      );
      if (data) {
        await fetchPerformances();
        setIsVerified(true);
      }
    } catch (error) {
      toast.error("Số điện thoại / mã số nhân viên không hợp lệ!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePerformanceClick = (performanceId) => {
    setSelectedPerformance(performanceId);
  };

  const performancesName =
    performances.find((p) => p.id === selectedPerformance)?.name || "";

  const handleVoteConfirm = async () => {
    setIsVoting(true);
    setOpenDialog(false);

    try {
      await axios.post(
        `${API_BASE_URL}/votes?idOrPhone=${phoneNumber}&performanceId=${selectedPerformance}`
      );
      toast.success("Bạn đã vote thành công cho tiết mục " + performancesName);
      setOpenDialog(false);
      setSelectedPerformance(null);
    } catch (error) {
      toast.error("Bạn đã hết lượt vote!");
    } finally {
      setIsVoting(false);
    }
  };

  const fetchPerformances = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/performances`);
      setPerformances(data);
    } catch (error) {
      toast.error("Không thể tải danh sách tiết mục!");
    }
  };

  return (
    <div className="vote-page">
      <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
        <Paper
          elevation={3}
          style={{
            padding: "2rem",
            backgroundColor: "rgba(222, 159, 156, 0.8)",
            borderRadius: "12px",
            marginTop: "10%",
            border: "4px solid #f5e4bd",
          }}
        >
          {!isVerified ? (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Số điện thoại / Mã nhân viên"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                sx={{
                  marginBottom: 2,
                  backgroundColor: "#f5e4bd",
                  borderRadius: "4px",
                  "& label": {
                    color: "#3b5b5a",
                    fontWeight: 500,
                  },
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
                disabled={isLoading}
                style={{
                  color: "white",
                  height: "48px",
                  fontSize: "1.1rem",
                  border: "1px solid #f5e4bd",
                  backgroundColor: "#3b5b5a",
                }}
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </form>
          ) : (
            <Grid container spacing={3}>
              {performances.map((performance) => (
                <Grid item xs={12} sm={6} key={performance.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                      },
                      backgroundColor: "white",
                      border:
                        selectedPerformance === performance.id
                          ? "6px solid #f5e4bd"
                          : "2px solid #3b5b5a",
                      position: "relative",
                    }}
                    onClick={() => handlePerformanceClick(performance.id)}
                  >
                    <CardContent
                      sx={{
                        padding: 0,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={img1}
                        alt="thumbnails"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderBottom: "2px solid #3b5b5a",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          padding: "16px",
                          color: "#3b5b5a",
                          fontWeight: 600,
                          textAlign: "center",
                          fontSize: "1.2rem",
                        }}
                      >
                        {performance.name}
                      </Typography>

                      {selectedPerformance === performance.id && (
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#3b5b5a",
                            color: "#f5e4bd",
                            margin: "auto",
                            "&:hover": {
                              backgroundColor: "#2a4344",
                            },
                          }}
                          onClick={() => setOpenDialog(true)}
                        >
                          Xác nhận vote
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận vote cho tiết mục {performancesName}</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn vote cho tiết mục này?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#3b5b5a" }}
          >
            Suy nghĩ lại
          </Button>
          <Button
            onClick={handleVoteConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#3b5b5a",
              "&:hover": {
                backgroundColor: "#2a4344",
              },
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {isVoting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#f5e4bd" }} />
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
};
