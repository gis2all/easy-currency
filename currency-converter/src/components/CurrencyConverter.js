import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencyRateItem from './CurrencyRateItem';
import { getCombinedCurrencyData, fetchExchangeRates, formatAmount } from './currencyUtils';
import '../styles.css';
import { fadeIn, slideIn, fadeInUp } from '../animations'; // 添加 fadeInUp

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amounts, setAmounts] = useState({});
  const baseCurrency = 'USD'; // 固定基准货币为 USD

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getCombinedCurrencyData();
        if (currencyData.length === 0) {
          throw new Error('无法获取货币数据');
        }
        setCurrencies(currencyData);

        const usdRates = await fetchExchangeRates('USD');
        setRates(usdRates);

        // 初始化所有货币金额为1
        const initialAmounts = currencyData.reduce((acc, currency) => {
          acc[currency.code] = currency.code === 'USD' ? '1' : formatAmount(usdRates[currency.code]);
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

  const handleAmountChange = (currency, amount) => {
    const newAmounts = { ...amounts, [currency]: amount };
    
    if (amount === '') {
      // 如果输入为空，将所有货币金额设置为空字符串
      Object.keys(newAmounts).forEach(key => {
        newAmounts[key] = '';
      });
    } else {
      const usdAmount = currency === 'USD' ? parseFloat(amount) : parseFloat(amount) / rates[currency];
      
      currencies.forEach(curr => {
        if (curr.code !== currency) {
          const convertedAmount = curr.code === 'USD' ? usdAmount : usdAmount * rates[curr.code];
          newAmounts[curr.code] = formatAmount(convertedAmount);
        }
      });
    }
    
    setAmounts(newAmounts);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
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

  const baseCurrencyInfo = currencies.find(c => c.code === baseCurrency);

  return (
    <div className="app-container">
      <motion.div
        {...slideIn}
        className="converter-container"
      >
        <div className="header-container">
          <motion.h1
            {...fadeIn}
            transition={{ delay: 0.3 }}
            className="title"
          >
            汇率转换器
          </motion.h1>
        </div>
        <AnimatePresence>
          <motion.div
            {...fadeIn}
            className="currency-list"
          >
            {currencies.map((currency) => (
              <motion.div
                key={currency.code}
                {...fadeInUp} // 确保使用正确的属性
              >
                <CurrencyRateItem
                  currency={currency}
                  rate={rates[currency.code]}
                  amount={amounts[currency.code]}
                  baseCurrency={baseCurrency}
                  onAmountChange={handleAmountChange}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CurrencyConverter;