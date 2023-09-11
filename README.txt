SETTING UP MYSQL DATABASE:

In mysql workbench, create a database name "data_group" and user with name: seller and password: seller 
(or you can change these by changing the fields in the .env file, these fields:
MYSQL_HOST = localhost //this one is where the server run
MYSQL_USER = seller     // your database user name
MYSQL_PASSWORD = seller //password
MYSQL_DATABASE = data_group //name of the database)

Also, change the config.json file in "./server/config/config.json" accordingly 

Once connected inside the mysql database, run these sql file for stored procedure and trigger:
"

Open 2 terminal (or just split the terminal). 
One terminal will navigate to the "/server", and the other terminal will navigate to the "/client"

In both terminal, run "npm install"

And the project should be running

For creating user, currently our project set the default role of new register users by 2, if you want to make it into admin account, go to mysql database and change the field role to 0 (or change to 1 for seller)


