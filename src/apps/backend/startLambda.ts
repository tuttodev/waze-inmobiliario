import serverless from 'serverless-http'
import { type APIGatewayEvent, type Context } from 'aws-lambda'
import {LambdaApp} from "@/apps/backend/LambdaApp";

module.exports.handler = async (event: APIGatewayEvent, context: Context) => {
    console.log('Starting serverless app')

    const lambda = new LambdaApp()
    void lambda.start();

    console.log('Server started')

    const handler = serverless(lambda.httpServer)

    return await handler(event, context)
}
