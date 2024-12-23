require('dotenv').config()
const express = require("express");
const verifyToken = require('./VerifyToken.ks');
const app = express();
const PORT = 3000;
const mongoose=require('mongoose')


// added to handle JSON data in POST requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok");
});


//adding user
const users=[
  { id:1,username:"zahraa", password:"1234"},
  {id:2, username:"rasha",password:"4321"}
];


//step-3- Create an express simple API

app.get("/test", (req, res) => {
  res.json({ status: 200, message: "ok" });
});

app.get("/time", (req, res) => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const currentTime = `${hours}:${minutes}`;

  res.json({ status: 200, message: currentTime });
});

//Step 4 - Let's complicate the API

app.get("/hello/:id?", (req, res) => {
  const { id } = req.params;
  if (id) {
    res.json({ status: 200, message: `Hello, ${id}` });
  } else {
    res.json({ status: 200, message: "Hello!" });
  }
});

app.get("/search", (req, res) => {
  const { s } = req.query;
  if (s) {
    res.json({ status: 200, message: "ok", data: s });
  } else {
    res
      .json({
        status: 500,
        error: true,
        message: "you have to provide a search",
      });
  }
});


//step-5 basics of crud
const movies = [
  { id: 1, title: "Jaws", year: 1975, rating: 8 },
  { id: 2, title: "Avatar", year: 2009, rating: 7.8 },
  { id: 3, title: "Brazil", year: 1985, rating: 8 },
  { id: 4, title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];
// Read
app.get("/movies", (req, res) => {
  res.json({ status: 200, data: movies });
});


//step-6-search

//  movies ordered by date
app.get("/movies/read/by-date", (req, res) => {
  const moviesByDate = movies.slice().sort((a, b) => a.year - b.year); //we use slice to make copy of the original array beore sorting them
  res.json({ status: 200, data: moviesByDate });
});

//  movies ordered by rating
app.get("/movies/read/by-rating", (req, res) => {
  const moviesByRate = movies.slice().sort((a, b) => b.rating - a.rating);
  res.json({ status: 200, data: moviesByRate });
});

//  movies ordered by title
app.get("/movies/read/by-title", (req, res) => {
  const moviesByTitle = movies
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title)); // .localeCompare(), the sorting is done in a way that ignores case and follows alphabetical order correctly, regardless of accents.
  res.json({ status: 200, data: moviesByTitle });
});

//step-7-read one
app.get("/movies/read/id/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((item) => item.id === parseInt(id));

  if (movie) {
    res.json({ status: 200, data: movie });
  } else {
    res
      .json({
        status: 404,
        error: true,
        message: `The movie ${id} does not exist`,
      });
  }
});

//step-8-create
app.post("/movies/add", (req, res) => {
  const { title, year, rating } = req.body;

  // Check if title and year are provided
  if (!title || !year) {
    res
    
      .json({
        status: 404,
        error: true,
        message:
          "you cannot create a movie without providing a title and a year",
      });
    return;
  }
  // Check if year/rating is a 4-digit number
  const parsedYear = parseInt(year);
  if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > 9999) {
    res
    
      .json({
        status: 404,
        error: true,
        message:
          "you cannot create a movie without providing a valid 4-digit year",
      });
    return;
  }

  const parsedRating = rating || 4;

  const newMovie = {
    id: movies.length + 1,
    title,
    year: parseInt(year),
    rating: parseFloat(parsedRating),
  };

  //add the new movie to the array
  movies.push(newMovie);

  // Respond with the updated list of movies
  res.json({ status: 200, data: movies });
});


//step-9-delete
app.delete('/movies/delete/:id', (req, res) => {
  const { id } = req.params;
  const {username,password}=req.query;
  console.log(username);

  if(!username || !password){
    console.log("user is not deifined")
  }

  // Find the movie with the specified ID
  const movieToDelete = movies.find((movie) => movie.id === parseInt(id));

  if (!movieToDelete) {
    res.json({ status: 404, error: true, message: `the movie ${id} does not exist` });
    return;
  }

  // the updatedMovies is a new variable for all Id without the targeted id 
  const updatedMovies = movies.filter((movie) => movie.id !== parseInt(id));

  // Update the movies array
  movies.length = 0; //clears the original movies array.
  movies.push(...updatedMovies);  ///adds all the elements from updatedMovies back into the movies array.

  // Respond with the updated list of movies
  res.json({ status: 200, data: movies });
});


//step-10-update
app.put('/movies/update/:id', (req,res)=>{
  const{id}=req.params
  const { title, year, rating } = req.body;

  // Find the movie with the specified ID
  const movieToUpdate = movies.find((movie) => movie.id === parseInt(id));

  if (!movieToUpdate) {
    return res.json({ status: 404, error: true, message: `the movie ${id} does not exist` });
  }

  
  if (title !== undefined) {
    movieToUpdate.title = title;
  }
  if (year !== undefined) {
    movieToUpdate.year = parseInt(year);
  }
  if (rating !== undefined) {
    movieToUpdate.rating = parseFloat(rating);
  }

  res.json({ status: 200, data: movieToUpdate });
});


//step 13: Authentication

//get all users
app.get("/users", (req,res)=>{
    res.json({ status: 200, data: users });
  });

//add users
app.post("/user/add", (req, res) => {
  const { id,username, password } = req.body;

     // Check if the username already exists in the array
  const checkForUser = users.find((user) => user.username === username);
  if (checkForUser) {
    return res.status(404).json({ status: 404, message: "User already exists" });
  }

     // Add the new user to the array
  users.push({ id,username, password });
  res.json({ status: 200, message: "User created successfully.", data: users });
});

//delete user
app.delete("/user/delete/:id", (req,res)=>{
  const { id } = req.params;
  const userToDelete = users.find((user) => user.id === parseInt(id));

  if (!userToDelete) {
    res.json({ status: 404, error: true, message: `the user with id ${id} does not exist` });
    return;
  }

  const updatedUsers = users.filter((user) => user.id !== parseInt(id));


  // Update 
  users.length = 0; //clears the original array
  users.push(...updatedUsers);  ///adds all the elements from updatedUsers back into the movies array.

  // Respond with the updated list of movies
  res.json({ status: 200, data:users });
});


//update user
app.patch("/user/update/:id",(req,res)=>{
  const { id } = req.params;
  const { username, password} = req.body;

  // Find the user with the specified ID
  const userToUpdate = users.find((user) => user.id === parseInt(id));

  if (!userToUpdate) {
    return res.json({ status: 404, error: true, message: `the user with id ${id} does not exist` });
  }

  
  if (username!== undefined ) {
    userToUpdate.username=username
  }
  if (password !== undefined) {
    userToUpdate.password = parseInt(password);
  }


  res.json({ status: 200, data: userToUpdate });
});


//connect to mongoose
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected and Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });

