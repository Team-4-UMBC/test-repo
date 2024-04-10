## Instructions

1. Have react installed - I am using npm 10.5.0
2. Have yarn installed - I have 1.22.22
3. Have node installed - I have 21.7.2 (have one of the later versions like 16+ it didn't work on older ones.)
4. Have python3 installed
5. have flask installed

Clone the repo and open it in like vscode or something

### After cloning:

delete package-lock.json and run `npm install` in a terminal on the project

if the venv file is there, DELETE IT IDK WHY IT KEEPS GETTING PAST THE GITIGNORE

#### Setup the venv - windows

Open up CMD terminal in project

`cd api`

`python -m venv venv`

`venv\Scripts\activate`

Jump to Install a thingy

#### Setup the venv - linux

`cd api`

`python3 -m venv venv`

`. venv/bin/activate`

#### Install a thingy in the venv
`pip install python-dotenv`

`pip install flask`

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
