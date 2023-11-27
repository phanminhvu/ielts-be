const fs = require('fs');
const XLSX = require('xlsx');



const workbook = XLSX.readFile('./kqthi.xlsx', {
    cellText: false,
    cellDates: true,
  });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const sheetData = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      dateNF: 'DD/MM/YYYY',
      defval: "",
    });

    console.log(sheet);
    fs.writeFileSync('abc.json', JSON.stringify(sheet))