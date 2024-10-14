import React, { useMemo } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '../styles.css';

// 自定义样式对象，使用useMemo优化性能
const useCustomStyles = (minimal) => useMemo(() => ({
  control: (provided) => ({
    ...provided,
    width: minimal ? '20px' : '200px',
    padding: 0,
    height: '20px',
    minHeight: minimal ? '20px' : '40px',
    borderRadius: '8px',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    cursor: 'pointer',
    '&:hover': { borderColor: 'transparent' },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  singleValue: () => ({ display: 'none' }),
  placeholder: () => ({ display: 'none' }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '0 0 80px 0',
    margin: 0,
    color: minimal ? '#666' : '#444',
    width: minimal ? '40px' : 'auto',
    height: minimal ? '20px' : 'auto',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    background: 'transparent',
    border: 'none',
    width: minimal ? '20px' : 'auto',
    height: minimal ? '20px' : 'auto',
  }),
  menu: (provided) => ({
    ...provided,
    minWidth: '400px',
    width: 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '8px',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
    color: '#333',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    transition: 'background-color 0.2s',
    '&:hover': { backgroundColor: '#b3d4fc' },
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    '::-webkit-scrollbar': { width: '6px' },
    '::-webkit-scrollbar-track': { background: 'transparent' },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '3px',
      '&:hover': { background: '#555' },
    },
  }),
  // 隐藏不需要的元素
  separator: () => ({ display: 'none' }),
  indicatorSeparator: () => ({ display: 'none' }),
}), [minimal]);

const CustomCurrencySelect = ({ options, value, onChange, onMenuOpen, onMenuClose, minimal }) => {
  const customStyles = useCustomStyles(minimal);

  // 使用useMemo优化选项格式化
  const formattedOptions = useMemo(() => options.map((currency) => ({
    value: currency.code,
    label: (
      <div className="currency-option">
        <img src={currency.flag} alt={`${currency.code} flag`} className="currency-flag-option" />
        <span>{currency.code} - {currency.name}</span>
      </div>
    ),
  })), [options]);

  const selectedOption = formattedOptions.find(option => option.value === value) || null;

  return (
    <Select
      styles={customStyles}
      options={formattedOptions}
      value={selectedOption}
      onChange={(selected) => onChange(selected.value)}
      className="custom-select"
      classNamePrefix="react-select"
      isSearchable={false}
      placeholder={minimal ? '' : '选择货币...'}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
    />
  );
};

CustomCurrencySelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
  minimal: PropTypes.bool,
};

CustomCurrencySelect.defaultProps = {
  onMenuOpen: () => {},
  onMenuClose: () => {},
  minimal: false,
};

export default CustomCurrencySelect;
