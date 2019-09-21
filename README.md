Auther: Liton Kar

Application: Based on Node.Js and MySql

Description: NodeJs Complete BoilerPlate Application. 

Process to run this application on local system. 
    
    Step 1: Install Nodejs/Git in local system. If already installed, then not required.
    
    Step 2: git clone git@github.com:litonkar20/NodeBoilerPlate.git or download

    Step 3: cd NodeJSApplication  (Go to project folder)

    Step 4: npm insatll

    Step 5: node server.js

If everything goes well, then application should run on local system. 

Test Application once run successfully
   
    Check Application running status
    - https://localhost:8443/api/check/database/status

    Check database running status
    - https://localhost:8443/api/check/application/status

    Sample basic authentication and schema validation
    - https://localhost:8443/api/user/login
    - Add Header Auth(Without authorization it will through error) 
        - Authorization : Basic YzJOaGJtSmhjbU52WkdVeDpjMlZqY21WMFpWTmpZVzVpWVhKamIyUmxhMlY1
    - Add Body 
        {
	        "username":"admin",
	        "password":"12345"
        }
    - Validation error (Any parameter missmatch will through validation error)