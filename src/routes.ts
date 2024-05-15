import { Router, Response, Request } from "express";
import ProductsController from "./controller/products.controller";


const productsController = new ProductsController()
const productRoutes = Router()

productRoutes.post('/createProducts', async (req:Request, res:Response) =>{
  try {
     const product = req.body
     const response = await productsController.createProduct(product)
     return res.status( response.code ).json( response );
   }catch (err:any) {
     return res.status( err.code ? err.code: 500).json(err)
   }
})

productRoutes.get('/getAllProduct', async (req:Request, res:Response) =>{
    try {
        const response = await productsController.getAllProduct()
        return res.status( response.code ).json( response );
    }catch (err:any) {
      return res.status( err.code ? err.code: 500).json(err)
    }
})

productRoutes.post('/massiveLoad',async (req:Request, res:Response) =>{
    try {
        const file = req.files
        const response = await productsController.massiveLoad(file)
        return res.status( response.code ).json( response );
    }catch (err:any) {
      return res.status( err.code ? err.code: 500).json(err)
    }
})

productRoutes.get('/getProduct/:id', async (req:Request, res:Response) =>{
  try {
      const id = req.params.id 
      const response = await productsController.getProductForId(id)
      return res.status( response.code ).json( response );
  }catch (err:any) {
    return res.status( err.code ? err.code: 500).json(err)
  }
})

productRoutes.put('/updateProduct/:id', async (req:Request, res:Response) =>{
  try {
      const id = req.params.id
      const product = req.body
      const response = await productsController.updateProduct(id, product)
      return res.status( response.code ).json( response );
  }catch (err:any) {
    return res.status( err.code ? err.code: 500).json(err)
  }
})

productRoutes.delete('/deleteProduct/:id', async (req:Request, res:Response) =>{
  try {
      const id = req.params.id
      const response = await productsController.deleteProduct(id)
      return res.status( response.code ).json( response );
  }catch (err:any) {
    return res.status( err.code ? err.code: 500).json(err)
  }
})

export default productRoutes