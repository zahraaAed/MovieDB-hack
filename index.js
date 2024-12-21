const express=require("express");
const app=express();
const PORT=3000;

app.get('/', (req, res) => {
    res.send('ok')
  });

  //step-3- Create an express simple API

app.get('/test', (req,res)=>{
    res.json({ status: 200, message: "ok" });
});

app.get('/time', (req,res)=>{
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const currentTime = `${hours}:${minutes}`;
    
    res.json({ status: 200, message: currentTime });


});

//Step 4 - Let's complicate the API

app.get('/hello/:id?', (req, res) => {
    const { id } = req.params;
    if (id) {
      res.json({ status: 200, message: `Hello, ${id}` });
    } else {
      res.json({ status: 200, message: 'Hello!' });
    }
  });

  app.get('/search', (req, res) => {
    const { s } = req.query;
    if (s) {
      res.status(200).json({ status: 200, message: 'ok', data: s });
    } else {
      res.status(500).json({ status: 500, error: true, message: 'you have to provide a search' });
    }
  });

//step-5 basics of crud 
  const movies = [
    { id:1, title: 'Jaws', year: 1975, rating: 8 },
    {id:2, title: 'Avatar', year: 2009, rating: 7.8 },
    { id:3,title: 'Brazil', year: 1985, rating: 8 },
    { id:4,title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]
  // Read
app.get('/movies/read', (req, res) => {
    res.status(200).json({ status: 200, data: movies });
  });
  //create
  app.get('/movies/create', (req, res) => {
    res.status(200).json({ status: 200, message: 'Create movie route' });
  });

  //update
app.get('/movies/update', (req, res) => {
    res.json({ status: 200, message: 'This is to update route' });
  });
  
  // delete
  app.get('/movies/delete', (req, res) => {
    res.json({ status: 200, message: 'This is to delete route' });
  });


//step-6-search

  //  movies ordered by date
app.get('/movies/read/by-date', (req, res) => {
    const moviesByDate = movies.slice().sort((a, b) => a.year - b.year); //we use slice to make copy of the original array beore sorting them
    res.status(200).json({ status: 200, data: moviesByDate });
  });

  
 //  movies ordered by rating
 app.get('/movies/read/by-rating', (req, res) => {
    const moviesByRate = movies.slice().sort((a, b) => b.rating - a.rating);
    res.status(200).json({ status: 200, data: moviesByRate });
  });

  //  movies ordered by title
app.get('/movies/read/by-title', (req, res) => {
    const moviesByTitle = movies.slice().sort((a, b) => a.title.localeCompare(b.title)); // .localeCompare(), the sorting is done in a way that ignores case and follows alphabetical order correctly, regardless of accents.
    res.status(200).json({ status: 200, data: moviesByTitle });
  });


//step-7-read one
app.get('/movies/read/id/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((item) => item.id === parseInt(id));
  
  if (movie) {
    res.status(200).json({ status: 200, data: movie });
  } else {
    res.status(404).json({ status: 404, error: true, message: `The movie ${id} does not exist` });
  }
});


// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
