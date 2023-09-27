exports.profile = async(userId,pictureUrl,displayName) => {
  return {
    "type": "flex",
    "altText": "Profile",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "image",
                    "url": pictureUrl,
                    "aspectMode": "cover",
                    "size": "full"
                  }
                ],
                "cornerRadius": "100px",
                "width": "172px",
                "height": "172px"
              }
            ],
            "alignItems": "center",
            "justifyContent": "center"
          },
          {
            "type": "text",
            "text": displayName,
            "weight": "bold",
            "size": "xl",
            "margin": "md",
            "align": "center"
          },
          {
            "type": "text",
            "text": userId,
            "color": "#aaaaaa",
            "size": "md",
            "align": "center"
          }
        ]
      }
    }
  }

};

