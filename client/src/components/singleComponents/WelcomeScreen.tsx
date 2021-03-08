import React, { useEffect } from 'react';

export default ({name, close}) => {
  useEffect(()=>{
    setTimeout(()=>{
      close();
    }, 5000);
  })
  return (
    <div className="welcome-screen">
      <div className="welcome-screen_line">Добро</div>
      <div className="welcome-screen_line">пожаловать,</div>
      <div className="welcome-screen_line">{name}</div>
    </div>
  )
}
