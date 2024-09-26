import React from 'react';
import styles from './styles';

const ResultDisplay = ({ result }) => {
  return result ? (
    <p className={styles.result}>{result}</p>
  ) : null;
};

export default ResultDisplay;