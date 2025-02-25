import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { FileText, Gift } from "lucide-react";
import { useResult } from "./ResultContext";
import { useNavigate } from "react-router-dom";

export const Detail = ({ currentRound }) => {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const { result } = useResult();

  const navigate = useNavigate();

  const filteredResults = useMemo(
    () =>
      currentRound
        ? result
            .filter((item) => item.round === currentRound.name)
            .sort((a, b) => a.roundId - b.roundId)
        : [],
    [currentRound, result]
  );

  const uniquePrizes = useMemo(
    () => ["Tất cả", ...new Set(filteredResults.map((item) => item.prize))],
    [filteredResults]
  );

  useEffect(() => {
    if (showStatsModal) {
      setSelectedPrize("Tất cả");
      setSearchQuery("");
    }
  }, [showStatsModal]);

  if (!currentRound) {
    return null;
  }

  const displayedResults = filteredResults
    .filter((item) =>
      selectedPrize === "Tất cả" ? true : item.prize === selectedPrize
    )
    .filter((item) =>
      [item.employeeId, item.employeeName, item.employeePhone, item.prize]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  return (
    <div className="detail-container">
      <div className="detail-icon" onClick={() => navigate("/result")}>
        <Gift />
      </div>
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
          style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}
        >
          Kết quả vòng quay của giải {currentRound.name}
        </DialogTitle>
        <DialogContent>
          {filteredResults.length > 0 ? (
            <>
              <div
                className="filter-container"
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                <FormControl variant="outlined" sx={{ minWidth: 200, flex: 2 }}>
                  <InputLabel id="prize-select-label">
                    Chọn giải thưởng
                  </InputLabel>
                  <Select
                    labelId="prize-select-label"
                    value={selectedPrize}
                    onChange={(e) => setSelectedPrize(e.target.value)}
                    label="Chọn giải thưởng"
                    sx={{ backgroundColor: "white" }}
                  >
                    {uniquePrizes.map((prize, index) => (
                      <MenuItem key={index} value={prize}>
                        {prize}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Tìm kiếm"
                  variant="outlined"
                  fullWidth
                  sx={{ flex: 1 }}
                  placeholder="Nhập mã nhân viên, tên, SĐT hoặc giải thưởng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
                    {displayedResults.length > 0 ? (
                      displayedResults.map((res, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{res.employeeId}</TableCell>
                          <TableCell>{res.employeeName}</TableCell>
                          <TableCell>{res.employeePhone}</TableCell>
                          <TableCell style={{ width: "250px" }}>
                            {res.prize}
                          </TableCell>
                          <TableCell>
                            {new Intl.DateTimeFormat("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).format(new Date(res.createdAt))}
                            ,{" "}
                            {new Intl.DateTimeFormat("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            }).format(new Date(res.createdAt))}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: "center" }}>
                          Không có kết quả phù hợp.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Chưa có kết quả cho vòng quay này.
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
