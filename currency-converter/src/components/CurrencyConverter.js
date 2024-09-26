import React, { useState, useEffect } from 'react';
import CurrencyRateItem from './CurrencyRateItem';
import { currencies, getExchangeRates } from './currencyUtils';

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      const fetchedRates = await getExchangeRates();
      setRates(fetchedRates);
      setLoading(false);
    };
    fetchRates();
  }, []);

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-100 py-4 px-6">
        <h1 className="text-xl font-semibold text-gray-800">汇率转换器</h1>
        <p className="text-sm text-gray-600">基准货币：人民币 (CNY)</p>
      </div>
      <div className="p-6">
        {currencies.map((currency) => (
          <CurrencyRateItem
            key={currency.code}
            currency={currency}
            rate={rates[currency.code]}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrencyConverter;