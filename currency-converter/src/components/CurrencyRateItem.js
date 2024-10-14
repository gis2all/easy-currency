import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatAmount } from './currencyUtils';
import CustomCurrencySelect from './CustomCurrencySelect';
import '../styles.css';

const CurrencyRateItem = ({
  currency,
  rate,
  amount,
  onAmountChange,
  onCurrencyChange,
  availableCurrencies,
  onDropdownOpen,
  onDropdownClose
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // 使用 useCallback 优化性能
  const handleAmountChange = useCallback((e) => {
    if (!currency) return;
    const newAmount = e.target.value;
    // 验证输入是否为有效的数字格式（最多6位小数）
    if (/^[0-9]*\.?[0-9]{0,6}$/.test(newAmount) || newAmount === '') {
      onAmountChange(currency.code, newAmount);
    }
  }, [currency, onAmountChange]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    if (!currency) return;
    setIsFocused(false);
    // 当失去焦点时，如果金额为空，设置为'0'；否则格式化金额
    onAmountChange(currency.code, amount === '' ? '0' : formatAmount(amount));
  }, [amount, currency, onAmountChange]);

  const handleCurrencyChange = useCallback((newCode) => {
    if (!currency) return;
    onCurrencyChange(currency.code, newCode);
  }, [currency, onCurrencyChange]);

  // 使用 useMemo 优化性能，避免不必要的排序
  const sortedCurrencies = useMemo(() => 
    [...availableCurrencies].sort((a, b) => a.code.localeCompare(b.code)),
    [availableCurrencies]
  );

  // 如果货币数据不可用，显示占位符
  if (!currency) {
    return <div className="currency-item-placeholder">货币数据不可用</div>;
  }

  // 根据焦点状态决定显示的金额
  const displayAmount = isFocused ? amount : (amount || '0');

  return (
    <motion.div
      className="currency-item"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.02 }}
      style={{ display: 'flex' }}
    >
      <div style={{ width: '40px' }}>
        <CustomCurrencySelect
          options={sortedCurrencies}
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

export default React.memo(CurrencyRateItem);
