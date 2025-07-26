import React from 'react';

const ActionButton = ({ onClick, type = 'primary', variant, size = 'small', icon, children }) => {
  const getButtonClass = () => {
    const baseClass = 'action-btn';
    // Usar variant si está presente, sino usar type
    const buttonType = variant || type;
    const typeClass = `action-btn-${buttonType}`;
    const sizeClass = `action-btn-${size}`;
    return `${baseClass} ${typeClass} ${sizeClass}`;
  };

  return (
    <button className={getButtonClass()} onClick={onClick}>
      {icon && <span className="action-btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default ActionButton;