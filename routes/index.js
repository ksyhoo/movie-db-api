module.exports = function(app, client) {
  const db = client.db("moviedbapi");

  app.post("/api/recommend", (req, res) => {
    const movie = {
      title: req.body.title,
      poster_path: req.body.poster_path,
      overview: req.body.overview,
      id: req.body.id
    };
    db.collection("recommendations").findOne({ id: movie.id }, (err, result) => {
      if (err) throw err;
      else {
        if (!result) {
          db.collection("recommendations").insert([movie], (err, result) => {
            if (err) {
              res.send({ error: "An error has occurred" });
            } else {
              res.status(200).send(result.ops[0]);
            }
          });
        } else {
          res.status(500).send("This movie is allready in database. Duplicate");
        }
      }
    });
  });

  app.get("/api/get_recommendations", (req, res) => {
    db
      .collection("recommendations")
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        res.status(200).send(result);
      });
  });
};
