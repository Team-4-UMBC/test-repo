## Instructions

1. Have react installed - I am using npm 10.5.0
2. Have yarn installed - I tried it with 1.22.22 and 1.22.19
3. Have node installed - I have 21.7.2 (have one of the later versions like 16+ it didn't work on older ones.)
4. Have python3 installed - I tried it with both 3.10 and 3.12
5. have flask installed - I used 3.0.3
6. Have pip installed
7. Have python-dotenv installed (Run `pip install python-dotenv` on any machine, should work), this will ensure a connection between flask and react

Clone the repo and open it in like vscode or something

### After cloning:

`npm ci`

This will install all the npm dependencies using package-lock.json, ensuring that all of us are using the same dependencies as we develop.

if the venv file is there, DELETE IT IDK WHY IT KEEPS GETTING PAST THE GITIGNORE

#### Running the backend
I have set it up so that you can run flask from the main directory by running `yarn start-api`

Open up a new terminal and run `yarn start-api`

**KEEP IT OPEN OR REACT WILL GIVE ERRORS SINCE IT IS CONNECTED**

This should work on linux based computers, I haven't tested on windows. You can be either in the api directory or the main directory it should work either way. Otherwise just run `flask run` in the api directory.

### Running the frontend
open up a new terminal in the project and run 
`yarn start`

### If you don't know how to push and stuff watch this vid
https://www.youtube.com/watch?v=jT9QEUOX00w&t=1s - vscode only

###
You will need to download the dataset's archive folder and unzip it before running





## FULL STEP-BY-STEP INSTRUCTIONS TO RUN THE WEB APPLICATION:
1. You must already have mySQL installed. Run the mySQL service.
    For windows, you can follow these commands:
        Click the win key + r
        Type "services.msc"
        Search for the mySQL service
        Click on start
2. Open a terminal, navigate to your elastic search bin folder, and run elastic search. 
3. Clone the repo. Open a terminal and navigate to the test-repo folder, then to the api folder.
4. Inside that folder, run the command: `venv\Scripts\activate`
    Note: you may have to use a different command if you are not using windows. 
    If that doesn’t work, delete the current venv and do this command: `python -m venv venv`
    Then try `venv\Scripts\activate` again.
5. Check to make sure you have the recipe.csv file in the api directory. DO NOT OPEN THE 
    FILE. Opening the file will change the formatting. If it opens, delete it and redownload it again. 
6. You will need to copy the Food Images directory (test-repo/src/archive/Food Images) into this  
    folder for Windows: `C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/`
    For windows, you can do this command in the terminal:
   `xcopy yourfilepathtoFoodImagesDirectory C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/ /s /e /h`
    If you are not on windows, log into mysql through the terminal and type this command:
   `select @@secure_file_priv;`
    That will give you the file path to where you should put the images
8. Go into the api.py code and change all of the engine paths to fit your sql server username 
    and password. At the moment, it is configured so that username = root and password =
    password.
9. Enter the command: `flask run`
    For this to work, you may need to install the extensions that
    were imported (see the first couple lines in api.py)
    In the command line: `pip install flask-sqlalchemy`
    `pip install flask-cors`
   
    `pip install dataclasses`
   
    `pip install Flask`
   
    `pip install flask-mysql`
   
    `pip install cryptography`
   
    etc.
   
    Then, retry running the command: `flask run`
    This may take awhile the first time because the database gets automatically populated.
11. Open a DIFFERENT terminal and navigate to the test-repo folder.
12. Enter the command: `npm ci`
13. Search for the webpack.config.js file in your file system and open the file. If it is not already 
    in the file, add this code under "rules" and save it:
`{
     test: /\.(jpg|png|svg)$/,
     loader: 'file-loader',
     options: {
     name: '[path][name].[hash].[ext]',
     },
}`

15. Enter the command: `npm start`
    If this doesn't work, try this command: `npm install react-router-dom`
    and then retry: `npm start`
    The web app should automatically open into the web browser.
    If it doesn't, you can type http://localhost:3000 into the web browser instead.

## Troubleshooting the recipe dataset

As a very last resort, if the recipe dataset does not populate the database properly, then perform these steps.

Go into recipe.csv using notepad and perform these “find and replace” operations:

Find: \`[

Replace: “`[

Find: ]\`,

Replace: ]`”,

Find: ]\`”,\`

Replace: ]\`”,”\`

Find: 4/16/2024 11:30

Replace: 2024-04-16 11:30:00

Then go into notepad++ and open the recipe.csv file. Perform one final “find and replace” operation. 

Find: \`\r\n

Replace: `”\r\n

In search mode, click the extended option.


