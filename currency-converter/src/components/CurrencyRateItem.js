import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatAmount } from './currencyUtils';
import '../styles.css';

const CurrencyRateItem = ({ currency, rate, amount, baseCurrency, onAmountChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    // 允许输入数字、一个小数点，并限制小数位数为6位
    if (/^[0-9]*\.?[0-9]{0,6}$/.test(newAmount) || newAmount === '') {
      onAmountChange(currency.code, newAmount);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (amount === '') {
      onAmountChange(currency.code, '0');
    } else {
      onAmountChange(currency.code, formatAmount(amount));
    }
  };

  const displayAmount = isFocused ? amount : (amount || '0');

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
          type="text"
          value={displayAmount}
          onChange={handleAmountChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="currency-input"
          placeholder={rate ? rate.toString() : ''}
          whileFocus={{ scale: 1.05 }}
        />
        <span className="currency-symbol">{currency.symbol}</span>
      </div>
    </motion.div>
  );
};

export default CurrencyRateItem;