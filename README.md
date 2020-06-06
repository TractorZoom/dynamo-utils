# @tractorzoom/dynamo-utils

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest) [![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Available Methods

##### Method: `docClient(method, params)`

| parameter | type   | description                                                                                                                     |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| method    | string | [any valid dynamo document client method](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) |
| params    | object | object params accepted by the corresponding dynamo document client method                                                       |

## How do I use? :thinking:

##### Installation:

```bash
npm i @tractorzoom/dynamo-utils
```

##### Usage:

```js
import { docClient } from '@tractorzoom/dynamo-utils';

export const putHandler = async () => {
    const params = {
        Table: 'MyTable',
        Item: { key: 'super awesome item' },
    };

    const response = await docClient('put', params);

    if (response.error) {
        return internalServerError(response.error);
    }

    return ok(response);
};
```
