const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  try {
    // Создаем папку назначения, если она не существует
    await fs.mkdir(dest, { recursive: true });

    // Очищаем папку назначения
    const destFiles = await fs.readdir(dest).catch(() => []);
    await Promise.all(
      destFiles.map(async (file) => {
        const filePath = path.join(dest, file);
        await fs.unlink(filePath).catch(() => {});
      }),
    );

    const entries = await fs.readdir(src, { withFileTypes: true });

    // Копируем файлы и папки
    await Promise.all(
      entries.map(async (entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          // Рекурсивно копируем вложенные папки
          await copyDir(srcPath, destPath);
        } else {
          // Копируем файл
          await fs.copyFile(srcPath, destPath);
        }
      }),
    );

    console.log(`Копирование из "${src}" в "${dest}" завершено!`);
  } catch (err) {
    console.error('Ошибка при копировании:', err.message);
  }
}

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

copyDir(srcFolder, destFolder).catch((err) =>
  console.error('Критическая ошибка:', err),
);
