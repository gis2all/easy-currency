import React from 'react';
import { formatCurrency } from './currencyUtils';

const CurrencyRateItem = ({ currency, rate }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div className="flex items-center">
        <span className="text-2xl mr-2">{currency.flag}</span>
        <div>
          <span className="font-semibold">{currency.code}</span>
          <p className="text-sm text-gray-500">{currency.name}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="font-semibold">{formatCurrency(rate, 8)}</span>
        <p className="text-sm text-gray-500">{currency.symbol}</p>
      </div>
    </div>
  );
};

export default CurrencyRateItem;