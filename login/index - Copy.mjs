import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const dynamo = DynamoDBDocument.from(new DynamoDB());
const JWT_SECRET = "abdullah";  
const USERS_TABLE = "user"; 
const generateToken = (email) => {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
};

export const handler = async (event) => {
   
    const { email, password } = event; 
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
        const isValid = await bcrypt.compare(password, user.password);
      
        if (!isValid) {
            return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) };
        }
    
        // Generate JWT
     const token = generateToken(email);
        return {
            statusCode: 200,
            body: token,
        };

    } catch (error) {
        console.error("Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};
