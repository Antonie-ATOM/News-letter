const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = 3000

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || port, function() {
  console.log("Server is running on port 3000");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/d7d4a02765"

  const options = {
    method: "POST",
    auth: "Antonie1:ba7df744a29a1423180d76dde5352069-us13"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});


app.post("/failure", function(req, res) {
  res.redirect("/")
})

// app.post("/success", function(req, res) {
//   res.redirect("/")
// })

// APP ID
// ba7df744a29a1423180d76dde5352069-us13

// LIST ID
// d7d4a02765
