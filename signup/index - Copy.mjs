import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
const dynamo = DynamoDBDocument.from(new DynamoDB());
const USERS_TABLE = "user"; 
export const handler = async (event) => {
 
  const { email, password, name, profileImage } = JSON.parse(event.body);
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
      TableName: USERS_TABLE,
      Item: {
          email,
          password: hashedPassword,
          name,
          profileImage, // initially null or empty string until image is uploaded
      },
  };

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        switch (event.httpMethod) {
            case 'GET':
                body = await dynamo.scan({ TableName: USERS_TABLE });
                break;
                
            case 'POST':
                body =    await dynamo.put(params);
                break;
            case 'PUT':
                body = await dynamo.update(JSON.parse(event.body));
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
