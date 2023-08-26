// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const elements = {
  inputEl: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};
let timerId = null;
function startCounter(date) {
  timerId = setInterval(() => {
    const current = new Date();
    const remainder = date - current;
    if (remainder <= 0) {
      clearInterval(timerId);
      Notiflix.Notify.success('The counter is over!');
      elements.startBtn.disabled = false;
      return;
    }
    const time = convertMs(remainder);
    formatTime(time);
  }, 1000);
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
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function formatTime(time) {
  elements.daysEl.textContent = addLeadingZero(time.days);
  elements.hoursEl.textContent = addLeadingZero(time.hours);
  elements.minutesEl.textContent = addLeadingZero(time.minutes);
  elements.secondsEl.textContent = addLeadingZero(time.seconds);
}
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const todayDay = new Date();
    const futureDay = selectedDates[0];
    if (todayDay >= futureDay) {
      elements.startBtn.disabled = true;
      Notiflix.Notify.warning('Please choose a date in the future');
    } else {
      elements.startBtn.disabled = false;
    }
  },
};
flatpickr('#datetime-picker', options);
elements.startBtn.addEventListener('click', () => {
  const selectedDate = new Date(elements.inputEl.value);
  startCounter(selectedDate);
  elements.startBtn.disabled = true;
});
