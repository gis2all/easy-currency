import React, { useState, useEffect } from 'react';
import { currencies } from './currencyUtils';
import styles from './styles';

const CurrencyForm = ({ onConvert }) => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('CNY');
  const [toCurrency, setToCurrency] = useState('USD');

  useEffect(() => {
    onConvert(amount, fromCurrency, toCurrency);
  }, [amount, fromCurrency, toCurrency, onConvert]);

  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="amount" className={styles.label}>金额:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="fromCurrency" className={styles.label}>从:</label>
        <select
          id="fromCurrency"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className={styles.select}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name} ({currency.code})
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="toCurrency" className={styles.label}>到:</label>
        <select
          id="toCurrency"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className={styles.select}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name} ({currency.code})
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default CurrencyForm;