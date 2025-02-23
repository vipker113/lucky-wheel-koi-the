export const convertPrize = (prize) => {
  const prizeMap = {
    A: "Nhất",
    B: "Nhì",
    C: "Ba",
    D: "Tư",
    E: "Năm",
    F: "Sáu",
  };

  return prizeMap[prize.toUpperCase()] || "Không xác định";
};
