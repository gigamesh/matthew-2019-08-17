# Matthew - 2019-08-2017

## Installation
1. git clone this repo
2. cd into directory and `yarn install`
3. add .env file (sent in encrypted email to Janet) to root directory
4. start application by running `yarn dev`

## Security
- Addressed: restricting file type (to png or jpg) and size (under 10mb) on the server as well as the client side
- Unaddressed: [Image-borne malware](https://www.opswat.com/blog/image-borne-malware-how-viewing-image-can-infect-device)

## Improvements
- Pagination
- Infinite scroll
- use useReducer and/or useContext to better organize state management
- Server-side rendering
- Better UX to switch between search results and all results
- Sorting
- More unique IDs (currently just uses file's name)
- Lazy-loaded images (ex: Medium.com blur fade-in)
- Options to process the images (ex: dimensions, etc)
- Communicating to the user when the database (Cloudinary) reaches its storage limit

## Libraries
- express: server
- cors: cross origin resource sharing middleware
- cloudinary SDK: image storage
- express-formidable: parses multipart/form-data
- typescript: type safety
- dotenv: environment variables (for cloudinary)
- axios: easier HTTP requests (I initially used fetch but started to refactor midway through)
- react-toastify: pop-ups for communicating interactions to user

## API
The server is a simple REST JSON API built with Node & express

### GET /api/list
- Description: Requests json data relating to all images currently stored in the database 
- Returns: json array of objects, each object corresponding to an image
- Parameters: none

### POST /api/upload
- Description: Accepts an image file to upload 
- Returns: json array of objects, each object corresponding to an image (calls same function as `/api/list` for return data)
- Parameters: array of image files in multipart/form-data object

### POST /api/search
- Description: Searches for an image using the filename (stored as `public_id` by cloudinary)
- Returns: json array of matching objects, each object corresponding to an image 
- Parameters: search text as `searchString` 

### DELETE /api/delete
- Description: Deletes an image
- Returns: list of currently stored images after deletion (same data structure as `/api/list` return type ) 
- Parameters: `publicId` of the file

---
## Other notes
- Clearing the input makes the full image list repopulate after searching (there was no button in the wireframes so I figured this would be the most straightforward UX)

Had a lot of fun on this! 