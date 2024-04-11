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
