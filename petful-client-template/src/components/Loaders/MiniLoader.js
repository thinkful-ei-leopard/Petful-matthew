import React from 'react';

import './MiniLoader.css';

function MiniLoader() {
  return (
    <div className='MiniLoader'>
      <div className='MiniLoader__loading'>
        <p>loading</p>
        <span></span>
      </div>
    </div>
  );
}

export default MiniLoader;