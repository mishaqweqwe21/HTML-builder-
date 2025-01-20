const fs = require('fs').promises;
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const distHTML = path.join(distFolder, 'index.html');
const distCSS = path.join(distFolder, 'style.css');

async function buildHTML() {
  let templateContent = await fs.readFile(templatePath, 'utf-8');
  const componentFiles = await fs.readdir(componentsPath);

  for (let file of componentFiles) {
    const componentName = path.parse(file).name;
    const componentPath = path.join(componentsPath, file);

    if (path.extname(file) === '.html') {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      const templateTag = `{{${componentName}}}`;
      templateContent = templateContent.replace(
        new RegExp(templateTag, 'g'),
        componentContent,
      );
    }
  }

  await fs.writeFile(distHTML, templateContent);
}

async function buildCSS() {
  const files = await fs.readdir(stylesFolder);
  let stylesContent = '';

  for (let file of files) {
    if (path.extname(file) === '.css') {
      const filePath = path.join(stylesFolder, file);
      const content = await fs.readFile(filePath, 'utf-8');
      stylesContent += content + '\n';
    }
  }

  await fs.writeFile(distCSS, stylesContent);
}

async function copyAssets() {
  const copy = async (source, destination) => {
    const entries = await fs.readdir(source, { withFileTypes: true });
    await fs.mkdir(destination, { recursive: true });

    for (let entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await copy(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }
  };

  await copy(assetsFolder, path.join(distFolder, 'assets'));
}

async function buildPage() {
  await fs.mkdir(distFolder, { recursive: true });
  await Promise.all([buildHTML(), buildCSS(), copyAssets()]);
}

buildPage().catch((err) => console.error('Error during build:', err));
