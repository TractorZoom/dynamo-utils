import AWS from 'aws-sdk';

export const _dynamo = new AWS.DynamoDB();

function sliceIntoChunks(arr, chunkSize) {
    const res = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);

        res.push(chunk);
    }

    return res;
}

const partiWrapper = async (method, params) => {
    let response;

    try {
        console.info(`calling parti client ${method}: `, params);

        let data = [];
        let next;

        if (method === 'batchExecuteStatement' && params?.Statements?.length > 25) {
            const chunks = sliceIntoChunks(params.Statements, 25);

            for (const chunk of chunks) {
                const results = await _dynamo[method]({ Statements: chunk }).promise();

                if (results.Items) {
                    data.push(...results.Items);
                }
            }
        } else {
            do {
                const results = await _dynamo[method]({ ...params, NextToken: next }).promise();

                next = results.NextToken;
                if (results.Items) {
                    data.push(...results.Items);
                }
            } while (next);
        }
        response = data;
    } catch (ex) {
        console.error(`${method} error: `, ex);

        response = { error: ex.message ?? ex };
    }

    return response;
};

export default partiWrapper;
