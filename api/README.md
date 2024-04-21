BEFORE RUNNING api.py:
You will need to have MySQL 8.0 installed and running. 
To run it on windows, press the Win button + R and open services.msc. 
Click on the MySQl 8.0 service and click start. 
Go into the api.py code and change all of the engine paths to fit your sql server username and password. 
For me, I already had my sql connection configured so that username = root and password = root.

You will need to have the recipe.csv file in the api directory. 
Do not change the contents of recipe.csv!! I formatted it very specifically so that it could be uploaded to the database.

You will need to copy the Food Images directory into this folder for Windows: C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/
For windows, you can do this command in the terminal: xcopy yourfilepathtoFoodImagesDirectory C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/ /s /e /h
If you are not on windows, log into mysql through the terminal and type this command: select @@secure_file_priv;
That will give you the file path to where you should put the images

Make sure to install the necessary packages/libraries that are listed in the top of the api.py code.
Also, you have to install cryptography: pip install cryptography

NOTE:
The code automatically populates the database with the recipes and images if the tables are empty so it may take a bit to run.

For future reference, when retrieving title, ingredients, and instructions from the recipe table, they have to be reformatted. 
Replace “||” with commas. Ingredients will have single quotes around them and each ingredient attribute will be enclosed by square brackets [], which we will need to remove to make the formatting look better. 

I haven’t tested the post or get request methods yet so I may have to modify them later on.
