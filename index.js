const express=require("express");
const app=express();
const PORT=3000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});
