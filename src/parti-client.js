import AWS from 'aws-sdk';

export const _dynamo = new AWS.DynamoDB();

const partiWrapper = async (method, params) => {
    let response;

    try {
        console.info(`calling parti client ${method}: `, params);

        let data = [];
        let next;

        do {
            const results = await _dynamo[method]({ ...params, NextToken: next }).promise();

            next = results.NextToken;
            if (results.Items) {
                data.push(...results.Items);
            }
        } while (next);
        response = data;
    } catch (ex) {
        console.error(`${method} error: `, ex);

        response = { error: ex.message ?? ex };
    }

    return response;
};

export default partiWrapper;
