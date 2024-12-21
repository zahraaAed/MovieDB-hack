const express = require("express");
const app = express();
const PORT = 3000;

// added to handle JSON data in POST requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok");
});

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
    res.status(200).json({ status: 200, message: "ok", data: s });
  } else {
    res
      .status(500)
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
app.get("/movies/read", (req, res) => {
  res.status(200).json({ status: 200, data: movies });
});
//create
app.get("/movies/create", (req, res) => {
  res.status(200).json({ status: 200, message: "Create movie route" });
});

//update
app.get("/movies/update", (req, res) => {
  res.json({ status: 200, message: "This is to update route" });
});

// delete
app.get("/movies/delete", (req, res) => {
  res.json({ status: 200, message: "This is to delete route" });
});

//step-6-search

//  movies ordered by date
app.get("/movies/read/by-date", (req, res) => {
  const moviesByDate = movies.slice().sort((a, b) => a.year - b.year); //we use slice to make copy of the original array beore sorting them
  res.status(200).json({ status: 200, data: moviesByDate });
});

//  movies ordered by rating
app.get("/movies/read/by-rating", (req, res) => {
  const moviesByRate = movies.slice().sort((a, b) => b.rating - a.rating);
  res.status(200).json({ status: 200, data: moviesByRate });
});

//  movies ordered by title
app.get("/movies/read/by-title", (req, res) => {
  const moviesByTitle = movies
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title)); // .localeCompare(), the sorting is done in a way that ignores case and follows alphabetical order correctly, regardless of accents.
  res.status(200).json({ status: 200, data: moviesByTitle });
});

//step-7-read one
app.get("/movies/read/id/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((item) => item.id === parseInt(id));

  if (movie) {
    res.status(200).json({ status: 200, data: movie });
  } else {
    res
      .status(404)
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
      .status(403)
      .json({
        status: 403,
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
      .status(403)
      .json({
        status: 403,
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
  res.status(200).json({ status: 200, data: movies });
});


//step-9-delete
app.delete('/movies/delete/:id', (req, res) => {
  const { id } = req.params;

  // Find the movie with the specified ID
  const movieToDelete = movies.find((movie) => movie.id === parseInt(id));

  if (!movieToDelete) {
    res.status(404).json({ status: 404, error: true, message: `the movie ${id} does not exist` });
    return;
  }

  // the updatedMovies is a new variable for all Id without the targeted id 
  const updatedMovies = movies.filter((movie) => movie.id !== parseInt(id));

  // Update the movies array
  movies.length = 0; //clears the original movies array.
  movies.push(...updatedMovies);  ///adds all the elements from updatedMovies back into the movies array.

  // Respond with the updated list of movies
  res.status(200).json({ status: 200, data: movies });
});


// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
