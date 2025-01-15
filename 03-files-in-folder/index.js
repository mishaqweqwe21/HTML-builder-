const fs = require('fs/promises');
const path = require('path');

async function displayFileInfo() {
  try {
    // Читаем содержимое папки secret-folder
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      // Проверяем, что это файл, а не папка
      if (file.isFile()) {
        // Получаем информацию о файле
        const stats = await fs.stat(filePath);
        const fileExtension = path.extname(file.name).slice(1); // Получаем расширение файла
        const fileSize = stats.size; // Получаем размер файла в байтах

        // Выводим информацию о файле
        console.log(
          `${path.basename(file.name, path.extname(file.name))} - ${fileExtension} - ${fileSize}b`,
        );
      }
    }
  } catch (err) {
    console.error('Ошибка при чтении файлов:', err);
  }
}

displayFileInfo();
