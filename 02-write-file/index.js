const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Путь к файлу, куда будем записывать
const filePath = path.join(__dirname, 'output.txt');

// Настраиваем интерфейс ввода-вывода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Открываем поток для записи в файл
const logFileStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log(
  'Введите текст для записи в файл. Для выхода нажмите Ctrl+C или введите "exit".',
);

// Обработчик ввода строки
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('До свидания!');
    rl.close(); // Закрываем интерфейс ввода
    return;
  }

  // Запись в файл
  logFileStream.write(`${input}\n`, (err) => {
    if (err) {
      console.error('Ошибка записи в файл:', err);
      rl.close(); // Закрываем интерфейс на случай ошибки
    }
  });
});

// Обработчик сигнала SIGINT (Ctrl+C)
rl.on('SIGINT', () => {
  console.log('До свидания!');
  rl.close(); // Закрываем интерфейс ввода
});

// Завершение программы
rl.on('close', () => {
  console.log('Файл успешно закрыт.');
  logFileStream.end(); // Завершаем поток записи
});
