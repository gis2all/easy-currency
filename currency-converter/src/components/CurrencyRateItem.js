import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatAmount } from './currencyUtils';
import '../styles.css';

const CurrencyRateItem = ({ currency, rate, amount, baseCurrency, onAmountChange, onCurrencyChange, availableCurrencies }) => {
  const [isFocused, setIsFocused] = useState(false);

  if (!currency) {
    return <div className="currency-item-placeholder">货币数据不可用</div>;
  }

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
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

  const handleCurrencyChange = (e) => {
    onCurrencyChange(currency.code, e.target.value);
  };

  const displayAmount = isFocused ? amount : (amount || '0');

  return (
    <motion.div
      className="currency-item"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="currency-info">
        <select
          value={currency.code}
          onChange={handleCurrencyChange}
          className="currency-select"
        >
          {availableCurrencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.code} - {curr.name}
            </option>
          ))}
        </select>
        <img
          src={currency.flag}
          alt={`${currency.code} flag`}
          className="currency-flag"
        />
        <div className="currency-details">
          <span className="currency-code-text">{currency.code}</span>
          <span className="currency-name-text">{currency.name}</span>
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