// ==========================================================
// Завдання 1 — Таймер зворотного відліку
// ==========================================================

// Підключаємо бібліотеку flatpickr для вибору дати і часу
import flatpickr from 'flatpickr';
// Підключаємо стилі flatpickr (обов'язковий додатковий імпорт)
import 'flatpickr/dist/flatpickr.min.css';

// Підключаємо бібліотеку для показу красивих повідомлень
import iziToast from 'izitoast';
// Підключаємо стилі iziToast (обов'язковий додатковий імпорт)
import 'izitoast/dist/css/iziToast.min.css';

// ----------------------------------------------------------
// 1. Отримуємо посилання на потрібні елементи DOM
// ----------------------------------------------------------
const inputEl = document.querySelector('#datetime-picker');
const startBtnEl = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

// ----------------------------------------------------------
// 2. Змінні, у яких зберігатимемо стан таймера
// ----------------------------------------------------------
// Сюди запишемо дату, яку обрав користувач (об'єкт Date)
let userSelectedDate = null;

// Сюди запишемо id інтервалу, щоб потім мати змогу його зупинити
let timerIntervalId = null;

// ----------------------------------------------------------
// 3. Налаштування flatpickr
// ----------------------------------------------------------
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // selectedDates - масив обраних дат, беремо першу
    const selectedDate = selectedDates[0];

    // Порівнюємо обрану дату з поточним моментом часу
    if (selectedDate < new Date()) {
      // Якщо дата в минулому - показуємо повідомлення про помилку
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      // Кнопка Start має бути неактивною
      startBtnEl.disabled = true;
    } else {
      // Якщо дата валідна (в майбутньому) - зберігаємо її
      userSelectedDate = selectedDate;

      // Розблоковуємо кнопку Start
      startBtnEl.disabled = false;
    }
  },
};

// Ініціалізуємо flatpickr на нашому інпуті
flatpickr(inputEl, options);

// ----------------------------------------------------------
// 4. Функція форматування чисел (додає 0 попереду)
// ----------------------------------------------------------
function addLeadingZero(value) {
  // padStart(2, '0') доповнює рядок нулем зліва, якщо в ньому 1 символ
  return String(value).padStart(2, '0');
}

// ----------------------------------------------------------
// 5. Функція, яка переводить мілісекунди у дні/години/хвилини/секунди
// ----------------------------------------------------------
function convertMs(ms) {
  // Кількість мілісекунд у кожній одиниці часу
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Скільки повних днів залишилось
  const days = Math.floor(ms / day);
  // Скільки повних годин залишилось (після днів)
  const hours = Math.floor((ms % day) / hour);
  // Скільки повних хвилин залишилось (після годин)
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Скільки повних секунд залишилось (після хвилин)
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// ----------------------------------------------------------
// 6. Функція, яка оновлює цифри на екрані
// ----------------------------------------------------------
function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// ----------------------------------------------------------
// 7. Обробник кліку на кнопку Start
// ----------------------------------------------------------
function onStartButtonClick() {
  // Поки триває відлік - інпут і кнопка недоступні
  startBtnEl.disabled = true;
  inputEl.disabled = true;

  // Запускаємо функцію tick() одразу, щоб не чекати першу секунду
  tick();

  // І далі запускаємо її кожну секунду
  timerIntervalId = setInterval(tick, 1000);
}

// ----------------------------------------------------------
// 8. Функція, яка виконується щосекунди
// ----------------------------------------------------------
function tick() {
  // Різниця у мілісекундах між обраною датою і поточним моментом
  const msLeft = userSelectedDate.getTime() - new Date().getTime();

  // Якщо часу не залишилось - зупиняємо таймер
  if (msLeft <= 0) {
    clearInterval(timerIntervalId);

    // Показуємо нулі у всіх полях
    updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Даємо користувачу змогу обрати нову дату,
    // а кнопка Start лишається неактивною, доки не обрано нову валідну дату
    inputEl.disabled = false;
  } else {
    // Інакше - рахуємо і показуємо, скільки часу залишилось
    const timeComponents = convertMs(msLeft);
    updateTimerInterface(timeComponents);
  }
}

// ----------------------------------------------------------
// 9. Навішуємо обробник на кнопку Start
// ----------------------------------------------------------
startBtnEl.addEventListener('click', onStartButtonClick);
