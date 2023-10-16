import fs from "fs";
import process from "process";
import {readdir} from "fs/promises";

interface metaData {
  name: string;
  description: string;
  image: string;
  attributes: any[];
}

async function getFileList(dirName: string) {
  let files: string[] = [];
  const items = await readdir(dirName, {withFileTypes: true});

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${ dirName }/${ item.name }`))];
    } else {
      files.push(`${ dirName }/${ item.name }`);
    }
  }

  return files;
}

async function readDir(dirName: string) {
  let files: string[] = [];
  const fileList = await getFileList(dirName);

  for (let index = 0; index < fileList.length; index++) {
    const file = fileList[index];
    const relPath = file.replace(dirName + "/", "");
    files.push(relPath);
  }
  return files;
}

function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function main() {
  let index = 0;

  const folder = "YELLOW";
  const filePath = "collection/images/" + folder;
  const imageList = await readDir(filePath);
  console.log(imageList);

  imageList.forEach((file) => {
    // Rename the file
    fs.renameSync(filePath + '/' + file, filePath + "/flame_" + folder.toLowerCase() + "_" + index + ".png");

    index++;
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
