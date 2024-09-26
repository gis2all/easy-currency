import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencyRateItem from './CurrencyRateItem';
import { getCombinedCurrencyData, fetchExchangeRates } from './currencyUtils';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseAmount, setBaseAmount] = useState(1);
  const [baseCurrency, setBaseCurrency] = useState('USD');

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

  useEffect(() => {
    const updateRates = async () => {
      if (baseCurrency) {
        const newRates = await fetchExchangeRates(baseCurrency);
        setRates(newRates);
      }
    };
    updateRates();
  }, [baseCurrency]);

  const handleAmountChange = (currency, amount) => {
    const newBaseAmount = amount === '' ? 1 : parseFloat(amount) / rates[currency];
    setBaseAmount(newBaseAmount);
    setBaseCurrency(currency);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">错误</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const baseCurrencyInfo = currencies.find(c => c.code === baseCurrency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-6 text-center"
          >
            汇率转换器
          </motion.h1>
          {baseCurrencyInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center mb-6"
            >
              <div className="flex items-center space-x-4 mb-2 bg-white bg-opacity-50 rounded-full px-6 py-3 shadow-md">
                <img
                  src={baseCurrencyInfo.flag}
                  alt={`${baseCurrencyInfo.code} flag`}
                  className="w-10 h-7 object-cover rounded shadow-sm"
                />
                <span className="text-xl font-medium text-gray-900">{baseCurrencyInfo.name}</span>
                <span className="text-lg text-gray-600">
                  ({baseCurrencyInfo.symbol} {baseCurrencyInfo.code})
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">基准货币</p>
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="divide-y divide-gray-200"
          >
            {currencies.map((currency, index) => (
              <motion.div
                key={currency.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
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