import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getCombinedCurrencyData();
        console.log('获取到的货币数据:', currencyData);
        if (currencyData.length === 0) {
          throw new Error('无法获取货币数据');
        }
        setCurrencies(currencyData);

        const usdRates = await fetchExchangeRates('USD');
        console.log('获取到的汇率数据:', usdRates);
        setRates(usdRates);

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
    };
    fetchData();
  }, []);

  const handleCurrencyChange = (index, newCurrencyCode) => {
    setSelectedCurrencyCodes(prev => {
      const newCodes = [...prev];
      newCodes[index] = newCurrencyCode;
      return newCodes;
    });

    setAmounts(prev => {
      const updatedAmounts = { ...prev };
      // 将新选择的货币金额设置为 1
      updatedAmounts[newCurrencyCode] = '1';

      // 根据新的基准货币（金额为1）重新计算其他货币的金额
      selectedCurrencyCodes.forEach(code => {
        if (code !== newCurrencyCode) {
          const convertedAmount = rates[code] / rates[newCurrencyCode];
          updatedAmounts[code] = formatAmount(convertedAmount);
        }
      });

      return updatedAmounts;
    });
  };

  const handleAmountChange = (currencyCode, amount) => {
    setAmounts(prev => {
      const newAmounts = { ...prev, [currencyCode]: amount };
      
      if (amount === '') {
        selectedCurrencyCodes.forEach(code => {
          newAmounts[code] = '';
        });
      } else {
        const usdAmount = currencyCode === 'USD' ? parseFloat(amount) : parseFloat(amount) / rates[currencyCode];
        
        selectedCurrencyCodes.forEach(code => {
          if (code !== currencyCode) {
            const convertedAmount = code === 'USD' ? usdAmount : usdAmount * rates[code];
            newAmounts[code] = formatAmount(convertedAmount);
          }
        });
      }
      
      return newAmounts;
    });
  };

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
    return <div className="error-container"><div className="error-message"><h2 className="error-title">错误</h2><p className="error-text">{error}</p></div></div>;
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