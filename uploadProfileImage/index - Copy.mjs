import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { S3 } from '@aws-sdk/client-s3';
import jwt from 'jsonwebtoken';

const s3 = new S3();
const dynamo = DynamoDBDocument.from(new DynamoDB());
const USERS_TABLE = "user"; 
const BUCKET_NAME = "final-aws-uploaduser";
const JWT_SECRET = "abdullah";  // Same secret used for login

// Function to verify the JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const handler = async (event) => {
    const token = event.headers.Authorization || event.headers.authorization; // Get the token from headers
    const { email, imageBase64 } = event; // Assuming the data is in event.body

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || decoded.email !== email) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Unauthorized: Invalid or missing token" }),
        };
    }

    const buffer = Buffer.from(imageBase64, 'base64');
    const key = `profile-images/${email}.jpg`;

    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
    };

    try {
        // Upload image to S3
        await s3.putObject(uploadParams);

        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
        console.log(imageUrl);

        // Update DynamoDB user profile with image URL
        const updateParams = {
            TableName: USERS_TABLE,
            Key: { email },
            UpdateExpression: "set profileImage = :imageUrl",
            ExpressionAttributeValues: {
                ":imageUrl": imageUrl,
            },
            ReturnValues: "UPDATED_NEW",
        };

        await dynamo.update(updateParams);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Profile image uploaded successfully", imageUrl }),
        };
    } catch (error) {
        console.error("Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not upload profile image" }),
        };
    }
};
