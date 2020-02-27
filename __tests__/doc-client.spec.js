import Chance from 'chance';
import dynamo from 'aws-sdk/clients/dynamodb';
import docClient from '../src/doc-client';

const chance = new Chance();

const methodsToTest = [
    ['batchGet'],
    ['batchWrite'],
    ['createSet'],
    ['delete'],
    ['get'],
    ['put'],
    ['query'],
    ['scan'],
    ['transactGet'],
    ['transactWrite'],
    ['update']
];

describe.each(methodsToTest)('docClient method tests', method => {
    let mockData, docClientSpy;

    beforeEach(() => {
        mockData = {
            params: { key: chance.hash() },
            response: chance.string(),
            errorResponse: chance.string()
        };

        docClientSpy = jest.spyOn(dynamo.DocumentClient.prototype, method).mockReturnValue({
            promise: () => Promise.resolve(mockData.response)
        });
    });

    afterEach(() => {
        docClientSpy.mockRestore();
    });

    it(`should call docClient.${method} with the correct params`, async () => {
        await docClient(method, mockData.params);

        expect(docClientSpy).toHaveBeenCalledTimes(1);
        expect(docClientSpy).toHaveBeenCalledWith(mockData.params);
    });

    it(`should return the response`, async () => {
        const response = await docClient(method, mockData.params);

        expect(response).toEqual(mockData.response);
    });

    it('should return an error response when there is an error', async () => {
        const errorResponse = { error: `${mockData.errorResponse}` };

        docClientSpy = jest.spyOn(dynamo.DocumentClient.prototype, method).mockReturnValue({
            promise: () => Promise.reject(mockData.errorResponse)
        });

        const response = await docClient(method, mockData.params);

        expect(response).toEqual(errorResponse);
    });
});
