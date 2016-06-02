# Start

a [Sails](http://sailsjs.org) application

This app is a sailjs app that runs Angular for this UI part. 
- The angular app act as a client, to access the apis of the app. it's located in ```assets/js```
- The sailsjs controllers (located in ```api/controllers``` offers apis endpoints, including a flexible api controller that allows to manage easily a new endpoint, in the flavor of what ```firebase``` can do.  

## 1. Requirements

* nodejs + npm (brew install npm)
* less (npm i less -g)
* sailjs (npm i sailjs -g)
* mongodb >= 3.0 (brew install mongodb) 
* git (should be installed already)
* forever  (```npm i forever -g```) 

## 2. Install

1. install the required apps
2. Create a database and a user in mongo for this app.
3. checkout this repository
4. edit the ```config/local.js```file and set the connexion to the database
5. start the app : ```node app.js``` or  ```forever start app.js```
6. Go to localhost:8080 in your browser.

## 3. Coding

1. If you have never worked with nodejs, you should know that every time you change your code, you'll need to restart your server. If you are using ```forever```, you can use the watch option ```-w``` to hove your server automatically restart. You can specify which folder to watch using the ```-watch-directory```option. I recommend watching only ```./api```
2. The angular setup is in the ./assets folder. It all starts with the layout page. If you need to work just on the angular part and you don't want to spend time installing everything, you can rename layout.ejs to layout.html, and copy the whole assets folder to a php server.

3. coding css is done via less. The compiler compiles all the styles into one file : ```assets/styles/importer.css```
To make some changes you can use style.less, view-startup.less or create your own less file. 
If you create a new file, you'll have to import it in ```importer.less````
After modifying your files you can compile the project : ```lessc importer.less > importer.css``` (if you are in the assets folder)



