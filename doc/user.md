# USER API SPEC
Api spec untuk endpoint user
## REGISTER USER

ENDPOINT: POST /api/users

Request Body:
```json
{
    "username":"trian",
    "password":"password",
    "name":"Trian Afiansyah"
}
```
Response Success:
```json
{
    "code": 200,
    "msg":"ok",
    "data":{
        "username":"trian",
        "name":"Trian Afiansyah
    }
}
```
Response Failed:
```json
{
    "code": 400/500/401,
    "msg":"bad_request/invalid_parameter/"
}
```

## LOGIN USER

ENDPOINT: GET /api/users/current

Headers:
- Authorization : Token

Response Success:
```json
{
    "code": 200,
    "msg":"ok",
    "data":{
        "username":"trian",
        "name":"Trian Afiansyah"
    }
}
```
Response Failed:
```json
{
    "code": 400/500/401,
    "msg":"bad_request/invalid_parameter/"
}
```


## GET USER

ENDPOINT: POST /api/users/login

Request Body:
```json
{
    "username":"trian",
    "password":"password"
}
```
Response Success:
```json
{
    "code": 201,
    "msg":"created",
    "data":{
        "username":"trian",
        "name":"Trian Afiansyah",
        "token":"token"
    }
}
```
Response Failed:
```json
{
    "code": 401,
    "msg":"unauthorized"
}
```

## UPDATE USER

ENDPOINT: PATCH /api/users/current

Headers:
- Authorization : Token

Request Body:
```json
{
    "password":"password", // optional
    "name":"Trian Afiansyah" // optional
}
```
Response Success:
```json
{
    "code": 200,
    "msg":"ok",
    "data":{
        "username":"trian",
        "name":"Trian Afiansyah
    }
}
```
Response Failed:
```json
{
    "code": 400/500/401,
    "msg":"bad_request/invalid_parameter/"
}
```
## LOGOUT USER

ENDPOINT: DELETE /api/users/current

Headers:
- Authorization : Token

Response Success:
```json
{
    "code": 200,
    "msg":"ok"
}
```