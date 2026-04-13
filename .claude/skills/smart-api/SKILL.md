---
name: smart-api
description: How to use SMART API Calls
---

# Base URL
- Defined in the .emv variable VITE_SMART_API_ENDPOINT

# Authentication
- Bearer

# Headers
- ocp-apim-subscription-key
- Value comes from .env variable VITE_APIM_SUBSCRIPTION_KEY
-
# Organisation
## URL
- /users/v4/orgs

## ODATA Filter
- name eq '{Name Name}
- identifier eq '{identifier}'

## GET Response
```
{
"items": [
{
"id": "ffc42611-f882-ec11-9a32-38baf811fd72",
"identifier": "16-org-1",
"name": "Group 16 from org 1",
"description": "Organisation ''datagen-16-org-1''.",
"lastUpdated": "2024-06-06T05:13:01.757"
}
],
"pagination": {
"totalItemCount": 27,
"returnedItemCount": 1,
"skippedItemCount": 20
}
}
```
# Org Unit
- Are Schools within the Organisation
## URL
- /users./v4/org-units

## Units within an Organisation
- ODATA param $filter=id eq '{{OrganisationID}}'

## Get Response
'''
{
"items": [
{
"id": "879B3012-DF7C-463D-A3EA-BC1C975468BC",
"identifier": "unit-1234",
"name": "Unit 1234",
"description": "Unit 1234 is responsible for widgets",
"organisationId": "979B3012-DF7C-463D-A3EA-BC1C975468BC",
"address1": "2 Grant Street",
"address2": "Level 3",
"town": "Canberra",
"state": "ACT",
"postcode": "2320",
"country": "Australia",
"homePhone": "02 9123 4567",
"workPhone": "02 9123 4567",
"fax": "02 9123 4567",
"latitude": "-12.345678",
"longitude": "120.345678",
"enabled": true,
"lastUpdated": "2024-06-06T05:13:01.757"
}
],
"pagination": {
"totalItemCount": 27,
"returnedItemCount": 1,
"skippedItemCount": 20
}
}
'''

# Group Types
## URL
- /users/v4/group-types

## GET Response
```
{
  "items": [
    {
      "id": "879B3012-DF7C-463D-A3EA-BC1C975468BC",
      "name": "Exam Group Type",
      "description": "Exam Group Type for student enrolment",
      "lastUpdated": "2024-06-06T05:13:01.757"
    }
  ],
  "pagination": {
    "totalItemCount": 27,
    "returnedItemCount": 1,
    "skippedItemCount": 20
  }
}
```

# Groups
## URL
- /users/v4/groups

## Filter Groups
- ODATA param $filter=id eq '{{OrganisationID}}'

## GET Response
'''
{
"items": [
{
"id": "879B3012-DF7C-463D-A3EA-BC1C975468BC",
"enabled": true,
"identifier": "grp-1234",
"name": "Group 1234",
"description": "Group 1234 description",
"groupTypeId": "16738077-5f55-eb11-b277-c3dfabad0e23",
"organisationId": "179B3012-DF7C-463D-A3EA-BC1C975468BC",
"orgUnitId": "779B3012-DF7C-463D-A3EA-BC1C975468BC",
"accountSource": "Unknown",
"lastUpdated": "2024-06-06T05:13:01.757"
}
],
"pagination": {
"totalItemCount": 27,
"returnedItemCount": 1,
"skippedItemCount": 20
}
}
'''

## POST Group
```
{
  "identifier": "grp-2022-7-1",
  "name": "2022 Year 7 group 1",
  "description": "Year 7 exam group",
  "enabled": true,
  "organisationId": "4224479c-a44e-ed11-b6e8-f4267980d21f",
  "orgUnitId": "7a0a41a0-a54e-ed11-b6e8-f4267980d21f",
  "groupTypeId": "f816d106-af4d-ed11-b6e8-f4267980d21f",
  "accountSource": "Unknown"
}
```

## PUT Group Schmea sams as POST
### URL
- /users/v4/groups/{groupId}


# Students
## URL
- /users/v4/users
## URL User By School or Org-unit
- /users/v4/users?$filter=orgUnitId eq `'{${org-unitid}}'`

## GET Users
'''
{
"items": [
{
"id": "879B3012-DF7C-463D-A3EA-BC1C975468BC",
"enabled": true,
"username": "jo.smith",
"email": "jo.smith@mydomain.com",
"studentOrEmployeeId": "js123",
"firstName": "Joanne",
"lastName": "Smith",
"preferredName": "Jo",
"dateOfBirth": "1965-04-01",
"gender": "Male",
"genderId": "479B3012-DF7C-463D-A3EA-BC1C975468BC",
"mobilePhone": "+614 1234 5678",
"workPhone": "+612 4567 8910",
"streetAddress": "7 Wallaby Way",
"suburb": "Kensington",
"state": "NSW",
"country": "Australia",
"postCode": "2033",
"accountSource": "SSO",
"organisationId": "479B3012-DF7C-463D-A3EA-BC1C975468BC",
"orgUnitId": "779B3012-DF7C-463D-A3EA-BC1C975468BC",
"mainRoleId": "379B3012-DF7C-463D-A3EA-BC1C975468BC",
"lastUpdated": "2024-06-06T05:13:01.757"
}
],
"pagination": {
on "totalItemCount": 27,
"returnedItemCount": 1,
"skippedItemCount": 20
}
}
'''

## User Display Mapping  
- NSN = username
- School ID = studentOrEmployeeId
- firstname = firstName
- lastname = lastName
- gender = gender
-- store for reference but not displayed genderId, orgUnitId, mainRoleId, organisationId

## Post Useer
```
{
  "enabled": true,
  "username": "jo.smith",
  "email": "jo.smith@mydomain.com",
  "studentOrEmployeeId": "js123",
  "firstName": "Joanne",
  "lastName": "Smith",
  "preferredName": "Jo",
  "dateOfBirth": "1965-04-01",
  "genderId": "479B3012-DF7C-463D-A3EA-BC1C975468BC",
  "mobilePhone": "+614 1234 5678",
  "workPhone": "+612 4567 8910",
  "streetAddress": "7 Wallaby Way",
  "suburb": "Kensington",
  "state": "NSW",
  "country": "Australia",
  "postCode": "2033",
  "accountSource": "SSO",
  "organisationId": "379B3012-DF7C-463D-A3EA-BC1C975468BC",
  "orgUnitId": "779B3012-DF7C-463D-A3EA-BC1C975468BC",
  "mainRoleId": "379B3012-DF7C-463D-A3EA-BC1C975468BC",
  "password": "password123"
}
```
### POST User Field Mapping
- NSN = username
- School ID = studentOrEmployeeId   
- firstname = firstName
- lastname = lastName 



# Roles
## URL
- /users/v4/roles
## GET Roles
```
{
  "items": [
    {
      "id": "879B3012-DF7C-463D-A3EA-BC1C975468BC",
      "identifier": "basic-user",
      "name": "Basic User",
      "description": "Basic user account has only rights that a typical learner would need.",
      "mainRole": true,
      "notInUse": false,
      "lastUpdated": "2024-06-06T05:13:01.757"
    }
  ],
  "pagination": {
    "totalItemCount": 27,
    "returnedItemCount": 1,
    "skippedItemCount": 20
  }
}
```