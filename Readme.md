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



### File Uploading 

- 1. frontend pakhare file uploading pain adhika resource nahin, fronetend re ame kebala form baneipariba, file ku browse karipariba and link deipariba upload kariba pain ---> but actual upload backend re hue

- 2. production level re file handeling kebe nija server re hueni, most of the case third party service dwara hin heithae or aws

- 3. File uploader code ku separte util function baneiki rakhiba or middleware kari rakhiba ---> ame aku standaalone kari rakhiba taki reuse karipariba ame 

- 4. widely used service file handeling pain hauchi <code>Cloudinary</code>

- 5. file upload kariba pain amaku 2 package nihati darkar: 1. <code>express-fileupload</code> and 2. <code>multer</code> ---> a 2 ta bhitaru gote choose karibaku padiba

- 6.  cloudinary ku jaiki account create kari, taku insatll kariba project re

- 7. multer ku install kariba project re

#### Kemiti file storing work kariba

- ame multer through re user tharu file naba and taku ama local server re temporary rakhidaba ---> then ame cloudnary ku use kariki local storage ru file nei cloudnary server re rakhidaba


- 8. cloudinary ku config kariba <code>util</code> folder bhitare -->  goal hela aa bhiatare jaha bi file asiba filesystem through ru asiba  jau guda ki server re upload heisarichi

- 9. so cloudinaray file re <code>cloudinaray</code> au <code>fs</ code> - file system ku import kariba --> file system help kare amaku file ku read, write, remove, permission cahnge kama kariba pain 

- 10. file system work kare 2 ta method re <code>link</code> au <code>unlink</code>  --> file system ru kichhi file delete kale seita unlink heijae and add kale link heijae 

- 11. jehetu cloudinary config gudaka sensitive so sesabu ku ame <code>.env</code> file bhitare store kari rakhiba  ---> asabu configuration hin amaku file uploading permission daba

- 12. <code>cloudinary uploader</code> --> ku use kari ame ame local storage re file nei cloudinary re ipload karidaba, but gote issue achhi ---> asabu re bahut sara problem ase au time consuming file uploading samayare --> so se sabu ku handle kariba pain ame <code>try...catch</code> method and <code>async..await</code> use kariba  ----> asabu ku gote arrow function <code>uploadOnCloudinary</code> kariki gote varibale re store kariba

- 13. arrow function re <code>localFilePath</code> parameter pass kariba --> aita hauchi se file re path jauta ki ama local machine re temporary bhabe store heichi ----> function bhitare <code>try..catch</code> us kari 2 ta condition pakeiba <code>try</code> bhitare --> 1. jadi <code>localFilePath</code> nahin tahale ame null return kariba nahale file upload error return karipariba and 2.jadi <code>localFilePath</code> available achi tahale <code>cloudinary uplaoder</code> ku use kari file upload kariba  ---> aa bhitare 2 ta parameter pass haba 1.<code>url or filepth</code> and 2.<code>options</code> , bahut gudae options achi but ame use kariba  <code>resource_type</code> - jauta ki amaka file ra type bateiba

- 14. pura responce ku ame got variable re hold karidaba and tara name daba <code>response</code> taki ame response ku use kari <code>url</code> ku print karipariba ---> last ku reponse ku user ku return karidaba 

- 15. jadi file uploading re error asila tahale for a safe cleaning purpose ame se file ku server ru hateidaba --> sethipain fail system ra gote method use kariba jaha ra name hauchi <code>unlinkSync()</code>  ---> a method synchroniously file ku hateidaba ama server ru ---> last ku <code>uploadOnCloudinary</code> function ku return karidaba


### Middleware - Jiba purbaru mate dekha kari jibu (for understanding)

- 1. ame <code>multer</code> ku use kari <code>middleware</code> baneiba

- 2. one time create karidaba then jauthi jauthi amaku file upload capability darkar haba ame sethi  ame <code>multer</code> ku inject karidaba  (ex: registration form, photos upload)

- 3. so first ame gote <code>multer.midddleware.js</code> file baneiba <code>midlleware</code> bhitare

- 4. then se file bhitare multer ku import kariba ---> then <code>multer disk storage</code> config ku use kariba

- 5.  <code>multer.diskStorage()</code> method bhitare gote function achi jaha bhitare 3 ta parameter achi ----- 1. req ---> user pakharu jau request asuchi, 2. file ---> sabu file ra access milijae store kariba pain and 3. cb --> callback  and <code>cb</code> bhiatare 2 ta parameter pass karibaku padiba 1.<code>null or error handle</code> and 2. <code>file location</code> -- jauthi ki ama file sabu store haba

6. next <code>filename</code> field bhitare <code>cb</code> method ra 2 ta parameter achi ---> 1. <code>null</code> and 2.<code>filename.originalName</code> set kariba ---> ea kan kariba na user jau name re file ku upload kariba exactly sei same name re file store haba

7. last ku export karidaba <code>multer</code> ku


### HTTP 

- http au https re kebala protocol ra difference --> emiti kichhi khass difference nahin --> htttp re data clear text re pass hue (jaha lekhithiba seia hin pass haba) , but https re data upare gote layer chadhijae jauta ki data ku encrypt karidea 

- most used words heal <code>URL</code> - resource locator, <code>URI</code> - resource identifier and <code>URN</code> - resource name

##### HTTP Headers

- https request patheila bele ame kichhi information bi taa sangare patheithau jahaku ame taku kahu <code>metadata</code> - key value (ex: {name: rakesh}) sent along with request and response


##### Headers kna karanti ?

- caching, authentication, state management
- 2012 purabaru header ra prefix re <code>X</code> lekhibaku pade but ebe lekhiba darkar nahin 


##### Categories of header

- Request header --> handle request data from client
- Response header --> handle data from server
- Representation header --> to see data encoding/compression
- Payload headers --> data (jaha bi data send karibara achi)
 

 ##### Most common headers

 - accept : application/json data 
 - user- agent  : ethiru ame janipariba jau kau application ru request asichi (postman, browser, etc)
 - authorization : 
 - content-type
 - cookie
 - cache-control

 ##### CORS Header
 
 - Access-Control-Allow-Origin
 - Access-Control-Allow-Credentials
 - Access-Control-Allow-Methods


 ##### Security Header

 - Cross-Origin-Embedded-Policy
 - Cross-Origin-Opener-Policy
 - Control-Security-Policy
 - X-XSS-Protection

 ##### HTTP Methods - basic set of operations that are used to interact with the server  -- Postman API

 - <code>GET</code> : retrieve resource
 - <code>POST</code> : interact with resource (mostly add resource)
 - <code>PUT</code> : replace a resource
 - <code>DELETE</code> : remove a resource
 - <code>PATCH</code> : change part of resource
 - <code>HEAD</code> : no message body (response headers only)
 - <code>OPTIONS</code> : what operations are available
 - <code>TRACE</code> : loopback test (get some data)

 ##### HTTP Status Code
 
 - 1XX : Informational
 - 2XX : Success
 - 3XX : Redirection
 - 4XX : Client error
 - 5XX : Server error

 ###### Mostly used:

 - 100 : Continue
 - 102 : Processing
 - 200 : Ok
 - 201 : Created
 - 202 : Accepted
 - 307 : Temporary redirect
 - 308 : Permanent redirect
 - 400 : Bad request
 - 401 : Unauthorized
 - 402 : Payment required
 - 404 : Not found
 - 500 : Internal server error
 - 504 : Gateway timeout 

 setings and config ends here
 <hr>


 ### Router and Controller

 #### Controller setup

 1. create a <code>user.controller.js</code> file inside <code>controllers</code> directory

 2.  import the <code>asyncHandler</code> helper file  

 3. create a method to register user and use <code>asyncHandeler</code> function  --> also create a status code and pass a json message and export the <code>registorHandelor</code> as object

 4. now create a <code>route</code> to handle the register --> create <code>useer.route.js</code> file inside <code>routes</code> directory

 5. import <code>router</code> from <code>express</code> and set up a basic route layout

 - Note** all the routes will exported to <code>app.js</code> file 





 #### Router ---> how to create and repeat

 - routes ku ame express through re import karipariba and ara gote skeleton layout create kariba and aku separate <code>router</code> dir bhitare rakhiba

 - but ame <code>routes</code> ku directly use kariparibani, sethipain amaku <code>middleware</code> use karibaku padiba, so amaku <code>app.get()</code> jagare <code>app.use()</code> ku use kariba  ----> <code>app.get()</code> ame setebele use karuthile jetebele ame nijara routes ku <code>app.js</code> file bhitare directly lekhuthile but ebe jehutu ame <code>routes</code> pain separate dir use kariche sethipain <code>app.get()</code> use kariparibani 

 - <code>app.use("/user", userRouter)</code> --> use() method ku use kari gote <code>/user</code> route create kariba --> jebe bi user <code>/user</code> pass kariba setebele ame <code>userRouter</code> middleware ku amara control deidaba

 - for testing api's use <code>POSTMAN</code>

 - <code>Postman</code> bhitare collection ku jiba  --> sethi url re ama server ra url paste karidaba route sahita --> tapare method re <code>post</code> select kari send kariba


 ### difference b/w two import statement <code>app</code> and <code>{app}</code>


 ### Logic building - Register Controller

 -  register kariba pain first frontend ru user details anibaku padiba
 - tapare validate kariba ---> user empty data send karideini ta , email correct format re achi na nahin (check: not empty)
 - check kariba user agaru exist achi ki nahin (check: username or email)
 - avatar achi na nahin check kariba  
 - jadi user avatar deichi tahale se file ku cloudinary re upload karidaba (check: avatar)
 - user object gote create kariba -- create entry call inn db
 - frontend ku jaha response daba sethiru password au refresh token hateidaba 
 - check kariba user create heichi ki nahin - heithile user object ku return kariba nahele error ku return kariba 


 #### 1. How to take user details from front  end

 1. <code>req.body</code> re ame user tharu sabu detils collect karipariba --> but data details url ru bi asipare --> asabu ku ame futeure re handle kariba 

 2. <code>user.controller.js</code> re data collect kariba frontend ru
 
 3.  <code>req.body</code> re jau data asiba taku ame extract karipariba --> destructure kariki



 ###### File handling

 1. file upload pain ame gote middle ware create karithile jahara name hauchi <code>multer.middleware.js</code> , so ame a middle ware ku use kariba ama file ku upload kariba pain

 2. so ame se multer middle ware ku import kariba <code>user route bhitare</code>

 3. ame middleware use kariba post bele <code>registerUser</code> method execute haba purbaru ---> so ame register user purbaru middle ware ku use kariba <code>upload</code> re <code>fields</code> option use kari  --> <code>fileds</code> option array re input nea  --> so ame atrray bhitare object naba separate file ra input naba pain --> object bhitare first field rahiba <code>name</code> which means, first file jau naba taku kau name re identify kariba, second <code>maxCount</code> keteta file accept kariba

 4. nexxt ame validation kariba user data ku and sethire ame error ku define kariba paina jau <code>ApiError.js</code> file create karithile taku use kariba --> so import kariba se file ku au use kaeriba as a function taa bhitare 2 ta parameter pass kariba --> 1. status code and 2. message

 5. ame <code>if</code> condition re sabu user data ku gote gote kari validate karipariba but amaku sabu pain condition lekhibaku padiba so ame kna kariba na ---> <code>if</code> bhitare gote array pass kariba jaha bhitare ki amaku se sabu parameter pass kariba jau sabu ku amaku validate karibara achi ---> gote special function achi <code>some()</code> - a function upto 3 ta argument accept kare  --> au true false return kare based on the condition --> a function bhitare ame <code>callback</code> use kariba

 6. next ame check kariba user already exist karichi ki nahin sethipain ame import kariba <code>User</code> ku <code>user.model.js</code> ru ---> ame jau user model re user ku export kariche taku ame bahut jagare use karipariba jemiti ki database saha direct connect kariba pain


 - NOTE** : <code>export default</code> nakarithile ame kaunasi jinsa ku directly import kariparibani so sethipain amaku jaha bi import karibara achi <code>{  }</code> aa bhitare import kariba

 7. so ame <code>User</code> re <code>findOne()</code> method use kari find karipariba ---> generaly <code>finndOne()</code> bhiatare parameter pass kari ame check karipariba j email pubrau achhi ki nahin ki username purbaru achi ki nahin but au tike advance re multi parameter pain check kariba jemiti ki se email re au kau user name achhi ki nahin ---> so taa bhitare ame use kariba <code>$or</code> operator --> a <code>$or</code> bhitare array ku input nie au amaku jaha bi check karibara achi ame sabu input ku got gote object kari pass kariba (ex: username and email)  --> so <code>findOne()</code> method return kariba first data ku jaha <code>$or</code> operator bhitare thiba username and email ku match kariba  --> then a pura refernce ku ame gote varible re store karidaba and tara name daba <code>existedUser</code>  ---> next ame if condition pakei check jadi <code>existedUser</code> true return karuchi then ame gote nua error throw kariba 

 8. ame janiche j amara sabu data <code>req.body()</code> ru hin asuchi but jehetu ame <code>multer middleware</code> use karichu so ea amaku sabu data provide karuchi <code>req.files()</code> re so ame aita use kariba ama avatar ku check kariba pain---> but ame optionally chaining kariba ki avatar achi ki nahin ---> so aku bi gote varibale re store kari rakhidaba 

 9. next ame avatar ku upload kariba <code>localFilePath</code> ru <code>cloudinary</code> ku --> so sethipain already ame basic confi file banedeiche jahara name hela <code>cloudinary.js</code>  --> so aku import kariba ---> then ame se method ku use kariba taaa bhitare parameter pass kariba se file ra jahaku ame upload karibaku chanhuche  --> so ame parameter hauchi <code>avatarLocalPath</code>  --> uploading re time lage so ame use kariba <code>await </code> --> next aku ame got variable re wrap karidaba and similarly ame coverImage ku bi upload kariba  --> next check kariba j avatr file upload heichi na nahin jadi heini error throw kariba

 10. next jadi sabu thik thik achi tahale ame sabu info database re entry kareidaba --> ame janiche j kebala <code>User</code> from <code>user.model.js</code> pakhare database saha connect haba pain permission achi --> so <code>User</code> ku access kari <code>create()</code> method ku use kari object bhiatare ame sabu entry ku pass kari pariba --> entry re time lagiba so <code>await</code> user kariba and sabu ku got <code>user</code> varibale re wrap karidaba

 11. next ame check kariba j actually user create heichi na nahin ---> so <code>User.findById(user._id)</code> use kari ame user created heichi ki nahin find karipariba ---> find kariba pain time lagiba so ame <code>await</code> use kariba and aku bi gote <code>createdUser</code> variable re wrap karidaba --> next ame gote method use kariba <code>select()</code> --> aa bhiatare ame sesabu pass kariba jau sabu field amaku darkar nahin jadi user create heijaichi ---> but awkard hela ki eithire parameter sabu string re pass hue  --> ext ame condition lagei check kariba j ama user achi ki nahin jadi heini then error throw kariba 

 12. next ame dekhiba j amara user  successfully create heisarichi so ame ebe response send karidaba  --> ame structured response send kariba so sethipain ame <code>ApiRespose.js</code> ku use kariba --> so first amaku aku import karibara achhi <code>user.controller.js</code> re  ---> so amaku response send kariba pain <code>res</code> use kariba and then ame gote status send kariba jauta ki <code>res.status()</code> -- bhiatare <code>200</code> message send kariba and then gote <code>json</code> response send kariba same response re ----> new <code>ApiResponse()</code> use kari ---> taa bhitare response code , createdUser and gote message send kariba


 ### Postman setup

 1. new tab open kari sethire url paste kari body select kari <code>form data</code> ku choose kariba and then sethire sabu entry ku pass kariba ---> ame <code>form data</code> use karuche instead of <code>json</code> kahinki na json re ame file input neiparibani


 2. amara sabu info ku ame cloudinary <code>media explorer</code> and atlas ra <code>collections</code> re dekhipariba 

 3. ame dekhiba j ama image successfully cloudinary re upload heisarichi so ame kna kariba na upload heisariba pare taku remove karidaba temporary ru --> so <code>cloudinary.js</code> file ku open kariba then ---> sethire file system ku unlink kariba <code>fs.unlink()</code>


 ### Install CORS  package --> to allow request from all origin

 - npm install cors


 ### Unwrap from object



 ### Follower model create kariba


 ### add more controller to user

 - change current password 



 # Subscription model

 - subcriber au channel achhi so, jetebele jane subscriber chnnel ku subscribe kara stebele gote document create haba and taa bhitare field rahiba subscriber au channel, jetethara jete subsciber subsribe karibe nua document create haba


### Gote channnel ra subscriber kemiti find kariba
 - gote channel ra subscriber kete boli kemiti janiba -- so ame sesabu document ku select kariba jauthire channel ra name same thiba --. sesabu ku join kala pare amaku no. of subsriber milijiba

 - so gote channel ra subcriber janibaku hele ame channel find kariba keteta documengt bhitare same chnnel ra name achi --> jetikita same chnanel name ra doucment achhi stiki subscriber


### Gote subscriber keteta channel ku subscribe karichi kemiti find kariba

- subcriber ku find kariba and se jau jau  document re exist karuchi taa ra corresponding channel name ku retrieve karidaba



# Aggregation pipelines

- subcription model ku work kariba pain amaku subsription ru jaha  bi information miliba taku ame join karidaba user re ---. and aku left join kuhajae

- so aku implement kariba pain amaku aggreagtion pipelines sikhibaku padiba

## How to write pipeline

- [ {1st}, {2nd}, {3rd} ..] --> so aa bhitare ame pipeline lekhiba

- {$match || $lookup} --> 1st piepeline bhiare generally match kara jae or join kara jae --> join kariba pain lookup use hue

- {$addField} --> 2nd pipeline bhitare ame addField use kari new field create kaeipariba






 
  










                                      