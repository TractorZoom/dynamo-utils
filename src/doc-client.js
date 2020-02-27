import dynamo from 'aws-sdk/clients/dynamodb';

const docClient = new dynamo.DocumentClient();

const docClientWrapper = async (method, params) => {
    let response;

    try {
        console.info(`calling dynamo ${method}: `, params);

        response = await docClient[method](params).promise();
    } catch (ex) {
        console.error(`${method} error: `, ex);

        response = { error: `${ex}` };
    }

    return response;
};

export default docClientWrapper;
