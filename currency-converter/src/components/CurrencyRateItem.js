import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from './currencyUtils';

const CurrencyRateItem = ({ currency, rate, baseAmount, baseCurrency, onAmountChange }) => {
  const [localAmount, setLocalAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (baseAmount && rate) {
      const convertedAmount = baseAmount * rate;
      setLocalAmount(convertedAmount === Math.floor(convertedAmount) 
        ? convertedAmount.toString() 
        : convertedAmount.toFixed(2));
    }
  }, [baseAmount, rate]);

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setLocalAmount(newAmount);
    onAmountChange(currency.code, newAmount);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (localAmount === '') {
      setLocalAmount('');
      onAmountChange(currency.code, '1');
    }
  };

  const displayAmount = localAmount || (isFocused ? '' : '1');

  return (
    <motion.div 
      className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-300 ease-in-out"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-4">
        <motion.span 
          className="text-4xl"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {currency.flag}
        </motion.span>
        <div>
          <motion.span 
            className="font-semibold text-gray-900 text-lg"
            whileHover={{ scale: 1.1 }}
          >
            {currency.code}
          </motion.span>
          <p className="text-sm text-gray-500">{currency.name}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <motion.input
          type="number"
          value={displayAmount}
          onChange={handleAmountChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-32 px-4 py-2 text-right font-medium text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 ease-in-out text-lg"
          placeholder={isFocused ? '' : formatCurrency(rate, 8)}
          step="any"
          whileFocus={{ scale: 1.05 }}
        />
        <span className="text-sm font-medium text-gray-600">{currency.symbol}</span>
      </div>
    </motion.div>
  );
};

export default CurrencyRateItem;