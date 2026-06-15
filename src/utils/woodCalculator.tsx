
export const convertMeter = (meterStr: string): number => {
  const num = parseFloat(meterStr);
  return Math.floor(num * 10);
};

export const getNumberBeforeComma = (number: number): number => {
  const formatted = number.toLocaleString('vi-VN');
  const beforeFirstComma = formatted.split(',')[0];
  return parseInt(beforeFirstComma) || 0;
};


export const calculateBaseValue = (
  khuonNumber: number,
  meterStr: string
): number => {
  const meterValue = convertMeter(meterStr);
  const fullResult = khuonNumber * khuonNumber * 796 * meterValue;
  return getNumberBeforeComma(fullResult);
};


export const calculateKhuonResult = (
  khuonNumber: number,
  quantity: number,
  meterStr: string
): number => {
  if (quantity <= 0) return 0;
  
  const baseValue = calculateBaseValue(khuonNumber, meterStr);
  return baseValue * quantity;
};

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

export const formatNumber = (amount: number): string => {
  return amount.toLocaleString('vi-VN');
};