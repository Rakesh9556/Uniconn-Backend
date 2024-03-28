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

- create a mongodb url to cconnect ------> <code>MONGODB_URI = mongodb+srv://rakeshg:<password>@cluster0</password>.zuzpq.mongodb.net</code>

#### 2. Define database in vs code

- define the name of the database inside <code>constants.js</code> and then export it
- ex: <code>export const DB_NAME = "uniconn"</code> 



#### 3. Database Connection

- Two ways:
- => function of database connection will be inside <code>index.js</code> file and our starting point of the program is <code>index.js</code>, so when the file runs the database connection function is called and the database will load

- => create a db folder and create the database connection function inside that, and import the function into <code>index.js</code> file to load, so when the file runs the database connection function is called and the database will load

- <code>mongoose.connect('url')</code> --> connect the database, but don't do this always use function to do the connection


##### Things required for connection

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


#### Solve dotenv ---> from commonjs type to module type -> in main index.js

- so first import: <code>import dotenv from "dotenv";</code>

- then config it : dotenv.config({
    path: './env'
})

- inside dev script in <code>package.json</code>  add <code>-r dotenv/config --experimental-json-modules</code>


#### Set up server after database connection

- after connectDB()
- add two method <code>.then()</code> and <code>.catch()</code>



### Cookie parser

- npm i cookie-parser

### Cors : enable cross origin resource sharing

- npm i cors

- <code>app.use</code> --> used when we use middlewares



### app.js file setup

##### Most used requests

- 1. <code>req.params</code> : most of the data come from url comes from <code>req.params</code>
- 2. <code>req.body</code> : data can be come in many ways json, url, request.body, etc

##### Setup

- 1. create a express skeleton
- 2. import both cookie parser and cors 

- 3. Configure 
- app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))

<code>
// accepting json (form data)
app.use(express.json({limit: "16kb"}))   

// accepting url data
app.use(express.urlencoded({extended: true, limit: "16kb"}))   // extended: we can give objects inside objects

// config for storing files and folders
app.use(express.static("public"))

// config to accept cookies
app.use(cookieParser())
</code>

- 4. Set middleware

#### Solve async....await lafda

- 1. sabu thara amaku database saha samparka karibara achi ta sabu thara async...await wrapper baneiba apekhya ame gote emiti utilty wrappper function baneidaba so jetebele bi amaku kichhi execute karibara achhi ame wrapper function re ama request pass karidaba  (Industry standard) ---> tara naa haba <code>asyncHandeler.js</code>   

- 2. ame jauta bi use karipariba --> <code>try...catch</code> or <code>promises</code>

#### Read about nodeJS API error and response to handle error and response in more centralized way

- 1. gote error handle kariba pain <code>util</code> bhitare file banaa, naa de <code>ApiError.js</code>

- 2. similarly response handle kariba pain <code>util</code> bhitare file banaa, naa de <code>ApiResponse.js</code>

#### Learn Server status code


### Model creation

- 1. <code>models</code> dir bhitare <code>user.model</code> gote banaa

- 2. mongoose automatically unique id generate karidaba, so sesabu ku amaku handle karibaku padibani 
- 3. mongodb unique id ku <code>bson</code> format re store kare


### Learn mongoose aggregation pipeline (Framework)

- get from <code>npmjs</code>
- <code>npm i mongoose-aggregate-paginate-v2</code>
- use: <code>import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"</code>
- add mongoose aggregrator as plugin


### learn bcrypt and bcrypt.js (used)

- hash the password

- we ame directly password encryption karipariba nahin so ame use kariba hooks(in middleware) ----> <code>pre hooks</code>

- first <code>bcrypt</code> ku import kara <code>user.models.js</code> file re

- Pre hook: gote middle ware jauta ki ame excute karipariba -----> just ama data save haba pubaru

- so pre hook use kare ---> pre hook re bahut sara event achi but ame use karib "save" event re ---> means jebe jebe ama data re kichhi changes save haba setebele ame pre hook ku  execute kariba ---> pre hook re 2 ta parameter achhi 1. kau event kariba and 2.kna callback kariba

- so callback re ame gote function ku callback kariba but ame arrow function use kariparibani kahinki na arrow function <code>this</code> -keyword ra context janini, so ame normal function use kariba and a function time consume kare so ame <code>async</code> use kariba

- function re <code>next</code> pass kariba, kahinki na sabu kama sarigala pare <code>next</code> ku call karibaku padiba taki process agaku badhiba

- so next <code>this</code> context use kari password ku access kari taku encrypt kariba ---> encrypt kariba pain <code>bcrypt.hash()</code> method use kariba padiba ---> bcrypt method re 2 ta parameter pass haba 1. kahaku hash kariba and 2. kete round hash use haba(number dabaku padiba)
 
- last ku <code>next()</code> ku call kara --- kahinki na middleware ra kama sarile next process ku run kariba taki required task complete haba

- but gote problem asuchi, jebe jebe data save haba ki update haba sabuthara a middleware password ku save karidaba ---> avatar, name, etc change hele middleware password save karidaba

- so conditional statement use kariba ---> so ame gote method use kariba aita dekhiba pain j password re kichhi modified heichi ki nahin jadi heithiba then ame password ku save kariba nahele <code>next()</code> flag ku return karidaba

- so <code>this.isModified("password")</code> - eithire <code>isModified()</code> method chek kariba j password re kichhi change heichi na nahin jadi true hela tahale ame password ku save kariba

- ebe ame kichhi method use kariba user ku check kariba pain j user jaha password input karichi sesabu thik na bhul ---> kahinki na database the password encrypted heiki achhi

- so ame <code>userSchema</code> re kichhi method baneiba pain <code>.methods</code> object ku use kari ame bahut gudae property ku access karipariba or nijara bi create karipariba

- so ame nijara gote property add kale jaha ra name hauchi <code>isPasswordCorrect</code> - a property bhitare ame gote funnction create kale jauta ki check kariba j user jaha password input karichi seita database re store thiba password saha match karuchi na nahin  ---> jehetu ame password compare karuche so function ra parameter re amaku password pass karibaku padiba

- but ethi gote issue amara database re thiba password ta encrypt heiki achi au user jaha password daba seita string re achi, tahale compare kemiti kariba?? ---> so ame use kariba <code>bcrypt</code> ra gote method jahara name hela <code>compare()</code> - a  method ku 2ta parameter darkar 1. <code>password</code> -- (user input jaha karithiba) and 2. <code>this.password</code> -- (encrypted password)  --- maethod pakhare access achi encrypted password ra, so <code>this</code> keyword re ea access karidaba 

- note kara j a process re time lagiba jehetu <code>cryptography</code> use heichi so <code>await</code> use karibaku padiba and last ku return karidaba 

### JWT (jasonwebtoken)  (used)

- to create tokens
- go to jwt.io to see how token made
- import both in <code>user.models.js</code> file


- jwt hauchi -> bearer token

- ara access ku <code>env</code> varibales file bhitare lekhibaku padiba

- so <code>ACCESS_TOKEN_SECRET</code> varibale bhitare gote complex string generate kari laekhibaku padiba

- bahut sara tool achi jauthi ki ame complex string generate karipariba jemiti ki: <code>SHA-256</code>

- similarly ame ahuri field use kariba jemiti ki <code>ACCESS_TOKEN_EXPIRY</code>, <code>REFRESH_TOKEN_SECRET</code> and <code>REFRESH_TOKEN_EXPIRY</code>

- ame <code>access token</code> ku database re store karibani, hele <code>refresh token</code> ku database re store kariba

- ame <code>access token</code> and <code>refresh token</code> generate kariba pain method baneiba <code>user.models.js</code> file re

- <code>jwt</code> pakhare <code>sign()</code> method achi jaha ki token generate kare

 











                                      