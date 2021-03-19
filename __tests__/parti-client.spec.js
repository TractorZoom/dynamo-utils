import chance from '@tractorzoom/chance-the-wrapper';
import partiClient, { _dynamo } from '../src/parti-client';

const methodsToTest = [['executeStatement'], ['batchExecuteStatement']];

jest.setTimeout(30000);

describe.each(methodsToTest)('partiClient method tests', (method) => {
    it(`should call docClient.${method} with the correct params`, async () => {
        // given
        const params = chance.object();
        const item = chance.object();

        const partiClientSpy = jest.spyOn(_dynamo, method).mockReturnValue({
            promise: () => Promise.resolve({ Items: [item] }),
        });

        // when
        await partiClient(method, params);

        // then
        expect(partiClientSpy).toHaveBeenCalledTimes(1);
        expect(partiClientSpy).toHaveBeenCalledWith({ ...params, NextToken: undefined });
    });

    it(`should return the response`, async () => {
        // given
        const params = chance.object();
        const item = chance.object();

        jest.spyOn(_dynamo, method).mockReturnValue({
            promise: () => Promise.resolve({ Items: [item] }),
        });

        // when
        const response = await partiClient(method, params);

        // then
        expect(response).toEqual([item]);
    });

    it('should return an error message response when there is an error', async () => {
        //given
        const params = chance.object();
        const errorResponse = { message: chance.name() };
        jest.spyOn(_dynamo, method).mockReturnValue({
            promise: () => Promise.reject(errorResponse),
        });

        // when
        const response = await partiClient(method, params);

        // then
        expect(response).toEqual({ error: errorResponse.message });
    });

    it('should return an error response when there is an error', async () => {
        // given
        const params = chance.object();
        const error = chance.name();
        jest.spyOn(_dynamo, method).mockReturnValue({
            promise: () => Promise.reject(error),
        });

        // when
        const response = await partiClient(method, params);

        // then
        expect(response).toEqual({ error });
    });
});
