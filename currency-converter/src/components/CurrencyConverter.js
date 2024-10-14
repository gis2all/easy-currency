import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencyRateItem from './CurrencyRateItem';
import { getCombinedCurrencyData, fetchExchangeRates, formatAmount } from './currencyUtils';
import '../styles.css';
import { fadeIn, slideIn, fadeInUp } from '../animations';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [selectedCurrencyCodes, setSelectedCurrencyCodes] = useState(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']);
  const baseCurrency = 'USD';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 使用 useCallback 优化性能
  const fetchData = useCallback(async () => {
    try {
      const [currencyData, usdRates] = await Promise.all([
        getCombinedCurrencyData(),
        fetchExchangeRates('USD')
      ]);

      if (currencyData.length === 0) {
        throw new Error('无法获取货币数据');
      }

      console.log('获取到的货币数据:', currencyData);
      console.log('获取到的汇率数据:', usdRates);

      setCurrencies(currencyData);
      setRates(usdRates);

      // 初始化金额
      const initialAmounts = selectedCurrencyCodes.reduce((acc, code) => {
        acc[code] = code === 'USD' ? '1' : formatAmount(usdRates[code]);
        return acc;
      }, {});
      setAmounts(initialAmounts);

      setLoading(false);
    } catch (error) {
      console.error('获取数据失败:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [selectedCurrencyCodes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 优化货币变更处理函数
  const handleCurrencyChange = useCallback((index, newCurrencyCode) => {
    setSelectedCurrencyCodes(prev => {
      const newCodes = [...prev];
      newCodes[index] = newCurrencyCode;
      return newCodes;
    });

    setAmounts(prev => {
      const updatedAmounts = { ...prev, [newCurrencyCode]: '1' };
      selectedCurrencyCodes.forEach(code => {
        if (code !== newCurrencyCode) {
          updatedAmounts[code] = formatAmount(rates[code] / rates[newCurrencyCode]);
        }
      });
      return updatedAmounts;
    });
  }, [rates, selectedCurrencyCodes]);

  // 优化金额变更处理函数
  const handleAmountChange = useCallback((currencyCode, amount) => {
    setAmounts(prev => {
      const newAmounts = { ...prev, [currencyCode]: amount };
      
      if (amount === '') {
        return Object.fromEntries(selectedCurrencyCodes.map(code => [code, '']));
      }

      const usdAmount = currencyCode === 'USD' ? parseFloat(amount) : parseFloat(amount) / rates[currencyCode];
      
      selectedCurrencyCodes.forEach(code => {
        if (code !== currencyCode) {
          newAmounts[code] = formatAmount(code === 'USD' ? usdAmount : usdAmount * rates[code]);
        }
      });
      
      return newAmounts;
    });
  }, [rates, selectedCurrencyCodes]);

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2 className="error-title">错误</h2>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  console.log('当前选择的货币代码:', selectedCurrencyCodes);
  console.log('可用的货币:', currencies);

  return (
    <div className={`app-container ${isDropdownOpen ? 'no-hover' : ''}`}>
      <motion.div {...slideIn} className="converter-container">
        <div className="header-container">
          <motion.h1 {...fadeIn} transition={{ delay: 0.3 }} className="title">
            汇率转换器
          </motion.h1>
        </div>
        <AnimatePresence>
          <motion.div {...fadeIn} className="currency-list">
            {selectedCurrencyCodes.map((code, index) => {
              const currency = currencies.find(c => c.code === code);
              return (
                <motion.div key={index} {...fadeInUp}>
                  <CurrencyRateItem
                    currency={currency || null}
                    rate={rates[code]}
                    amount={amounts[code]}
                    baseCurrency={baseCurrency}
                    onAmountChange={handleAmountChange}
                    onCurrencyChange={(oldCode, newCode) => handleCurrencyChange(index, newCode)}
                    availableCurrencies={currencies}
                    onDropdownOpen={handleDropdownOpen}
                    onDropdownClose={handleDropdownClose}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {isDropdownOpen && <div className="overlay"></div>}
    </div>
  );
};

export default CurrencyConverter;
