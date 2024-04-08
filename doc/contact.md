# CONTACT API SPEC
Api spec untuk endpoint contact
## CREATE CONTACT

Endpoint POST api/contacts

Headers:
- Authorization : Token

Request Body:
```json
{
    "first_name":"trian",
    "last_name":"afiansyah",
    "email":"trian@email.com",
    "phone":"0812345"
}
```

Response Success:
```json
{
    "code": 201,
    "msg":"created",
    "data":{
        "id":"uuid",
        "first_name":"trian",
        "last_name":"afiansyah",
        "email":"trian@email.com",
        "phone":"0812345"
    }
}
```

## GET CONTACT

Endpoint GET api/contacts/:contact_id

Headers:
- Authorization : Token

Response Success:
```json
{
    "code": 200,
    "msg":"ok",
    "data":{
        "id":"uuid",
        "first_name":"trian",
        "last_name":"afiansyah",
        "email":"trian@email.com",
        "phone":"0812345"
    }
}
```
## UPDATE CONTACT

Endpoint PUT api/contacts/:contact_id

Headers:
- Authorization : Token

Request Body:
```json
{
    "first_name":"trian",
    "last_name":"afiansyah",
    "email":"trian@email.com",
    "phone":"0812345"
}
```

Response Success:
```json
{
    "code": 200,
    "msg":"ok",
    "data":{
        "id":"uuid",
        "first_name":"trian",
        "last_name":"afiansyah",
        "email":"trian@email.com",
        "phone":"0812345"
    }
}
```
## REMOVE CONTACT

Endpoint DELETE api/contacts/:contact_id

Headers:
- Authorization : Token

Response Success:
```json
{
    "code": 200,
    "msg":"ok",
}
```
## SEARCH CONTACT

Endpoint GET api/contacts

Headers:
- Authorization : Token

Query Params :
- keyword: string (optional)
- name: string, contact first name or contact last name, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- size: number, default 10

Request Body:
```json
{
    "first_name":"trian",
    "last_name":"afiansyah",
    "email":"trian@email.com",
    "phone":"0812345"
}
```

Response Success:
```json
{
    "code": 200,
    "msg":"ok",
    "paging":{
        "current_page": "page",
        "size": "size",
        "total": "page",
    }
    "data":[{
        "id":"uuid",
        "first_name":"trian",
        "last_name":"afiansyah",
        "email":"trian@email.com",
        "phone":"0812345",
    }]
}
```
