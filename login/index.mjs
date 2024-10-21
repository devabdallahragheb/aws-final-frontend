import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());
const USERS_TABLE = "users";
export const handler = async (event) => {

    const body = JSON.parse(event.body);
    const { email, password } = body;

    const params = {
        TableName: USERS_TABLE,
        Key: { email },
    };

    try {
        const result = await dynamo.get(params);
        if (!result.Item) {
            return { statusCode: 400, body: JSON.stringify({ error: "User not found" }) };
        }

        const user = result.Item;
    

        if (password!= user.password) {
            return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) };
        }
 
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User added successfully" }),
    };

    } catch (error) {
        console.error("Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};
