# Uniconn - a social platform to connect stdents, faculties, university together under a hood

## Note:
- images are stored in third party service but temporaily they are stroed in server also in case of connection lost it will help

## File Structure (Create one by one)

#### Public : a public folder

#### temp: a temp folder

#### .gitkeep : stores the descriptions of the files that will push into the repo

#### .gitignore : stores the descriptions of the files that will be ignored or will not push into the repo
- gitignore.io  generator--> overally shows which files will be not added to git, so provide the content of those files  ---> search for node and copy ---> paste inside gitignore file 

#### .env: envirnmental varibales -----> contain configuration settings, API keys, database URLs, and other sensitive information that an application needs to run. 
- on pushing .env into github it shows warning---> so create a .env.sample file 

#### .env.sample  --> to push env variable to git 


#### src:  folder

#### index.js:

#### app.js: 

#### constants.js:  store the name of all constants files so that it will be easy to manage

#### package.json ----> "type" : "module"
- in js 2 types of importing is done - 1 => commonjs (require syntax)--default, 2 => module (import syntax)------> so change the type to module


#### Dependency and Dev Dependency

- Dev dependency - only used during the development duration not used in production


#### Nodemon - dev dependency
- problem arise when we reload or update something in files, we need to restart the server again and again to see the updated changes, so to resolve this we can use thirdparty utility Nodemon

- install: <code>npm i nodemon </code>  ----> main dependency

- it automatically restart the server when file changes or updated

- install: <code>npm i -D nodemon</code>  ----> dev dependency (mostly used as dev dependency)

- we need to tell nodemon to reload our server when some changes happend in our files
- so, in <code>package.json</code> create a <code>dev</code> script
- the nodemon will goto the src folder and track changes in <code>index.js</code> file
- so, <code>"dev": "nodemon src/index.js"</code>


#### Problem in envirmental varible utility

- as we have declared the <code>"type" : "module"</code>, but the .env require import type as <code>require</code> syntax

- we will resolve this later

### inside src create

#### controllers: folder

#### db: folder to store database connection file

#### middlewares: folder to store middle ware functionalities

- codes that we need to run in between
- a request arise and the request is fullfilled by server, but before that in between if we want to do some checkings we can do with middlewares

#### models: folder to store data models

#### routes: folder to store different routes

#### utils: folder to store utilities

- example: file uploading, mailing, etc



#### Prettier - dev dependency

- install: <code>npm i -D prettier</code>

- to config prettier, create a file <code>.prettierrc</code>

- content: <code> {
    "singlequote": false,
    "bracketSpacing": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "semi": true 
}
</code>

- also create a file to ignore certain files using prettier , create file <code>.prettierignore</code>
- so the files are <code>/.vscode, /node_modules, ./dist,  *env, .env, .env.*</code> 


### Connect database to MERN

#### 1. MongoDB Atlas -> a sub service of mongodb to provide online database

- set up the atlas

- we need a string to access our database ---> copy the compass string

- setup the <code>.env</code> file

- create a port ---> <code>PORT = 8000</code>

- create a mongodb url to cconnect ------> <code>MONGODB_URI = mongodb+srv://rakeshg:<password>@cluster0.zuzpq.mongodb.net</code>

#### 2. Define database in vs code
- define the name of the database inside <code>constants.js</code> and then export it
- ex: <code>export const DB_NAME = "uniconn"</code> 

#### 3. Database Connection

- Two ways:
- => function of database connection will be inside <code>index.js</code> file and our starting point of the program is <code>index.js</code>, so when the file runs the database connection function is called and the database will load

- => create a db folder and create the database connection function inside that, and import the function into <code>index.js</code> file to load, so when the file runs the database connection function is called and the database will load

- <code>mongoose.connect('url')</code> --> connect the database, but don't do this always use function to do the connection

- Things required for connection

- <code>npm i dotenv</code>  ---> to import dotenv dependency
- <code>npm i mongoose</code>   ---> to import mongoose
- <code>npm i express</code>   ---> to import express
- We can import all in single line: <code>npm i dotenv mongoose express</code>
- can chesk the packages are successfully imported or not in <code>package.json</code>


##### Note

- 1. problem will arise when connecting with database so always use <code>try...catch</code> or promises

- 2. database always lie in far distance, means it will take time to load, so always use <code>async...await</code>  ----> used for error handelling

#### IIFE  --> function that is called immediately after it is declared
- Syntax: <code>(() => {})()</code>

### Connection:

#### 1. First Approach

- import mongoose
- import express
- import the name of the database stored inside the constants

<code>
import mongoose from "mongoose";
import { DB_NAME } from "./constants";


import express from "express"

const app = express()

// IIFE function used
(async () => {
    try { 
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Error:", error)
            throw error 
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port: http://${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("Error", error)  
        throw err
    }
})()
</code>


#### 2. Second Approach
- take a file in another folder write the connection code there and export the connection ---> now import the connection in <code>index.js</code> file and use

- create a <code>index.js</code> file inside <code>db</code> folder


<code>
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected succesfully and hosted at: ${connectionInstance.connection.host}`);
        
    } catch (error ) {
        console.error("MongoDB connection error", error);
        process.exit(1)  // process exit instead of throw error
    }
}

export default connectDB
</code>


#### Solve dotenv ---> from commonjs type to module type

- so first import: <code>import dotenv from "dotenv";</code>

- then config it : dotenv.config({
    path: './env'
})

- inside dev script in <code>package.json</code>  add <code>-r dotenv/config --experimental-json-modules</code>








                                      