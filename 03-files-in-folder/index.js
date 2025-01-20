const fs = require('fs/promises');
const path = require('path');

async function displayFileInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      if (file.isFile()) {
        const stats = await fs.stat(filePath);
        const fileExtension = path.extname(file.name).slice(1);
        const fileSize = stats.size;

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
