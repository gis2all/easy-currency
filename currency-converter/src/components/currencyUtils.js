const API_KEY = '2dfbab0e99f9426d2d269e07'; // 您的 API 密钥

// 定义主要货币及其优先国家
const primaryCurrencyCountries = {
  USD: 'United States',
  EUR: 'Germany',
  GBP: 'United Kingdom',
  JPY: 'Japan',
  AUD: 'Australia',
  CAD: 'Canada',
  CHF: 'Switzerland',
  CNY: 'China',
  HKD: 'Hong Kong',
  NZD: 'New Zealand'
};

export const fetchCurrencies = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    
    const currenciesData = {};

    // 首先处理主要货币
    data.forEach(country => {
      if (country.currencies) {
        Object.entries(country.currencies).forEach(([code, details]) => {
          if (primaryCurrencyCountries[code] && primaryCurrencyCountries[code] === country.name.common) {
            currenciesData[code] = {
              code,
              name: details.name,
              symbol: details.symbol || code,
              flag: country.flags.svg,
              country: country.name.common
            };
          }
        });
      }
    });

    // 然后处理其他货币
    data.forEach(country => {
      if (country.currencies) {
        Object.entries(country.currencies).forEach(([code, details]) => {
          if (!currenciesData[code]) {
            currenciesData[code] = {
              code,
              name: details.name,
              symbol: details.symbol || code,
              flag: country.flags.svg,
              country: country.name.common
            };
          }
        });
      }
    });

    return Object.values(currenciesData);
  } catch (error) {
    console.error('获取货币数据失败:', error);
    return [];
  }
};

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
    const data = await response.json();
    return data.conversion_rates;
  } catch (error) {
    console.error('获取汇率数据失败:', error);
    return {}; // 确保在出错时返回空对象
  }
};

export const getCombinedCurrencyData = async () => {
  try {
    const currencies = await fetchCurrencies();
    const exchangeRates = await fetchExchangeRates();

    if (!currencies || currencies.length === 0) {
      throw new Error('No currency data available');
    }

    return currencies
      .map(currency => ({
        ...currency,
        rate: exchangeRates[currency.code] || null
      }))
      .filter(currency => currency.rate !== null)
      .sort((a, b) => {
        if (a.code === 'CNY') return -1;
        if (b.code === 'CNY') return 1;
        if (a.code === 'USD') return -1;
        if (b.code === 'USD') return 1;
        return 0;
      })
      .slice(0, 6); // 只保留前6项
  } catch (error) {
    console.error('组合货币数据失败:', error);
    return []; // 确保在出错时返回空数组
  }
};

export const formatCurrency = (value, decimals = 2) => {
  return Number(value).toFixed(decimals);
};