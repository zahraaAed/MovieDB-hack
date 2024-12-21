const express=require("express");
const app=express();
const PORT=3000;

app.get('/', (req, res) => {
    res.send('ok')
  });


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


// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
