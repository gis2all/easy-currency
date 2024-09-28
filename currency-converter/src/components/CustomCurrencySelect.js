import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '../styles.css';

const CustomCurrencySelect = ({ options, value, onChange, onMenuOpen, onMenuClose }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '40px',
      borderRadius: '8px',
      borderColor: '#ccc',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#aaa',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // 确保下拉菜单在最上层
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // 确保菜单门户具有足够高的层级
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
      color: '#333',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
      display: 'flex',
      alignItems: 'center',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#333',
      '&:hover': {
        color: '#000',
      },
    }),
  };

  const formattedOptions = options.map((currency) => ({
    value: currency.code,
    label: (
      <div className="currency-option">
        <img src={currency.flag} alt={`${currency.code} flag`} className="currency-flag-option" />
        <span>{currency.code} - {currency.name}</span>
      </div>
    ),
  }));

  const selectedOption = formattedOptions.find(option => option.value === value) || null;

  return (
    <Select
      styles={customStyles}
      options={formattedOptions}
      value={selectedOption}
      onChange={(selected) => onChange(selected.value)}
      className="custom-select"
      classNamePrefix="react-select"
      isSearchable
      placeholder="选择货币..."
      menuPortalTarget={document.body} // 将菜单渲染到 body
      menuPosition="fixed" // 使用 'fixed' 确保定位正确
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
};

CustomCurrencySelect.defaultProps = {
  onMenuOpen: () => {},
  onMenuClose: () => {},
};

export default CustomCurrencySelect;
