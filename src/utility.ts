import * as AWS from "aws-sdk";
export const s3Upload = (bucketName: string, objectKey: string, event: any): Promise<any> => {
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
    const uploadParams = {
        Bucket: bucketName,
        Key: objectKey,
        Body: JSON.stringify(event),
    };
    const getObjectParams = {
        Bucket: bucketName,
        Key: objectKey,
       };
    return s3.upload(uploadParams)
        .promise()
        .then((s3Data: unknown) => {
            console.log("S3 Response: ", s3Data);
        })
        .catch((s3Error: unknown) => {
            console.log("S3 Response: ", s3Error);
        });

        // await s3.getObject(getObjectParams)
        //     .promise()
        //     .then((s3GetData: any) => {
        //         const getBodyContent = s3GetData.Body.toString("utf-8");
        //         expect(getBodyContent).to.be.equal(JSON.stringify(putObjectParams));
        //         console.log("S3 .getObject completed.");
        //     })
        //     .catch((getObjectError: any) => {
        //         throw new Error("Should not fall into .catch part of .getObject.");
        //     });
        // await s3.deleteObject(getObjectParams)
        //     .promise()
        //     .then((s3DeleteData: any) => {
        //         console.log("S3 .deleteObject completed.");
        //     })
        //     .catch((deleteObjectError: any) => {
        //         console.log("Should not fall into .catch part of .deleteObject.");
        //         console.log("deleteObjectError: ", deleteObjectError);
        //     });
};

export const getUniqueId = (): string => {
    const utcDate: any = new Date();
    const timeZoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
    const localDate = utcDate - timeZoneOffset;
    const myDate: any = new Date(localDate).toISOString();
    const myId = myDate.concat(String(Math.floor(Math.random() * Math.floor(100000000))));
    return myId;
};
// export const s3Upload = (event: any) => {
//     const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

//     const deadLetterKey = buildKey();
//     const uploadParams = {
//         Bucket: "cdsg-dead-letter-queue-events-bucket",
//         Key: deadLetterKey,
//         Body: JSON.stringify(event),
//     };

//     const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
//     s3.upload(uploadParams, options, (err: any, data: any) => {
//         if (err) {
//             console.log("Error", err);
//             return err;
//         }
//         if (data) {
//             console.log("Upload Success", data.Location);
//             return data.Location;
//         }
//     });
// };

// export const buildKey = () => {
//     const utcDate: any = new Date();
//     const timeZoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
//     const localDate = utcDate - timeZoneOffset;
//     const myDate: any = new Date(localDate).toISOString();
//     const myId = myDate.concat(String(Math.floor(Math.random() * Math.floor(100000000))));
//     const deadStage = process.env.stage;
//     const deadLetterKey = deadStage.concat("/", myId);
//     return deadLetterKey;
// };
