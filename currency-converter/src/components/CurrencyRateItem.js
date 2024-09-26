import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from './currencyUtils';
import '../styles.css';

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
      className="currency-item"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="currency-info">
        <img
          src={currency.flag}
          alt={`${currency.code} flag`}
          className="currency-flag"
        />
        <div className="currency-details">
          <motion.span
            className="currency-code-text"
            whileHover={{ scale: 1.1 }}
          >
            {currency.code}
          </motion.span>
          <p className="currency-name-text">{currency.name}</p>
        </div>
      </div>
      <div className="currency-input-container">
        <motion.input
          type="number"
          value={displayAmount}
          onChange={handleAmountChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="currency-input"
          placeholder={isFocused ? '' : formatCurrency(rate, 8)}
          step="any"
          whileFocus={{ scale: 1.05 }}
        />
        <span className="currency-symbol">{currency.symbol}</span>
      </div>
    </motion.div>
  );
};

export default CurrencyRateItem;