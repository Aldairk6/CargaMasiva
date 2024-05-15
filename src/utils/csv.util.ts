import  path  from "path"
import csvToJson from "convert-csv-to-json"
import fs from "fs"

export default class CSVUtils{
   private dirPath = path.join(__dirname, '../uploads/csv')
   
   async csvToJson(fileCSV: any){
     const { file } = fileCSV;
     const dir = path.join(this.dirPath, 'nombre.csv');

     await file.mv(dir);

     let dataJson = csvToJson.parseSubArray('*',',').fieldDelimiter(',').supportQuotedField(true).formatValueByType(true).getJsonFromCsv(dir);
     await fs.promises.unlink(dir)
     return dataJson
   }
}

