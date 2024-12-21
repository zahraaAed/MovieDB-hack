const express=require("express");
const app=express();
const PORT=3000;

app.get('/', (req, res) => {
    res.send('ok')
  })







// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});
