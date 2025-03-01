import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "../assets/images/1.jpeg";
import imgBanner from "../assets/images/img-banner.jpg";
import { Check } from "lucide-react";

export const Vote = () => {
  const API_BASE_URL = "https://koi-lottery-api.azurewebsites.net";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [performances, setPerformances] = useState([]);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    fetchPerformances();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerified(true);
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
      {!isVerified ? (
        <div
          style={{
            padding: "2rem",
            maxWidth: "400px",
            margin: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "12px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Số vé"
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
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <img src={imgBanner} alt="banner" />
          <div
            style={{
              paddingBottom: "80px",
              paddingLeft: "24px",
              paddingRight: "24px",
              margin: "auto",
              maxWidth: "600px",
            }}
          >
            <Grid container spacing={2}>
              {performances.map((performance) => (
                <Grid item xs={12} key={performance.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                      backgroundColor: "white",
                      borderRadius: "20px",
                    }}
                    onClick={() => handlePerformanceClick(performance.id)}
                  >
                    <CardContent>
                      <img
                        src={img1}
                        alt="thumbnails"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                      <div
                        style={{
                          marginTop: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            minWidth: "28px",
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            backgroundColor:
                              selectedPerformance === performance.id
                                ? "#3b5b5a"
                                : "#f5e4bd",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {selectedPerformance === performance.id && (
                            <Check size={20} color="white" />
                          )}
                        </div>
                        <Typography
                          variant="h6"
                          sx={{
                            width: "100%",
                            color: "#3b5b5a",
                            fontWeight: 600,
                          }}
                        >
                          {performance.name}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}

      {selectedPerformance && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#3b5b5a",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#a74844", color: "white" }}
            onClick={() => setOpenDialog(true)}
          >
            Xác nhận vote
          </Button>
        </div>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận vote cho tiết mục {performancesName}</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn vote ? Lựa chọn của bạn sẽ{" "}
          <strong>không thể thay đổi</strong> sau khi xác nhận!
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
            sx={{ backgroundColor: "#3b5b5a" }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {isVoting && (
        <CircularProgress
          sx={{
            color: "#f5e4bd",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <ToastContainer position="top-right" />
    </div>
  );
};
