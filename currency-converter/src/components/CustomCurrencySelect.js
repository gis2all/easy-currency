import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '../styles.css';

const CustomCurrencySelect = ({ options, value, onChange, onMenuOpen, onMenuClose, minimal }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: minimal ? '20px' : '200px',  // 在minimal模式下减小宽度
      padding: '0',
      height: '20px',
      minHeight: minimal ? '20px' : '40px',  // 在minimal模式下减小高度
      borderRadius: '8px',
      borderColor: 'transparent',  // 使边框透明
      backgroundColor: 'transparent',  // 改为透明背景
      boxShadow: 'none',
      cursor: 'pointer',  // 确保鼠标为指针形状
      '&:hover': {
        borderColor: 'transparent',
      },
      display: 'flex',
      justifyContent: 'center',  // 始终居中对齐
      alignItems: 'center',  // 垂直居中
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
      padding: '0 0 80px 0',
      margin: '0 ',  // 移除所有margin
      color: minimal ? '#666' : '#444',  // 调整箭头颜色
      width: minimal ? '40px' : 'auto',  // 在minimal模式下固定宽度
      height: minimal ? '20px' : 'auto',  // 在minimal模式下固定高度
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      background: 'transparent',  // 确保背景透明
      border: 'none',  // 确保没有边框
      width: minimal ? '20px' : 'auto',  // 在minimal模式下固定宽度
      height: minimal ? '20px' : 'auto',  // 在minimal模式下固定高度
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '400px', // 设置最小宽度
      width: 'auto', // 让宽度自适应内容
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 添加阴影效果
      borderRadius: '8px', // 圆角
      padding: '8px', // 内边距
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
      padding: '12px', // 增加内边距
      transition: 'background-color 0.2s', // 添加过渡效果
      '&:hover': {
        backgroundColor: '#b3d4fc', // 鼠标悬停背景色
      },
    }),
    menuList: (provided) => ({
      ...provided,
      "div[role='separator']": {
        display: 'none'  // 隐藏分隔符
      },
      padding: 0, // 移除内边距
      '::-webkit-scrollbar': {
        width: '6px', // 滚动条宽度
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent', // 滚动条背景色
      },
      '::-webkit-scrollbar-thumb': {
        background: '#888', // 滚动条颜色
        borderRadius: '3px', // 滚动条圆角
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#555', // 鼠标悬停时滚动条颜色
      },
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
