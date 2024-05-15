import mongoose, { Schema } from "mongoose";
import IProducts from "../interfaces/products.interface";


const productSchema = new Schema<IProducts>({
   code: {type: Number, required: true},
   cluster: {type: String, required: true},
   product: {type: String, required: true},
   um: {type: String, required: true, enum:['KG','PZ']},
   stock: {type: Number, required: true}
}, {collection:'products'})

const Products = mongoose.model('products', productSchema)
export default Products
