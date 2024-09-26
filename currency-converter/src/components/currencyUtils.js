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
  
  export const getExchangeRates = async () => {
    // 在实际应用中，这里应该调用真实的API来获取最新汇率
    // 现在我们使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => resolve(rates), 500); // 模拟API调用延迟
    });
  };
  
  export const formatCurrency = (amount, digits = 2) => {
    return amount.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  export const convertCurrency = (amount, fromCurrency, toCurrency) => {
    return amount * (rates[toCurrency] / rates[fromCurrency]);
  };