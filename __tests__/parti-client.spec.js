import chance from '@tractorzoom/chance-the-wrapper';
import partiClient, { _dynamo } from '../src/parti-client';

const methodsToTest = [['executeStatement'], ['batchExecuteStatement']];

describe.each(methodsToTest)('partiClient method tests', (method) => {
    it(`should call partiClient.${method} with the correct params`, async () => {
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

    it('should not add to data array if no Items returned', async () => {
        // given
        const params = chance.object();
        const item = chance.object();
        jest.spyOn(_dynamo, method).mockReturnValue({
            promise: () => Promise.resolve({ Responses: [item] }),
        });

        // when
        const response = await partiClient(method, params);

        // then
        expect(response).toEqual([]);
    });
});

describe('batchExecuteStatement', () => {
    it('should make multiple calls if statements > 25', async () => {
        // given
        const statements = chance.n(
            () => ({ Statement: `UPDATE "SomeTable" SET foo = '${chance.name()}' where key = '${chance.natural()}';` }),
            26
        );
        const params = { Statements: statements };
        const item = chance.object();
        jest.spyOn(_dynamo, 'batchExecuteStatement').mockReturnValue({
            promise: () => Promise.resolve({ Responses: [] }),
        });

        // when
        const response = await partiClient('batchExecuteStatement', params);

        // then
        expect(_dynamo.batchExecuteStatement).toHaveBeenCalledTimes(2);
        expect(_dynamo.batchExecuteStatement).toHaveBeenNthCalledWith(1, {
            Statements: statements.slice(0, 25),
        });
        expect(_dynamo.batchExecuteStatement).toHaveBeenNthCalledWith(2, {
            Statements: statements.slice(-1),
        });
    });

    it('should make multiple calls if statements > 25, returns items', async () => {
        // given
        const statements = chance.n(
            () => ({ Statement: `UPDATE "SomeTable" SET foo = '${chance.name()}' where key = '${chance.natural()}';` }),
            26
        );
        const params = { Statements: statements };
        const item = chance.object();
        jest.spyOn(_dynamo, 'batchExecuteStatement').mockReturnValue({
            promise: () => Promise.resolve({ Items: [item] }),
        });

        // when
        const response = await partiClient('batchExecuteStatement', params);

        // then
        expect(response).toEqual([item, item]);
        expect(_dynamo.batchExecuteStatement).toHaveBeenCalledTimes(2);
        expect(_dynamo.batchExecuteStatement).toHaveBeenNthCalledWith(1, {
            Statements: statements.slice(0, 25),
        });
        expect(_dynamo.batchExecuteStatement).toHaveBeenNthCalledWith(2, {
            Statements: statements.slice(-1),
        });
    });
});
