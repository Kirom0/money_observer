import React from "react";

const icons = [
  {name: 'bus', src: 'img/icons/bus.svg'},
  {name: 'car', src: 'img/icons/car.svg'},
  {name: 'food', src: 'img/icons/food.svg'},
  {name: 'fuel-pump', src: 'img/icons/fuel-pump.svg'},
  {name: 'game-controller', src: 'img/icons/game-controller.svg'},
  {name: 'heartbeat', src: 'img/icons/heartbeat.svg'},
  {name: 'honesty', src: 'img/icons/honesty.svg'},
  {name: 'iphone', src: 'img/icons/iphone.svg'},
  {name: 'mortarboard', src: 'img/icons/mortarboard.svg'},
  {name: 'mortgage', src: 'img/icons/mortgage.svg'},
  {name: 'salary', src: 'img/icons/salary.svg'},
  {name: 'shirt', src: 'img/icons/shirt.svg'},
  {name: 'shopping-basket', src: 'img/icons/shopping-basket.svg'},
  {name: 'taxes', src: 'img/icons/taxes.svg'},
  {name: 'traveling', src: 'img/icons/traveling.svg'},
];

export const defaultAppContextValue = {
  icons: Object.fromEntries(icons.map((icon)=>[icon.name, icon])),
  auth: {
    vk_oauth_uri: '',
  },
  modal: {
    active: false,
    turnOn: undefined,
    turnOff: undefined,
  },
}

export const AppContext = React.createContext(defaultAppContextValue);
