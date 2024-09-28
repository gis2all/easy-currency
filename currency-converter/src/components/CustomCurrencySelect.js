import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '../styles.css';

const CustomCurrencySelect = ({ options, value, onChange, onMenuOpen, onMenuClose, minimal }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: minimal ? '30px' : '200px',  // 控制宽度
      minHeight: '40px',
      borderRadius: '8px',
      borderColor: 'transparent',  // 使边框透明
      backgroundColor: 'red',  // 设置背景颜色为红色
      boxShadow: 'none',
      cursor: 'pointer',  // 确保鼠标为指针形状
      '&:hover': {
        borderColor: 'transparent',
      },
      display: 'flex',
      justifyContent: minimal ? 'center' : 'space-between',  // 在minimal模式下居中显示箭头
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'none',
    }),
    placeholder: (provided) => ({
      ...provided,
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: minimal ? '0' : '0 8px',
      color: minimal ? '#666' : '#444',  // 调整箭头颜色
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: minimal ? '0' : provided.padding,
      background: 'transparent',  // 确保背景透明
      border: 'none',  // 确保没有边框
    }),
    menu: (provided) => ({
      ...provided,
      width: '200px'  // 设置弹出选择器的固定宽度
    }),
    separator: (provided) => ({
      ...provided,
      display: 'none'  // 去除分隔符
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
    menuList: (provided) => ({
      ...provided,
      "div[role='separator']": {
        display: 'none'  // 隐藏分隔符
      }
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none'  // 隐藏指示器分隔线
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
      isSearchable={false}  // 禁用搜索功能，避免出现光标
      placeholder={minimal ? '' : '选择货币...'}
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
