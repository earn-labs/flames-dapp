import fs from "fs";
import process from "process";
import {readdir} from "fs/promises";

const url = "ipfs://bafybeifzdbsgwpnj37c3tzj4pkut3b2pgf2u75mf3zmbto657ep2ubwf6a/";

interface metaData {
  name: string;
  description: string;
  image: string;
  attributes: any[];
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

async function main() {


  let index = 0;

  const imageList = await readDir("collection/images");
  imageList.sort().reverse();

  // write logs
  fs.writeFile('./collection/logs.txt', index + ": " + imageList[0] + "\n", function (err) {});

  // write metadata of first image (will be burned)
  const [color, name] = imageList[0].split("/");

  // write metadata files
  let json: metaData;
  json = {
    name: "Flame #" + index,
    description: "Buy, hold, earn, and burn!",
    image:
      url +
      color + '/' + name.toString(),
    attributes: [
      {
        trait_type: "Color",
        value: 'WHITE',
      },
    ],
  };

  fs.writeFileSync(
    "./collection/metadata/" + index,
    JSON.stringify(json)
  );
  index++;

  // randomize remaining images and write metadata
  const trueImageList = imageList.slice(1);

  const randomizedList = shuffle(trueImageList);
  randomizedList.forEach((file) => {
    const [color, name] = file.split("/");

    // write logs
    fs.appendFile('./collection/logs.txt', index + ": " + file + "\n", function (err) {});

    // write metadata file
    let json: metaData;
    json = {
      name: "Flame #" + index,
      description: "Buy, hold, earn, and burn!",
      image:
        url +
        color + '/' + name.toString(),
      attributes: [
        {
          trait_type: "Color",
          value: color,
        },
      ],
    };

    fs.writeFileSync(
      "./collection/metadata/" + index,
      JSON.stringify(json)
    );

    index++;
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
