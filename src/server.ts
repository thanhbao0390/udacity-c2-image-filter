import express from 'express';
import bodyParser from 'body-parser';
const fs = require("fs");
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query;
    // check Caption is valid
    if (!image_url) {
      return res.status(500).send({ message: 'Bad request. Please add query param image_url.' });
    }

    await filterImageFromURL(image_url).then(
      (filteredpath) => {
        res.sendFile(filteredpath);
        
        fs.readdir(__dirname + "/util/tmp/", (err: any, files: any) => {
          const fileList: string[] = [];
          files.forEach((file: any) => {
            fileList.push(__dirname + "/util/tmp/" + file);
          });
          deleteLocalFiles(fileList);
        });
      },
      (err) => {
        return res.status(442).send({ message: 'It was unable to process.' + err});
      }
    );

   
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();