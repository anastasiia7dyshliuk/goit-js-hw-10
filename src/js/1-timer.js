import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const inputEl = document.querySelector('#datetime-picker');
const startBtnEl = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;

let timerIntervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      startBtnEl.disabled = true;
    } else {
      userSelectedDate = selectedDate;

      startBtnEl.disabled = false;
    }
  },
};

flatpickr(inputEl, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function onStartButtonClick() {
  startBtnEl.disabled = true;
  inputEl.disabled = true;

  tick();
  timerIntervalId = setInterval(tick, 1000);
}

function tick() {
  const msLeft = userSelectedDate.getTime() - new Date().getTime();

  if (msLeft <= 0) {
    clearInterval(timerIntervalId);

    updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    inputEl.disabled = false;
  } else {
    const timeComponents = convertMs(msLeft);
    updateTimerInterface(timeComponents);
  }
}

startBtnEl.addEventListener('click', onStartButtonClick);