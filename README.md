# COSC480 Annotator
A web-app for annotating documents for my [COSC480 project](https://github.com/eight0153/cosc480).

## Getting Started
1.  Download and install [Node 10.16.3+](https://nodejs.org/en/download/) if you do not have it installed already.

2.  Create the file `.env` and fill it in using the following format:
    ```.env
    MYSQL_URI=<url-to-mysql-db>
    MYSQL_DB=<mysql-db>
    MYSQL_USER=<mysql-user>
    MYSQL_PASSWORD=<mysql-password>
    API_PORT=<express-port>
    NODE_ENV=[development|production]
    ```
    You can use the file `.env.example` as a starting point.
    
3.  Start up the development servers:
    ```shell script
    npm run dev
    ```
    The website can be viewed at [localhost:3000](http://localhost:3000/) and the api can be accessed from 
    [localhost:5000/api](http://localhost:5000/api/). 
    