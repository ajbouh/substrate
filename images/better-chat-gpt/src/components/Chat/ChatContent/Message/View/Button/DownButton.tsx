import React from 'react';

import DownChevronArrow from '@icon/DownChevronArrow';

import BaseButton from './BaseButton';

const DownButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <BaseButton
      icon={<DownChevronArrow />}
      buttonProps={{ 'aria-label': 'shift message down' }}
      onClick={onClick}
    />
  );
};

export default DownButton;
