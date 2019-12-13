const line = require("@line/bot-sdk");
const express = require("express");
const axios = require("axios");
const config = {
  channelAccessToken: "xxx",
  channelSecret: "xxx"
};

// create LINE SDK client
const client = new line.Client(config);
const app = express();

var mentah = event.message.text;
var split = mentah.split(" ");
var i;
var msgg = "";
var msgg_balasan = "";
var temp_user = "";

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(e => {
      console.log(e);
    });
});

function handleEvent(event) {
  console.log(event);
  const qc = {
    type: "template",
    altText: "Curhatin aja semua sama Advo :)",
    template: {
      type: "buttons",
      thumbnailImageUrl:
        "https://pbs.twimg.com/profile_images/995631256695062529/cT-fhU0I_400x400.jpg",
      imageAspectRatio: "rectangle",
      imageSize: "cover",
      imageBackgroundColor: "#FFFFFF",
      title: "Mama & Advo",
      text: "Curhatkan permasalahanmu dengan Advo",
      defaultAction: {
        type: "uri",
        label: "View detail",
        uri: "http://example.com/page/123"
      },
      actions: [
        {
          type: "message",
          label: "Curhat Dong Advo",
          text: "/curhatdong"
        }
      ]
    }
  };

  if (event.type == "follow") {
    console.log("followed");
    //temp_user = event.source.userId;
    //const echo = { type: 'text', text: 'Silahan curhatkan permasalahan kakak disini :)'};
    client.replyMessage(event.replyToken, qc);
  } else if (event.type == "unfollow") {
    console.log("unfollowed");
    //temp_user = event.source.userId;
    //const echo = { type: 'text', text: 'Silahan curhatkan permasalahan kakak disini :)'};
    //client.replyMessage(event.replyToken, echo);
  } else {
    for (var i = 0; i < split.length; i++) {
      msgg += split[i] + " ";
    }

    for (var i = 2; i < split.length; i++) {
      msgg_balasan += split[i] + " ";
    }

    if (split[0] == "/curhatdong") {
      const echo = {
        type: "text",
        text: "Silahan curhatkan permasalahan kakak disini :)"
      };
      return client.replyMessage(event.replyToken, echo);
    } else if (split[0] == "/balas") {
      axios
        .get("http://hmif.ub.ac.id/test3", {
          params: {
            idUser: "xxx",
            role: "admin",
            displayName: "ADVOKESMA",
            foto: "null"
          }
        })
        .then(console.log("admin"))
        .then(
          axios
            .get("http://hmif.ub.ac.id/test2", {
              params: {
                idUser: "xxx",
                idTo: split[1],
                message: msgg_balasan
              }
            })
            .then(console.log("message admin"))
        );

      kirim(split[1], msgg_balasan);
    } else {
      if (event.source.type == "user") {
        axios
          .get("https://api.line.me/v2/bot/profile/" + event.source.userId, {
            headers: {
              Authorization: "Bearer xxx"
            }
          })
          .then(function(response) {
            kirim("xxx", response.data.displayName + " : " + msgg);
            kirim("xxx", event.source.userId);
            axios
              .get("http://hmif.ub.ac.id/test3", {
                params: {
                  idUser: event.source.userId,
                  role: "user",
                  displayName: response.data.displayName,
                  foto: response.data.pictureUrl
                }
              })
              .then(
                axios
                  .get("http://hmif.ub.ac.id/test2", {
                    params: {
                      idUser: event.source.userId,
                      idTo: "xxx",
                      message: msgg
                    }
                  })
                  .then(console.log("message admin"))
              );
          });
        //kirim('xxx',msgg);
      }
    }
  }
}

function kirim(to, msg) {
  const test = {
    to: to,
    messages: [
      {
        type: "text",
        text: msg
      }
    ]
  };

  axios.post("https://api.line.me/v2/bot/message/push", test, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer xxx"
    }
  });
}

function getDisplayName(userId) {
  const displayName = "";

  axios
    .get("https://api.line.me/v2/bot/profile/" + userId, {
      headers: {
        Authorization: "Bearer xxx"
      }
    })
    .then(function(response) {
      return response.data.displayName;
    });

  //return displayName;
}

// listen on port
const port = 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
