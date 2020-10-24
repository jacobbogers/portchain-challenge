# portchain-challenge

## Configuration

This app uses a config file `config.json` for external REST endpoints

```json
{
    "urlPortCalls": "https://import-coding-challenge-api.portchain.com/api/v2/schedule/",
    "urlVessels": "https://import-coding-challenge-api.portchain.com/api/v2/vessels",
    "parallelism": 30
}
```

- `urlVessels`: The REST endpoint to get all the vessels data as json
- `urlPortCalls`: the prefix url, to get port calls per vessel
- `parallelism`: throttling by specifying maximum concurrent request, (to get port call data).


## Installation

After cloning/download, install dependencies

```bash
npm install
```

## Run 

To run the app type:

```bash
npm start
```

## Unit test

Run Unit test for the reports

```bash
npm test
```

# Code coverage

```bash
npm run coverage
```

# Code linting

run lint (eslint) check

```bash
npm run lint
```

have eslint fix  issues

```bash
npm run fix
```





