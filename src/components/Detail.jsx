import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import axios from "axios";
import { useResult } from "./ResultContext";

export const Detail = () => {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const { result } = useResult();

  const fetchRounds = async () => {
    try {
      const { data } = await axios.get(
        "https://koi-lottery-api.azurewebsites.net/rounds"
      );
      setRounds(data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const getResultsByRound = (roundName) => {
    return result.filter((item) => item.round === roundName);
  };

  return (
    <div className="detail-container">
      <div className="detail-icon" onClick={() => setShowStatsModal(true)}>
        <FileText />
      </div>
      <Dialog
        open={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          THỐNG KÊ QUAY THƯỞNG
        </DialogTitle>
        <DialogContent>
          {rounds.length > 0 ? (
            <>
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                centered
              >
                {rounds.map((round, index) => (
                  <Tab key={index} label={`Vòng ${round}`} />
                ))}
              </Tabs>
              <Box p={2}>
                {rounds.map((round, index) => (
                  <div key={index} hidden={selectedTab !== index}>
                    {getResultsByRound(round).length > 0 ? (
                      <TableContainer
                        component={Paper}
                        sx={{ maxHeight: 400, overflow: "auto" }}
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
                            {getResultsByRound(round).map((res, i) => (
                              <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{res.employeeId}</TableCell>
                                <TableCell>{res.employeeName}</TableCell>
                                <TableCell>{res.employeePhone}</TableCell>
                                <TableCell
                                  style={{
                                    width: "250px",
                                  }}
                                >
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
                        sx={{ mt: 2 }}
                      >
                        Chưa có kết quả cho giải thưởng này
                      </Typography>
                    )}
                  </div>
                ))}
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Không có dữ liệu vòng quay nào.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatsModal(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
