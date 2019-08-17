import React from 'react';
import './styles.scss';

interface LoaderProps {
  visible?: boolean;
}

export default function Loader(props: LoaderProps) {
  const { visible } = props;

  const className = visible === false ? 'hidden' : '';

  return (
    <div className={`loader3 ${className}`}>
      <span />
      <span />
    </div>
  );
}
