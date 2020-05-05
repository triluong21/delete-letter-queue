import * as Utils from "./utility";
import { Callback, Context, Handler, SQSEvent } from "aws-lambda";
import { notify } from "./slackMessage";

export const expediteDeadLetter: Handler = async (
  event: SQSEvent,
  context: Context,
  callback?: Callback) => {
  console.log("Logging DLQ Event: " + event);
  let response = {};
  try {
    const entryTimeStamp = JSON.parse(event.Records[0].body).timestamp;

    console.log("My timestamp: ", entryTimeStamp);

    const bucketName = "mydlqservice-events-bucket";
    const dlqS3ObjectKey = process.env.stage.concat("/", Utils.getUniqueId());
    console.log("my queue entry: ", event);
    await Utils.s3Upload(bucketName, dlqS3ObjectKey, event)
    .catch((error: any) => {
      console.log("Upload delete-letter to S3 failed. Error: ", error);
      response = {
        statusCode: 400,
        returnMessage: JSON.stringify({ message: "Failed to move Delete Letter record to S3."}),
      };
      callback(null, response);
    });
    const url = process.env.deleteLetterSlackPostPath;
    console.log("Start sending slack", url);
    await notify(url, bucketName, dlqS3ObjectKey)
    .catch((error: any) => {
      console.log("Send slack message failed. Error: ", error);
      response = {
        statusCode: 400,
        returnMessage: JSON.stringify({ message: "Failed to send Delete Letter notification to slack channel."}),
      };
      callback(null, response);
    });
    console.log("Done sending");
    response = {
      statusCode: 200,
      returnMessage: JSON.stringify({ message: "Successfully moved Delete Letter record to S3."}),
    };
    callback(null, response);
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 400,
      returnMessage: JSON.stringify({ message: "Failed to move Delete Letter record to S3."}),
    };
    callback(null, response);
    }
};
