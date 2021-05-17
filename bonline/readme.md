# task 4

Even if the very details of installing and running node.js and express.js were in lab 3 as well, I believe I should include them here as well, just to give a better understanding about my approach to the task 4.

It should be noted that I spend a good amount of time trying to make an auto generated express.js work for this task but unfortunatelly I was not able to make the folder public as static in the way I wanted so I scrubbed the task 4 and I did it again in a primitive way.

This simple way delivers 2 static files, (index.html and style.css), and it generates a third file, (data.txt, that holds received data from the remote mysql database which when is fetched through the server.js, it is formated with html tags and it is delivered as such to the index.html when it is requested by the embeded ajax code.

Node.js is downloaded by the official page of node.js and it is installed usually through an installed, (that was my way at least), and it is accessible from every CLI of the operating system, including the console of the used IDE, (Visual Studio Code in my case). the difference is that when in CLI, the user has to adjust the working directory of node.js by using CD, (Change Directory). while in the console of an IDE, (or in the Git bash), the working directory is assigned in an automatic way.

Express.js is a module and it must be included to a file package.json file in order to be able to be installed.
The command for installing the modules of the node.js with the npm, (Node Package Manager), is:

    npm install

And after that, the server is ready to go and it starts working by typing the command:

    npm start

and that concludes the nodes.js and express.js installation and activation process.

Ajax which is used in index.html through embeded javascript code in it, is not a separated technology but just a collection of Javascript tools that help javascript to access data from the back end without reloading the page.

For database the mysql module was used and I passes credentials to remote database, (I prefer remote mysql databases for many reasons). And it connects when the index.html is requested and it fetches the data in time intervals.

Time intervals were added in both back end and front end for, (it is the best way to do so), and while the backend refreshes every 10 seconds the front end refreshes every 15 seconds. an if statement added, to make sure that no empty data will fetched by the front end.

I made sure to formate the data with table html tags before I send it forward, and also, I added a simple css rule to make sure that the table will look like a table. i believe that my use of HTML was decent.

But that is all I can think about my project.
If you have more questions about how I did please feel free to contact me.
My Best Regards
Robert
