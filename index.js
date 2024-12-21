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
// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
