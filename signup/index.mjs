import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());
const USERS_TABLE = "users";

export const handler = async (event) => {
  try {

    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
 
    const { email, password, name, profileImage } = body || {};
    const params = {
      TableName: USERS_TABLE,
      Item: {
        email,
        password,
        name: name || null, 
        profileImage: profileImage || null,
      },
    };

    await dynamo.put(params);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User added successfully" }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
