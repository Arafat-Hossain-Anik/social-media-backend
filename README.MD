# Social Media API

This is a backend API for a social media platform developed using Node.js, Express, and MongoDB. It supports user authentication, friend requests, and user profile management, including image uploads to Cloudinary.

## Table of Contents

- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Update Profile](#update-profile)
  - [Send Friend Request](#send-friend-request)
  - [View Friend Requests](#view-friend-requests)
  - [Accept Friend Request](#accept-friend-request)
  - [Friendship Graph Visualization](#friendship-graph-visualization)
  - [View All Friends](#view-all-friends)
- [Faced Problems](#faced-problems)
- [Special Note](#special-note)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Arafat-Hossain-Anik/social-media-backend
   cd social-media-backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string, JWT secret and Cloudinary credentials:

   ```plaintext
    PORT= your_available_port
    DB_URL= your_mongodb_connection_string
    JWT_SECRET= your_jwt_secret_code
    CLOUDINARY_API_KEY= your_api_key
    CLOUDINARY_API_SECRET= your_api_secret
    CLOUDINARY_CLOUD_NAME= your_cloud_name
   ```

## Running the Project

To start the server, run the following command:

```bash
npm start
```

The API will be available at `http://localhost:{your_available_port}`.

## API Endpoints

### User Registration

- **Endpoint**: `POST /api/auth/signup`
- **Description**: Registers a new user.
- **Request Body**: 
  ```json
  {
    "userName": "exampleUser",
    "email": "user@example.com",
    "password": "yourPassword",
    "retypedPassword": "yourPassword"
  }
  ```

### User Login

- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates a user and returns a token in cookies.
- **Request Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword"
  }
  ```

### Update Profile

- **Endpoint**: `PUT /api/user/update-profile/:email`
- **Description**: Updates the user's profile and uploads profile and cover pictures to Cloudinary. Here a single picture can be changed at time.
- **Request Body**: 
  - **Form Data**: 
    - `userName`: string
    - `profilePicture`: file
    - `coverPicture`: file

### Send Friend Request

- **Endpoint**: `POST /api/user/send-friend-request`
- **Description**: Sends a friend request to another user.
- **Request Body**: 
  ```json
  {
    "recipientEmail": "friend@example.com"
  }
  ```

### View Friend Requests

- **Endpoint**: `GET /api/user/friend-requests/:email`
- **Description**: Retrieves all friend requests received by the user.
- **Response**: 
  ```json
  {
    "friendRequests": ["sender@example.com", ...]
  }
  ```

### Accept Friend Request

- **Endpoint**: `POST /api/user/accept-friend-request`
- **Description**: Accepts a friend request and updates both users' friend lists.
- **Request Body**: 
  ```json
  {
    "recipientEmail":"receiver@example.com",
    "senderEmail": "sender@example.com"
  }
  ```

### Friendship Graph Visualization

- **Endpoint**: `GET /api/user/friendship-graph/:email`
- **Description**: Retrieves the user's friendship graph showcasing their connections.
- **Response**: 
  ```json
  {
    "friendshipGraph": { "person1":["person2@example.com", ...],
    "person2":["person1@example.com", ...]
    }
  }
  ```
### View All Friends

- **Endpoint**: `GET /api/user/friends/:email`
- **Description**: Retrieves all friends of a user.
- **Response**: 
  ```json
  {
    "friends": ["friend1@example.com", ...]
  }
  ```
### Faced Problems

During the development process, I encountered a few challenges that required troubleshooting:

1. **Image Uploading Issue**:  
   Initially, I had trouble accessing the image from Postman. After some research, I implemented `express-fileupload` to temporarily store the uploaded image in a temporary folder. Once the image was successfully caught, I used Cloudinary to store it permanently.

2. **Handling JWT Authentication**:  
   I faced some difficulties ensuring that JWT tokens were correctly set in cookies and accessible during API requests. After seeking online help, I was able to resolve the issue and ensure secure handling of tokens for authentication.

3. **Postman Testing**:  
   While testing API requests in Postman, some endpoints initially failed to work due to missing or incorrect headers. After debugging, I ensured that all requests included the necessary authentication headers, particularly the JWT token for secure access.

These problems were eventually resolved.

# Special Note

- **Live Backend Link**: [https://social-media-backend-lw44.onrender.com](https://social-media-backend-lw44.onrender.com)
- **Sample Login Credentials**:  
  - E-Mail: anik@gmail.com  
  - Password: Abcd@1234
- All API endpoints require successful login. Please ensure to authenticate your requests using the provided **JWT token**.
- Two API endpoints are open for viewing purposes:
  - **GET /api/user**: Retrieve the list of all users.
  - **POST /api/user/fake-data**: Submit the given fake data to the database.