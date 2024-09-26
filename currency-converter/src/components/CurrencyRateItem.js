import React, { useEffect, useState } from 'react';
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

  const inputStyle = {
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    appearance: 'textfield',
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 ease-in-out">
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{currency.flag}</span>
        <div>
          <span className="font-semibold text-gray-800">{currency.code}</span>
          <p className="text-sm text-gray-500">{currency.name}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={displayAmount}
          onChange={handleAmountChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-28 px-3 py-2 text-right font-medium text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ease-in-out"
          placeholder={isFocused ? '' : formatCurrency(rate, 8)}
          step="any"
          style={inputStyle}
        />
        <span className="text-sm font-medium text-gray-600">{currency.symbol}</span>
      </div>
    </div>
  );
};

export default CurrencyRateItem;