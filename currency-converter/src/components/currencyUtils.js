export const currencies = [
  { code: 'CNY', name: '人民币', symbol: '¥', flag: '🇨🇳' },
  { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
  { code: 'BTC', name: '比特币', symbol: '₿', flag: '₿' },
  { code: 'ETH', name: '以太币', symbol: 'Ξ', flag: 'Ξ' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$', flag: '🇸🇬' },
  { code: 'JPY', name: '日元', symbol: '¥', flag: '🇯🇵' },
  { code: 'GBP', name: '英镑', symbol: '£', flag: '🇬🇧' },
];

export const rates = {
  CNY: 1,
  USD: 0.1425,
  BTC: 0.00000223,
  ETH: 0.00005441,
  SGD: 0.1833,
  JPY: 20.6482,
  GBP: 0.1066,
};

// export const getExchangeRates = async () => {
//   // 在实际应用中，这里应该调用真实的API来获取最新汇率
//   // 现在我们使用模拟数据
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(rates), 500); // 模拟API调用延迟
//   });
// };

export const getExchangeRates = async () => {
  const apiUrl = 'https://v6.exchangerate-api.com/v6/2dfbab0e99f9426d2d269e07/latest/USD';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('网络响应不是OK');
    }

    const data = await response.json();

    if (data.result === "success") {
      return data.conversion_rates; // 返回真实的汇率数据
    } else {
      throw new Error('获取数据失败: ' + data);
    }
  } catch (error) {
    console.error('请求失败:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
};

export const formatCurrency = (value) => {
  if (value === undefined) {
    console.error('传入的值是undefined');
    return 'N/A'; // 或者返回其他默认值
  }
  return value.toFixed(2); // 假设你想要保留两位小数
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  return amount * (rates[toCurrency] / rates[fromCurrency]);
};