// ==========================================================
// Завдання 2 — Генератор промісів
// ==========================================================

// Підключаємо бібліотеку для показу повідомлень
import iziToast from 'izitoast';
// Підключаємо стилі iziToast (обов'язковий додатковий імпорт)
import 'izitoast/dist/css/iziToast.min.css';

// ----------------------------------------------------------
// 1. Отримуємо посилання на форму
// ----------------------------------------------------------
const formEl = document.querySelector('.form');

// ----------------------------------------------------------
// 2. Функція, яка створює проміс із заданою затримкою і станом
// ----------------------------------------------------------
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Перевіряємо, який стан обрав користувач
      if (state === 'fulfilled') {
        // Проміс виконується успішно, передаємо затримку як значення
        resolve(delay);
      } else {
        // Проміс відхиляється, теж передаємо затримку як значення
        reject(delay);
      }
    }, delay);
  });
}

// ----------------------------------------------------------
// 3. Обробник відправлення форми
// ----------------------------------------------------------
function onFormSubmit(event) {
  // Забороняємо стандартну поведінку форми (перезавантаження сторінки)
  event.preventDefault();

  // Зчитуємо дані форми
  const form = event.target;
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  // Створюємо проміс і обробляємо результат його виконання
  createPromise(delay, state)
    .then(delay => {
      // Проміс виконано успішно
      iziToast.success({
        title: '✅',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      // Проміс відхилено
      iziToast.error({
        title: '❌',
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  // Очищуємо форму після відправлення
  form.reset();
}

// ----------------------------------------------------------
// 4. Навішуємо обробник на подію submit форми
// ----------------------------------------------------------
formEl.addEventListener('submit', onFormSubmit);
