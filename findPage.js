const fs = require("fs");
const axios = require("axios");

const flag = "Zabbix SIA"; // Это слово можно грепнуть из curl к вашему искомому ресурсу
const outFile = "zabbix-search.txt"; // названия файла с результатом работы
const inputFile = "./ipList.txt"; // файл со списком ip в один столбец без портов
const port = 80; // на каком порту сервисы

const errorArrayIP = [];

async function findPage(flag) {
  const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);
  lines.pop();

  const promisesArray = lines.map((ip) => getPage(ip, flag));

  Promise.all(promisesArray).then((values) => {
    fs.writeFileSync(
      outFile,
      values.filter((value) => value != null).join("\n")
    );
    // fs.writeFileSync('errorsAdmin.txt', errorArrayIP.join('\n'));
  });
}

async function getPage(ip, flag) {
  console.log(ip);
  const url = new URL(`http://${ip}:${port}/`);

  try {
    const response = await axios.get(url, { timeout: 20000 });
    const data = await response.data;
    return data.match(flag) ? ip : null;
  } catch {
    errorArrayIP.push(ip);
  }
}

findPage(flag);
