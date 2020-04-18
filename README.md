# Data-collection-app
A simple express Restful API for collecting data for machine translation.
## API endpoints
### Sign-up users
To sign up users use the endpoint:
http://localhost:3001/api/auth/signup

data should be sent as a json object like so:

{
"firstName":"name",
"lastName":"l-name",
"phoneNumber":"097935566",
"password":"******"
}
#### Response:
registered successfully
