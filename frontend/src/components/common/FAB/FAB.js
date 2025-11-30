import React from 'react';
import './FAB.css';

export default function FAB({ icon, onClick }) {
  return (
    <button className="fab" onClick={onClick}>
      {icon}
    </button>
  );
}
