import MongoConn from "../../lib/mongodb";
import IProducts from "../interfaces/products.interface";
import IResponse from "../interfaces/response.interface";
import logger from "../../lib/logger";
import Products from "../models/product.model";
import CSVUtils from "../utils/csv.util";


export default class ProductsController{
  private mongoConn: MongoConn
  private csvUtil: CSVUtils

  constructor(){
    this.mongoConn = new MongoConn
    this.csvUtil = new CSVUtils
  }

  async createProduct(product: IProducts):Promise<IResponse>{
    try {
      await this.mongoConn.connectDB()
      if(product){
         const inInventory = await Products.findOne({code: product.code})
         if(inInventory){
            return({ok: false, message:"Este producto ya existe", response: null, code:404})
          } else {
              const creatingProduct = await Products.create(product)
              return({ok:true, message:"Producto creado", response: creatingProduct, code: 201})
          }
        }
        return ({ok: false, message:"Parametros Incorrectos", response: null, code:404})
    } catch (error: any) {
        logger.error('[ProductsController/createProducts]')
        return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
    } finally {
        await this.mongoConn.disconnectDB()
    }
  }

  async getAllProduct():Promise<IResponse>{
    try {
      await this.mongoConn.connectDB()  
      const allProducts = await Products.find({})
      if(allProducts.length <= 0){
        return ({ok: false, message:'No hay Productos', response: null, code: 404})
      }
      return ({ok:true, message:"Productos encontrados", response:allProducts, code: 200}) 
    }catch (error: any) {
      logger.error('[ProductsController/getAllProducts]')
      return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
    }finally{
      await this.mongoConn.disconnectDB()
    }
  }

  async massiveLoad(fileCSV: any):Promise<IResponse>{
    try {
      await this.mongoConn.connectDB() 
      if(!fileCSV){
        return ({ok:false, message:'No hay Archivo Cargado', response: null, code: 404})                                          
      }
      const { file } = fileCSV;
      if(!(file.mimetype === "text/csv")){
        return ({ok: false, message:'No se reconoce como un archivo CSV', response: null, code: 400})
      }
      const products = await this.csvUtil.csvToJson(fileCSV)
      let productsSaves = [] as any
      for(let pdt of products){
        const productsSave = await Products.create(pdt) as any 
        productsSaves.push(productsSave)
      }
      return ({ok:true, message:'Upload', response: productsSaves, code: 201})
    }catch (error: any) {
      logger.error('[ProductsController/massiveLoad]')
      return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
    }finally{
      await this.mongoConn.disconnectDB()
    }
  }

  async getProductForId(id:string):Promise<IResponse>{
    try {
      await this.mongoConn.connectDB()  
      const findProduct = await Products.findById(id)
      if(findProduct){
        return({ok: true, message:'Producto encontrado', response: findProduct, code:200})
      } 
      return ({ok: false, message:'No hay Productos', response: null, code: 404})
    }catch (error: any) {
      logger.error('[ProductsController/getProduct]')
      return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
    }finally{
      await this.mongoConn.disconnectDB()
    }
  }

  async updateProduct(id: string, product:IProducts):Promise<IResponse>{
    try {
      await this.mongoConn.connectDB()  
      const findProduct = await Products.findById(id)
      if(findProduct){
        const update = await Products.findByIdAndUpdate(findProduct._id, product)
        return({ok: true, message:'Producto actualizado', response: update, code:200})
      } 
      return ({ok: false, message:'No hay Productos', response: null, code: 404})
    }catch (error: any) {
      logger.error('[ProductsController/updateProduct]')
      return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
    }finally{
      await this.mongoConn.disconnectDB()
    }
  }

  async deleteProduct(id: string):Promise<IResponse>{
    try {
      await this.mongoConn.connectDB()  
      const findProduct = await Products.findById(id)
      if(findProduct){
        const deleteProd = await Products.findByIdAndDelete(findProduct._id)
        return({ok: true, message:'Producto Eliminado', response: deleteProd, code:200})
      } 
      return ({ok: false, message:'No hay Productos', response: null, code: 404})
    }catch (error: any) {
      logger.error('[ProductsController/deleteProduct]')
      return({ok: false, message: "Ocurrio un Error", response: null, code: 500})
    }finally{
      await this.mongoConn.disconnectDB()
    }
  }
}