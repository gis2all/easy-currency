const API_KEY = '2dfbab0e99f9426d2d269e07';

// 缓存对象
const cache = {
  currencies: null,
  exchangeRates: {},
  lastFetchTime: {
    currencies: null,
    exchangeRates: {}
  }
};

// 缓存有效期（毫秒）
const CACHE_DURATION = 5 * 60 * 1000;

// 检查缓存是否有效
const isCacheValid = (key, baseCurrency = null) => {
  const now = Date.now();
  const lastFetchTime = key === 'currencies' 
    ? cache.lastFetchTime.currencies 
    : cache.lastFetchTime.exchangeRates[baseCurrency];
  return lastFetchTime && (now - lastFetchTime) < CACHE_DURATION;
};

// 优先国家映射
const priorityCountries = {
  USD: 'United States', EUR: 'Germany', GBP: 'United Kingdom',
  JPY: 'Japan', CHF: 'Switzerland', AUD: 'Australia',
  CAD: 'Canada', CNY: 'China', HKD: 'Hong Kong', NZD: 'New Zealand'
};

// 从API获取数据
const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// 处理国家数据
const processCurrencyData = (data) => {
  const currenciesData = {};
  
  // 处理优先国家和其他国家
  data.forEach(country => {
    if (country.currencies) {
      Object.entries(country.currencies).forEach(([code, details]) => {
        if (!currenciesData[code] || priorityCountries[code] === country.name.common) {
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
};

export const fetchCurrencies = async () => {
  if (isCacheValid('currencies')) {
    return cache.currencies;
  }

  try {
    const data = await fetchData('https://restcountries.com/v3.1/all');
    const currencies = processCurrencyData(data);
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
    const data = await fetchData(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
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
    const [currencies, exchangeRates] = await Promise.all([
      fetchCurrencies(),
      fetchExchangeRates('USD')
    ]);

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
      });
  } catch (error) {
    console.error('组合货币数据失败:', error);
    return [];
  }
};

export const formatCurrency = (value, decimals = 2) => Number(value).toFixed(decimals);

export const formatAmount = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? '0' : parseFloat(num.toFixed(6)).toString();
};
