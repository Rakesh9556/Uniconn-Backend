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

#### constants.js: 

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

#### db: folder to store database connection

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
- so the files are /.vscode, /node_modules, ./dist,  *env, .env, .env.* 



                                      