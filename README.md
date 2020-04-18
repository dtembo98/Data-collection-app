# Data-collection-app
A simple express Restful API for collecting data for machine translation.
## API endpoints
### Sign-up users
To sign up users use the endpoint:
http://localhost:3001/api/auth/signup

#### http Method: post

data should be sent as a json object like so:

{

"firstName":"name",

"lastName":"l-name",

"phoneNumber":"097935566",

"password":"******"

}
#### Api Response:
registered successfully

### Sign-in users
To log in use the endpoint:

http://localhost:3001/api/auth/signin
 
 #### http Method: post

data should be sent as a json object like so:

{

"phoneNumber":"097935566",

"password":"******"

}
#### Api Response:

{
   
   "id": 1,
    
    "firstName": "David",
    
    "lastName": "Tembo",
    
    "phoneNumber": "0979------",
    
    "accessToken": 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg3MjMyMzE0LCJleHAiOjE1ODcyMzM1MTR9.KJ_3kpBXjafW14oOEjDUCmU_uYPELI0w6SOUJNfwi70",
    
    "refreshToken": 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg3MjMyMzE0LCJleHAiOjE1ODczMTg3MTR9.CKDNCB0zxU0sbEJTBJpteELZoIY6_nCDJ9OIzl0uZ1g",
    
    "phrases": [
        {
            "Id": 32,
            
            "userId": 1,
            
            "translated_status": 0,
            
            "sent_status": 1,
            
            "phrase": "What would Tom think?",
            
            "createdAt": "2020-04-18T11:32:26.000Z",
            
            "updatedAt": "2020-04-18T10:14:21.000Z"
            
        }]


### Fetch more phrases for translation
To sign up users use the endpoint:

http://localhost:3001/api/phrases

#### http Method: GET

To fetch Data the client-app should reach the above posted endpoint
#### Api Response:

 "phrases": [
 
        {
            "Id": 32,
            
            "userId": 1,
            
            "translated_status": 0,
            
            "sent_status": 1,
            
            "phrase": "What would Tom think?",
            
            "createdAt": "2020-04-18T11:32:26.000Z",
            
            "updatedAt": "2020-04-18T10:14:21.000Z"
            
        }]
        
 #### Note:
    
    use access tokens whenever sending a get request set the request headers use x-access-token as the key and the access token as the value

### Send translated phrases
To send translated phrases from the users use the endpoint:

http://localhost:3001/api/translate/phrase

#### http Method: POST

data should be sent as a json object like so:

{  

	"phraseId":"1",
 
	"tonga":"uli buti?"
 
}

#### Api Response:


{
  
  "message": "phrase already translated"
  
}
