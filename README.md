# CRUD_APP
Started CRUD APP
1. Prerequisites 
Node Js , Typescript, Npm , ts-node


2. Project Setup 

Clone the Repository using bbelow command : -
git clone https://github.com/R0hangarg/CRUD_APP.git


Install Dependencies  :-
npm install 

3. configurations :-

    .env file :-
    PORT=3000
    MONGO_URI=Your_DB_URI
    JWT_SECRET = YOUR_JWT_SECRET_KEY
    TEST_URI =YOUR_TEST_DB_URI
    TOKEN =YOUR_TOKEN_FOR_TESTING

4. Running the Project

    npm run dev

    ensure Package.json file has script file as :- 
    "scripts": {
    "test": "jest",
    "lint": "eslint .",
    "dev": "ts-node src/server.ts"
    }, 
