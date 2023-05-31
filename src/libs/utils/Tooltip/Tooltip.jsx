import React from 'react';
import styles from './Tooltip.module.scss';

const THEMES = {
  TOP: 'top',
  RIGHT: 'right',
  LEFT: 'left',
  BOTTOM: 'bottom',
};

const Tooltip = ({
  text,
  children,
  theme = 'BOTTOM',
  span = false,
  className,
  ...rest
}) => {
  return span ? (
    <span
      tooltip={text}
      className={`${styles.tooltip} ${styles[THEMES[theme]]} ${
        className ?? ''
      }`}
      {...rest}
    >
      {children}
    </span>
  ) : (
    <div
      tooltip={text}
      className={`${styles.tooltip} ${styles[THEMES[theme]]} ${
        className ?? ''
      }`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Tooltip;
