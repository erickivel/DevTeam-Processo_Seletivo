## :rocket:  Getting Started With Docker 
 
 1. Install docker: https://docs.docker.com/get-docker/ <br>
 2. Install docker-compose: https://docs.docker.com/compose/install/ <br>
 3. Clone this repo: `git clone https://github.com/erickivel/DevTeam-Processo_Seletivo.git` <br>
 4. Move to the directory: `cd DevTeam-Processo_Seletivo` <br>
 5. Move to the directory server: `cd server` and run `npm install` or `yarn` to install the dependencies <br>
 6. Rename the file `.env.example` to `.env`  <br>
 7. Move to the directory web: `cd ../web` and run `npm install` or `yarn` to install the dependencies <br>
 8. Move to the root: `cd ..` and run `docker-compose up` to build, create, start, and attach the containers  <br>
 9. The server runs on: http://localhost:3333 <br>
 10. API docs runs on: http://localhost:3333/api-docs <br>
 11. The react app runs on: http://localhost:3000 <br> 
  
To stop and remove the containers, run `docker-compose down`  
  
Note: If `docker-compose up` or `docker-compose down` doesn't work, run respectively `sudo docker-compose up` or `sudo docker-compose down`
