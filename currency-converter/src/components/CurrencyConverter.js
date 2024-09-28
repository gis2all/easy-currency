import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencyRateItem from './CurrencyRateItem';
import { getCombinedCurrencyData, fetchExchangeRates } from './currencyUtils';
import '../styles.css';
import { fadeIn, slideIn, fadeInUp } from '../animations'; // 添加 fadeInUp

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseAmount, setBaseAmount] = useState(1);
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
    if (amount === '' || amount === null) {
      setBaseAmount(null);
    } else {
      const newBaseAmount = parseFloat(amount) / rates[currency];
      setBaseAmount(newBaseAmount);
    }
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
                  baseAmount={baseAmount}
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