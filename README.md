# Movieflicks Backend

Movieflicks is a backend API project developed with Express.js and MongoDB for managing a movie database. Designed with best practices in mind, Movieflicks offers full CRUD functionality for both user and movie management, along with JWT-based authentication for secure access. It supports cloud storage for images via Cloudinary, making it an ideal project for those learning to build and connect with RESTful APIs efficiently.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Models](#models)
- [API Reference](#api-reference)
- [Technologies Used](#technologies-used)

## Features

Key features includes:

- ✅ Comprehensive CRUD operations
- ✅ JWT-based authentication
- ✅ Image upload and storage with Cloudinary
- ✅ Advanced movie filtering by name, duration, and genres
- ✅ Pagination for efficient data retrieval
- ✅ User registration with duplicate checks
- ✅ Password encryption using bcrypt
- ✅ Password Recovery: Forgot password and reset password functionality, with secure email notifications
- ✅ Email Notifications via Nodemailer for password reset links and confirmation of successful password reset
- ✅ Mailtrap integration for email functionality testing
- ✅ Environment configuration using dotenv

## Getting Started

**Prerequisites**

- node `^19.2.0`
- npm `^9.2.0`

Make sure you have [npm](https://www.npmjs.com/get-npm) installed globally.
To get started with the project, follow the steps below:

#### 1.Clone the repository:

```bash
$ git clone git@github.com:roshanbist/MovieFlicks.git
$ cd MovieFlicks
```

#### 2.Install dependencies:

```bash
$ npm install
```

#### 3.Set up environment variables

```bash
MONGODB_URL=MongoDB connection URI
PORT=Server port
CLIENT_URL=URL of the client application
CLOUDINARY_CLOUD_NAME=Cloudinary cloud name for image storage
CLOUDINARY_API_KEY=Cloudinary API key
CLOUDINARY_SECRET_KEY=Cloudinary secret key
ACCESS_TOKEN_SECRET_KEY=Secret key for signing access tokens (JWT)
REFRESH_TOKEN_SECRET_KEY=Secret key for signing refresh tokens (JWT)
EMAIL_HOST=SMTP server host for sending emails (e.g., smtp.mailtrap.io)
EMAIL_PORT=SMTP server port (e.g., 2525 for Mailtrap)
EMAIL_USER=SMTP server user credential
EMAIL_PASS=SMTP server password credential
```

#### 4.Run the server:

- In development mode

```bash
$ npm run dev
```

- In production mode

```bash
$ npm run prod
```

The server should now be running at http://localhost:${PORT}.

## Models

There are two models designed in this project.

### Movie Model

| Field              | Type       | Required | Unique                              | Validation/Constraints                           |
| :----------------- | :--------- | :------- | ----------------------------------- | ------------------------------------------------ |
| name               | String Yes | Yes      | Min 4 characters, Max 50 characters |
| description        | String     | Yes      | No                                  | Brief movie description                          |
| releaseYear        | Number     | Yes      | No                                  | Release year of the movie                        |
| duration           | Number     | Yes      | No                                  | Duration in minutes                              |
| ratings            | Number     | Yes      | No                                  | Must be between 1 and 10                         |
| director           | String     | Yes      | No                                  | Director's name                                  |
| actors             | [String]   | Yes      | No                                  | Array of actor names, cannot be empty            |
| images             | [String]   | Yes      | No                                  | Array of image URLs                              |
| genres             | [String]   | Yes      | No                                  | Array, enum of valid genres: Action, Drama, etc. |
| imagesCloudinaryId | [String]   | No       | No                                  | Cloudinary IDs for images                        |
| createdAt          | Date       | No       | No                                  | Defaults to current date                         |

### User Model

| Field                        | Type   | Required | Unique | Validation/Constraints                   |
| :--------------------------- | :----- | :------- | ------ | ---------------------------------------- |
| name                         | String | Yes      | No     | Min 2 characters, Max 30 characters      |
| username                     | String | Yes      | Yes    | Min 5 characters, Max 20 characters      |
| email                        | String | Yes      | Yes    | Must be a valid email format             |
| password                     | String | Yes      | No     | Min 6 characters                         |
| confirmPassword              | String | Yes      | No     | Must match password                      |
| avatar                       | String | Yes      | No     | URL for avatar                           |
| role                         | String | No       | No     | Enum: user, admin (default: user)        |
| avatarCloudinaryId           | String | Yes      | No     | Cloudinary ID for avatar                 |
| refreshToken                 | String | No       | No     | For handling JWT refresh                 |
| passwordResetToken           | String | No       | No     | Temporary token for password reset       |
| passwordResetTokenExpireTime | Date   | No       | No     | Expiration time for password reset token |

## API Reference

## User API

#### Register a new user

```http
  POST /api/v1/users/register
```

| Parameter  | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `username` | `string` | **Required**. Username of the new user. |
| `email`    | `string` | **Required**. Email of the new user.    |
| `password` | `string` | **Required**. Password of the new user. |

#### Login a user

```http
  POST /api/v1/users/login
```

| Parameter  | Type     | Description                                |
| :--------- | :------- | :----------------------------------------- |
| `email`    | `string` | **Required**. Email for authentication.    |
| `password` | `string` | **Required**. Password for authentication. |

## Contact API

#### Get all contacts

```http
  GET /api/v1/contacts
```

| Parameter       | Type     | Description                               |
| :-------------- | :------- | :---------------------------------------- |
| `Authorization` | `string` | **Required**. JWT token in Bearer format. |

#### Get contact detail by ID

```http
  GET /api/v1/contacts/:id
```

| Parameter       | Type     | Description                                     |
| :-------------- | :------- | :---------------------------------------------- |
| `id`            | `string` | **Required**. ID of the contact to see details. |
| `Authorization` | `string` | **Required**. JWT token in Bearer format.       |

#### Create a new contact

```http
  POST /api/v1/contacts
```

| Parameter       | Type     | Description                                |
| :-------------- | :------- | :----------------------------------------- |
| `Authorization` | `string` | **Required**. JWT token in Bearer format.  |
| `name`          | `string` | **Required**. Name of the contact.         |
| `email`         | `string` | **Required**. Email of the contact.        |
| `phone`         | `string` | **Required**. Phone number of the contact. |

#### Update a contact

```http
  PUT /api/v1/contacts/:id
```

| Parameter       | Type     | Description                                    |
| :-------------- | :------- | :--------------------------------------------- |
| `id`            | `string` | **Required**. ID of the contact to update.     |
| `Authorization` | `string` | **Required**. JWT token in Bearer format.      |
| `name`          | `string` | **Optional**. New name of the contact.         |
| `email`         | `string` | **Optional**. New email of the contact.        |
| `phone`         | `string` | **Optional**. New phone number of the contact. |

#### Delete a contact

```http
  DELETE /api/v1/contacts/:id
```

| Parameter       | Type     | Description                                |
| :-------------- | :------- | :----------------------------------------- |
| `id`            | `string` | **Required**. ID of the contact to delete. |
| `Authorization` | `string` | **Required**. JWT token in Bearer format.  |

## Technologies Used

- **Node.js** - Backend runtime environment
- **Express** - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
