import React, { useState, useEffect } from 'react';
import CurrencyRateItem from './CurrencyRateItem';
import { currencies, getExchangeRates } from './currencyUtils';

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [baseAmount, setBaseAmount] = useState(1);
  const [baseCurrency, setBaseCurrency] = useState('CNY');

  useEffect(() => {
    const fetchRates = async () => {
      const fetchedRates = await getExchangeRates();
      setRates(fetchedRates);
      setLoading(false);
    };
    fetchRates();
  }, []);

  const handleAmountChange = (currency, amount) => {
    const newBaseAmount = amount === '' ? 1 : parseFloat(amount) / rates[currency];
    setBaseAmount(newBaseAmount);
    setBaseCurrency(currency);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-50 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">汇率转换器</h1>
          <p className="text-sm text-gray-600">基准货币：<span className="font-semibold">{baseCurrency}</span></p>
          <p className="text-xs text-gray-500 mt-1">实时汇率更新</p>
        </div>
        <div className="divide-y divide-gray-200">
          {currencies.map((currency) => (
            <CurrencyRateItem
              key={currency.code}
              currency={currency}
              rate={rates[currency.code]}
              baseAmount={baseAmount}
              baseCurrency={baseCurrency}
              onAmountChange={handleAmountChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;