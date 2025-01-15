// Подключаем необходимые модули
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Формируем путь к файлу, который будет создан
const filePath = path.join(__dirname, 'output.txt');

// Создаем интерфейс для чтения с консоли
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Функция для записи текста в файл (асинхронно)
function writeToFile(text) {
  fs.appendFile(filePath, text + '\n', (err) => {
    if (err) {
      console.error('Ошибка записи в файл:', err.message);
    }
  });
}

// Функция для запроса ввода текста
function askQuestion() {
  rl.question('Введите текст для записи в файл!: ', (input) => {
    if (input === 'exit') {
      // Если введено "exit", выводим прощальное сообщение и завершаем программу
      console.log('Процесс завершен. До свидания!');
      rl.close(); // Закрываем интерфейс
      process.exit(); // Завершаем процесс
    } else {
      // Записываем введенный текст в файл
      writeToFile(input);
      // После записи ждем следующий ввод
      askQuestion();
    }
  });
}

// Обработчик для сигнала Ctrl + C (SIGINT)
process.on('SIGINT', () => {
  console.log('\nПроцесс был завершен с помощью Ctrl + C. До свидания!');
  rl.close(); // Закрываем интерфейс
  process.exit(); // Завершаем процесс
});

// Проверка существования файла и создание его, если не существует
fs.open(filePath, 'a', (err) => {
  if (err) {
    console.error('Ошибка при открытии файла:', err.message);
    process.exit(1); // Завершаем процесс в случае ошибки
  }

  // Выводим приветствие перед запросом ввода
  console.log('Добро пожаловать! Введите текст, который будет записан в файл.');
  askQuestion(); // Начинаем цикл ввода
});
