import https from "https";

export const notify = async (slackPostPath: string, s3bucketName: string, s3ObjectKey: string) => {
  const messageToSend = customizeSlackMessage(s3bucketName, s3ObjectKey);
  return await sendSlackMessage(slackPostPath, messageToSend)
          .then((slackData: unknown) => {
            console.log("Slack Message Response:", slackData);
            return slackData;
          })
          .catch((slackError: unknown) => {
            console.log("Slack Message Response Error:", slackError);
            return slackError;
          });
};

export const sendSlackMessage = (SlackPostPath: string, messageInput: object): Promise<any> => {

  const POST_OPTIONS = {
    hostname: "hooks.slack.com",
    path: SlackPostPath,
    method: "POST",
    timeout: 25000,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const postBody = JSON.stringify(messageInput);

  return new Promise((resolve, reject) => {
    const req = https.request(POST_OPTIONS, (res) => {
      let body = " ";
      res.setEncoding("utf8");
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        if (res.headers["content-type"] === "application/json") {
          body = JSON.parse(body);
        }
        resolve(body);
      });
      req.on("error", (error) => {
        reject(error);
      });
    });
    req.write(postBody);
    req.end();
  }).then((result: any) => {
    return result;
  }).catch((error: any) => {
    return error;
  });
};

export const customizeSlackMessage = (s3bucketName: string, s3ObjectKey: string) => {
  const priorityValue = "High";
  let customizedTexts: string;

  customizedTexts = `Order Intake (aka Splitter) transaction failed to process and sent to ${s3bucketName}. Objects key ${s3ObjectKey}`;

  const slackMessage = {
    attachments: [
      {
        fallback: "",
        color: "#36a64f",
        pretext: "Splitter DLQ Slack Notify",
        author_name: "Delete Letter Queue LAMBDA",
        author_link: "https://console.aws.amazon.com/",
        title: "Failed OrderIntake Transaction",
        // title_link: "https://api.slack.com/",
        text: customizedTexts,
        fields: [
          {
            title: "Priority",
            value: priorityValue,
            short: false,
          },
        ],
        // image_url: "http://my-website.com/path/to/image.jpg",
        // thumb_url: "http://example.com/path/to/thumb.png",
        footer: "Slack API",
        footer_icon: "https://platform.slack-edge.com/img/default_application_icon.png",
        ts: Date.now() / 1000,
      },
    ],
  };
  return slackMessage;
};
