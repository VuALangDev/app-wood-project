import { useState } from 'react'
import './TrangTinhGo.css'
import { FaCircleUser } from "react-icons/fa6";
import { 
  calculateKhuonResult,
  calculateDauTotal,
  formatNumber 
} from '../../utils/woodCalculator';

export const TrangTinhGo = () => {
  // ========== STATE ==========
  
  const [selectedDau, setSelectedDau] = useState<string>('Đ2');
  const allDau = ['Đ2', 'Đ3', 'Đ4', 'Đ5', 'Đ6', 'Đ7', 'Đ8', 'Đ9', 'Đ10', 'Đ11', 'Đ12'];
  
  const meterOptions = ['2.6', '3.9', '5.2', '1.3', '1', '2', '3'];
  const [selectedMeterTab, setSelectedMeterTab] = useState<string>('2.6');
  
  type QuantitiesByMeter = {
    [meter: string]: { [khuon: number]: string };
  };
  
  type DauTotalsByMeter = {
    [meter: string]: { [dau: string]: number };
  };
  
  const [quantitiesByMeter, setQuantitiesByMeter] = useState<QuantitiesByMeter>(() => {
    const initial: QuantitiesByMeter = {};
    meterOptions.forEach(meter => {
      initial[meter] = {};
    });
    return initial;
  });
  
  const [dauTotalsByMeter, setDauTotalsByMeter] = useState<DauTotalsByMeter>(() => {
    const initial: DauTotalsByMeter = {};
    meterOptions.forEach(meter => {
      initial[meter] = {};
      allDau.forEach(dau => {
        initial[meter][dau] = 0;
      });
    });
    return initial;
  });
  
  // ========== FUNCTIONS ==========
  
  // 1. Tính tổng TẤT CẢ CÁC MÉT cho từng đầu (QUAN TRỌNG)
  const calculateAllMetersTotalForDau = (dau: string): number => {
    let total = 0;
    meterOptions.forEach(meter => {
      total += dauTotalsByMeter[meter][dau] || 0;
    });
    return total;
  };
  
  // 2. Tính tổng CHUNG tất cả các đầu và tất cả các mét
  const calculateGrandTotalAll = (): number => {
    let grandTotal = 0;
    allDau.forEach(dau => {
      grandTotal += calculateAllMetersTotalForDau(dau);
    });
    return grandTotal;
  };
  
  // 3. Các hàm hiện có giữ nguyên
  const generateKhuonData = (dau: string): number[] => {
    const dauNumber = parseInt(dau.replace('Đ', ''));
    const startNumber = dauNumber * 10;
    const data: number[] = [];
    for (let i = 0; i < 10; i++) {
      data.push(startNumber + i);
    }
    return data;
  };
  
  const khuonData = generateKhuonData(selectedDau);
  
  const handleQuantityChange = (
    meter: string,
    khuonNumber: number,
    value: string
  ) => {
    const newQuantitiesForMeter = {
      ...quantitiesByMeter[meter],
      [khuonNumber]: value
    };
    
    setQuantitiesByMeter(prev => ({
      ...prev,
      [meter]: newQuantitiesForMeter
    }));
    
    const dauTotal = calculateDauTotal(selectedDau, newQuantitiesForMeter, meter);
    
    setDauTotalsByMeter(prev => ({
      ...prev,
      [meter]: {
        ...prev[meter],
        [selectedDau]: dauTotal
      }
    }));
  };
  
  const handleSelectDau = (dau: string) => {
    setSelectedDau(dau);
  };
  
  const handleSelectMeterTab = (meter: string) => {
    setSelectedMeterTab(meter);
  };
  
  const getKhuonResult = (khuonNumber: number): number => {
    const quantity = parseFloat(quantitiesByMeter[selectedMeterTab][khuonNumber] || '0') || 0;
    return calculateKhuonResult(khuonNumber, quantity, selectedMeterTab);
  };
  
  const displayKhuonResult = (khuonNumber: number): string => {
    const result = getKhuonResult(khuonNumber);
    return formatNumber(result);
  };
  
  const calculateCurrentMeterTotal = (): number => {
    const currentTotals = dauTotalsByMeter[selectedMeterTab];
    return Object.values(currentTotals).reduce((sum, total) => sum + total, 0);
  };
  
  const resetAllData = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu?')) {
      const resetQuantities: QuantitiesByMeter = {};
      meterOptions.forEach(meter => {
        resetQuantities[meter] = {};
      });
      setQuantitiesByMeter(resetQuantities);
      
      const resetTotals: DauTotalsByMeter = {};
      meterOptions.forEach(meter => {
        resetTotals[meter] = {};
        allDau.forEach(dau => {
          resetTotals[meter][dau] = 0;
        });
      });
      setDauTotalsByMeter(resetTotals);
    }
  };
  
  // ========== RENDER ==========
  
  return (
    <div className="container">
      {/* Header */}
      <div className="header-app">
        <div className="app-title">
          <p>MÁY TÍNH GỖ</p>
        </div>
        <div className="user-info">
          <FaCircleUser className="user-icon" />
          <span className="username">Khách</span>
        </div>
      </div>
      
      {/* Phần các đầu Đ2-Đ12 */}
      <div className="header-app-container">
        <div className="header-app-number-row">
          {allDau.slice(0, 6).map((dau) => (
            <div 
              key={dau} 
              className={`dau-item ${selectedDau === dau ? 'active' : ''}`}
              onClick={() => handleSelectDau(dau)}
            >
              {dau}
            </div>
          ))}
        </div>
        
        <div className="header-app-number-row">
          {allDau.slice(6).map((dau) => (
            <div 
              key={dau} 
              className={`dau-item ${selectedDau === dau ? 'active' : ''}`}
              onClick={() => handleSelectDau(dau)}
            >
              {dau}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tabs cho từng mét */}
      <div className="meter-tabs-container">
        <div className="meter-tabs-scroll">
          {meterOptions.map((meter) => (
            <button
              key={meter}
              className={`meter-tab ${selectedMeterTab === meter ? 'active' : ''}`}
              onClick={() => handleSelectMeterTab(meter)}
            >
              {meter}m
            </button>
          ))}
        </div>
      </div>
      
      {/* Phần Calculator */}
      <div className="calculator-section">
        <div className="calculator-wrapper">
          <div className="calculator-columns">
            
            <div className="calc-part-1">
              <div className="calc-title">KHUÔN ĐẦU {selectedDau}</div>
              <div className="khuon-list">
                {khuonData.map((khuonNumber) => (
                  <div key={khuonNumber} className="khuon-item">
                    {khuonNumber}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="calc-part-2">
              <div className="calc-title">S. LƯỢNG ({selectedMeterTab}m)</div>
              <div className="quantity-inputs">
                {khuonData.map((khuonNumber) => (
                  <div key={khuonNumber} className="input-row">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={quantitiesByMeter[selectedMeterTab][khuonNumber] || ''}
                      onChange={(e) => handleQuantityChange(selectedMeterTab, khuonNumber, e.target.value)}
                      placeholder="0"
                      className="quantity-input"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="calc-part-3">
              <div className="calc-title">KẾT QUẢ <p>({selectedMeterTab}m)</p></div>
              <div className="result-list">
                {khuonData.map((khuonNumber) => (
                  <div key={khuonNumber} className="result-item">
                    {displayKhuonResult(khuonNumber)}
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Nút Reset */}
      <div className="reset-section">
        <button className="reset-btn" onClick={resetAllData}>
          XÓA TẤT CẢ DỮ LIỆU
        </button>
      </div>
      
      {/* ========== PHẦN 1: TỔNG THEO MÉT HIỆN TẠI ========== */}
      <div className="dau-totals-section">
        <div className="total-header-row">
          <div className="total-title">TỔNG CÁC ĐẦU GỖ ({selectedMeterTab}m)</div>
        </div>
        
        <div className="dau-totals-grid">
          {['Đ2', 'Đ3', 'Đ4', 'Đ5'].map((dau) => (
            <div key={dau} className="dau-total-column">
              <div className="dau-total-header">{dau}</div>
              <div className="dau-total-value">
                {formatNumber(dauTotalsByMeter[selectedMeterTab][dau] || 0)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="dau-totals-grid">
          {['Đ6', 'Đ7', 'Đ8', 'Đ9'].map((dau) => (
            <div key={dau} className="dau-total-column">
              <div className="dau-total-header">{dau}</div>
              <div className="dau-total-value">
                {formatNumber(dauTotalsByMeter[selectedMeterTab][dau] || 0)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="dau-totals-grid">
          {['Đ10', 'Đ11', 'Đ12'].map((dau) => (
            <div key={dau} className="dau-total-column">
              <div className="dau-total-header">{dau}</div>
              <div className="dau-total-value">
                {formatNumber(dauTotalsByMeter[selectedMeterTab][dau] || 0)}
              </div>
            </div>
          ))}
          <div className="dau-total-column empty-column"></div>
        </div>
        
        <div className="meter-total-row">
          <div className="meter-total-label">Tổng khối {selectedMeterTab}m:</div>
          <div className="meter-total-value">
            {formatNumber(calculateCurrentMeterTotal())}
          </div>
        </div>
      </div>
      
      {/* ========== PHẦN 2: TỔNG TẤT CẢ CÁC MÉT ========== */}
      <div className="dau-totals-section all-meters-total">
        <div className="total-header-row">
          <div className="total-title">TỔNG TẤT CẢ CÁC MÉT</div>
        </div>
        
        <div className="dau-totals-grid">
          {['Đ2', 'Đ3', 'Đ4', 'Đ5'].map((dau) => (
            <div key={dau} className="dau-total-column">
              <div className="dau-total-header">{dau}</div>
              <div className="dau-total-value all-meters-value">
                {formatNumber(calculateAllMetersTotalForDau(dau))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="dau-totals-grid">
          {['Đ6', 'Đ7', 'Đ8', 'Đ9'].map((dau) => (
            <div key={dau} className="dau-total-column">
              <div className="dau-total-header">{dau}</div>
              <div className="dau-total-value all-meters-value">
                {formatNumber(calculateAllMetersTotalForDau(dau))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="dau-totals-grid">
          {['Đ10', 'Đ11', 'Đ12'].map((dau) => (
            <div key={dau} className="dau-total-column">
              <div className="dau-total-header">{dau}</div>
              <div className="dau-total-value all-meters-value">
                {formatNumber(calculateAllMetersTotalForDau(dau))}
              </div>
            </div>
          ))}
          <div className="dau-total-column empty-column"></div>
        </div>
        
        <div className="grand-total-row">
          <div className="grand-total-label">TỔNG CHUNG TẤT CẢ:</div>
          <div className="grand-total-value">
            {formatNumber(calculateGrandTotalAll())}
          </div>
        </div>
      </div>
    </div>
  );
};