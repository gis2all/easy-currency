const API_KEY = '2dfbab0e99f9426d2d269e07'; // 您的 API 密钥

// 缓存对象
const cache = {
  currencies: null,
  exchangeRates: {},
  lastFetchTime: {
    currencies: null,
    exchangeRates: {}
  }
};

// 检查缓存是否有效（5分钟内）
const isCacheValid = (key, baseCurrency = null) => {
  const now = Date.now();
  if (key === 'currencies') {
    return cache.lastFetchTime.currencies && (now - cache.lastFetchTime.currencies) < 5 * 60 * 1000;
  } else if (key === 'exchangeRates') {
    return cache.lastFetchTime.exchangeRates[baseCurrency] && (now - cache.lastFetchTime.exchangeRates[baseCurrency]) < 5 * 60 * 1000;
  }
  return false;
};

// 优先国家映射
const priorityCountries = {
  USD: 'United States',
  EUR: 'Germany', // 作为欧元区的代表
  GBP: 'United Kingdom',
  JPY: 'Japan',
  CHF: 'Switzerland',
  AUD: 'Australia',
  CAD: 'Canada',
  CNY: 'China',
  HKD: 'Hong Kong',
  NZD: 'New Zealand'
};

export const fetchCurrencies = async () => {
  if (isCacheValid('currencies')) {
    return cache.currencies;
  }

  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    const currenciesData = {};

    // 首先处理优先国家
    data.forEach(country => {
      if (country.currencies) {
        Object.entries(country.currencies).forEach(([code, details]) => {
          if (priorityCountries[code] && country.name.common === priorityCountries[code]) {
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

    // 然后处理其他国家
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

    const currencies = Object.values(currenciesData);
    cache.currencies = currencies;
    cache.lastFetchTime.currencies = Date.now();
    return currencies;
  } catch (error) {
    console.error('获取货币数据失败:', error);
    return [];
  }
};

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  if (isCacheValid('exchangeRates', baseCurrency)) {
    return cache.exchangeRates[baseCurrency];
  }

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
    const data = await response.json();
    cache.exchangeRates[baseCurrency] = data.conversion_rates;
    cache.lastFetchTime.exchangeRates[baseCurrency] = Date.now();
    return data.conversion_rates;
  } catch (error) {
    console.error('获取汇率数据失败:', error);
    return {};
  }
};

export const getCombinedCurrencyData = async () => {
  try {
    const currencies = await fetchCurrencies();
    const exchangeRates = await fetchExchangeRates('USD');

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
        if (a.code === 'USD') return -1;
        if (b.code === 'USD') return 1;
        if (a.code === 'CNY') return -1;
        if (b.code === 'CNY') return 1;
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