import React, { useEffect, useState } from 'react';
import { formatCurrency } from './currencyUtils';

const CurrencyRateItem = ({ currency, rate, baseAmount, baseCurrency, onAmountChange }) => {
  const [localAmount, setLocalAmount] = useState('');

  useEffect(() => {
    if (baseAmount && rate) {
      const convertedAmount = (baseAmount * rate).toFixed(2);
      setLocalAmount(convertedAmount);
    }
  }, [baseAmount, rate]);

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setLocalAmount(newAmount);
    onAmountChange(currency.code, newAmount);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div className="flex items-center">
        <span className="text-2xl mr-2">{currency.flag}</span>
        <div>
          <span className="font-semibold">{currency.code}</span>
          <p className="text-sm text-gray-500">{currency.name}</p>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={localAmount}
          onChange={handleAmountChange}
          className="w-20 px-2 py-1 text-right font-semibold bg-transparent focus:outline-none"
          placeholder={formatCurrency(rate, 8)}
        />
        <span className="ml-1 text-sm text-gray-500">{currency.symbol}</span>
      </div>
    </div>
  );
};

export default CurrencyRateItem;