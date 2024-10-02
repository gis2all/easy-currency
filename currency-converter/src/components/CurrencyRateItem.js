import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatAmount } from './currencyUtils';
import CustomCurrencySelect from './CustomCurrencySelect';
import '../styles.css';

const CurrencyRateItem = ({
  currency,
  rate,
  amount,
  baseCurrency,
  onAmountChange,
  onCurrencyChange,
  availableCurrencies,
  onDropdownOpen,
  onDropdownClose
}) => {
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

  const handleCurrencyChange = (newCode) => {
    onCurrencyChange(currency.code, newCode);
  };

  const displayAmount = isFocused ? amount : (amount || '0');

  // 对 availableCurrencies 进行排序
  const sortedCurrencies = availableCurrencies.sort((a, b) => a.code.localeCompare(b.code));

  return (
    <motion.div
      className="currency-item"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.02 }}
      style={{ display: 'flex' }}
    >
      <div style={{ width: '40px' }}>
        <CustomCurrencySelect
          options={sortedCurrencies} // 使用排序后的货币列表
          value={currency.code}
          onChange={handleCurrencyChange}
          onMenuOpen={onDropdownOpen}
          onMenuClose={onDropdownClose}
          minimal={true}
        />
      </div>

      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="currency-info">
          <div className="flex items-center space-x-4">
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
      </div>
    </motion.div>
  );
};

export default CurrencyRateItem;