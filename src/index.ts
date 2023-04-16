import express from 'express';

const app = express();


// start the server
app.listen(8080, () => {
  console.log(`server running : http://localhost:8080`);
});
