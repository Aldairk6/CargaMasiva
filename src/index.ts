import HttpServer from "./class/server.class"
import express from 'express'
import cors from 'cors'
import fileForge from "express-fileupload"
import productRoutes from "./routes"

const server = HttpServer.instance

server.app.enable('trusty proxy')

server.app.use(fileForge({createParentPath:true,}))
server.app.use(express.urlencoded({extended: true, limit:'50mb'}))
server.app.use(express.json({limit:'50mb'}))

server.app.use(cors({origin:true, credentials:true}))
server.app.use('/api', productRoutes) 
server.start();