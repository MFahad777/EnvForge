# EnvForge

## Description

`envForge` is an npm package that simplifies the process of defining and validating environment variable schemas in your Node.js applications. With `envForge`, you can easily define a schema for your environment variables and ensure that your application's configuration meets the required specifications.

## Installation

To install `envForge`, use npm:

```bash
npm install envForge

or 

yarn add envForge
```
## Getting Started

```javascript
const envForge = require('envForge');
```

Define schema

```javascript
const defaultSchema = new EnvForge({path:"./.env"});

defaultSchema.createSchema({
    API_URL:[
        "required",
    ],
    S3_BUCKET_URL:[
        "required"
    ]
});

// Will validate, if any error will throw an error
defaultSchema.validate();
```

How to access keys

```javascript
// You can get all keys
defaultSchema.getAllKeys()

// You can get keys that defined in ur .env file
defaultSchema.getParsedKeys();
```

## API Reference

### Current Validations

- `required`
  - To make sure the key is present in .env file.
- `boolean`
  - To make sure the key is `true` or `false`
- `isin`
  - To make an enum for a key values.
  - `isIn:FIRST,SECOND,THIRD`, you use `:` as delimiter to separate the validation with the data and `,` is used to separate the values.
- `isarray`
  - To make sure the key value is array when parsed.

## Example

### Required

```javascript
defaultSchema.createSchema({
    API_URL:[
        "required",
    ],
    S3_BUCKET_URL:[
        "required"
    ]
});
```

### Boolean

```javascript
defaultSchema.createSchema({
    IS_DEVELOPMENT:[
        "boolean",
    ],
});
```

### isArray

```javascript
defaultSchema.createSchema({
    DATA:[
        "isarray",
    ],
});
```

### isIn

```javascript
defaultSchema.createSchema({
    ENVS:[
        "isin:DEV,STAGE,PROD",
    ],
});
```

### Other

1. prefixWithKeys

```javascript

// To prefix all the keys with "REACT_"
defaultSchema.createSchema({
  API_URL:[
    "required",
  ],
},{
  prefixKeysWith:"REACT_",
});
```

2. totalKeys

```javascript
defaultSchema.createSchema({
  API_URL:[
    "required",
  ],
},{
  totalKeys:10,
});

// This will make sure total keys in environment variable must be 10.
```

3. strict

```javascript
defaultSchema.createSchema({
  API_URL:[
    "required",
  ],
},{
  totalKeys:10,
  strict:true
});

// Strict option gets with totalKeys, setting it true make sure that totalKeys are exact number.
```

# License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.