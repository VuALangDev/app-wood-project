// File: src/utils/woodCalculator.ts

/**
 * Chuyển đổi số mét sang số không dấu phẩy
 * 2.6m → 26, 3.9m → 39, 1m → 10, v.v.
 */
export const convertMeter = (meterStr: string): number => {
  const num = parseFloat(meterStr);
  return Math.floor(num * 10);
};

/**
 * Lấy số TRƯỚC dấu phẩy (phần nguyên ở phần ngàn)
 * Ví dụ: 3,184,000 → 3
 *        12,417,600 → 12
 *        9,126,936 → 9
 */
export const getNumberBeforeComma = (number: number): number => {
  // Format số với dấu phẩy phân cách phần ngàn
  const formatted = number.toLocaleString('vi-VN');
  
  // Lấy phần trước dấu phẩy đầu tiên
  const beforeFirstComma = formatted.split(',')[0];
  
  // Chuyển thành số
  return parseInt(beforeFirstComma) || 0;
};

/**
 * Tính giá cơ bản cho 1 khuôn (chưa nhân số lượng)
 */
export const calculateBaseValue = (
  khuonNumber: number,
  meterStr: string
): number => {
  const meterValue = convertMeter(meterStr);
  const fullResult = khuonNumber * khuonNumber * 796 * meterValue;
  
  // Lấy số TRƯỚC dấu phẩy
  return getNumberBeforeComma(fullResult);
};

/**
 * Tính kết quả cho 1 khuôn
 */
export const calculateKhuonResult = (
  khuonNumber: number,
  quantity: number,
  meterStr: string
): number => {
  if (quantity <= 0) return 0;
  
  const baseValue = calculateBaseValue(khuonNumber, meterStr);
  return baseValue * quantity;
};

/**
 * Tính tổng cho cả đầu với mét cụ thể
 */
export const calculateDauTotal = (
  dau: string,
  quantities: { [khuon: number]: string },
  meterStr: string
): number => {
  const dauNum = parseInt(dau.replace('Đ', ''));
  const startKhuon = dauNum * 10;
  let total = 0;
  
  for (let i = 0; i < 10; i++) {
    const khuonNum = startKhuon + i;
    const quantity = parseFloat(quantities[khuonNum]) || 0;
    
    if (quantity > 0) {
      const result = calculateKhuonResult(khuonNum, quantity, meterStr);
      total += result;
    }
  }
  
  return total;
};

/**
 * Format số (không cần đơn vị tiền)
 */
export const formatNumber = (amount: number): string => {
  return amount.toLocaleString('vi-VN');
};