import lampixDOM from '@lampix/dom';

import './styles.css';

let counter = 0;

const counterElement = document.getElementsByClassName('counter')[0];
counterElement.textContent = 'Loading...';

const increaseCount = () => {
  counter++;
};

const updateCounterElement = () => {
  counterElement.textContent = counter;
};

const initialize = async () => {
  const buttonOptions = {
    label: 'Increase count',
    labelPosition: 'top',
    scaleFactor: 1.2,
    animationDuration: 250
  };

  const callback = () => {
    increaseCount();
    updateCounterElement();
  };

  await lampixDOM.buttons.generate(
    window.innerWidth / 2,
    window.innerHeight - 200,
    callback,
    buttonOptions
  );

  updateCounterElement();
};

initialize();
