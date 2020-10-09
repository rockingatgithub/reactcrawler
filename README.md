# React-Crawler

A crawler to with node.js as backend and react as frontend.

## Installation

> Below are links for both repo. You need to clone both in same directory.
> Clone the [repo](https://github.com/rockingatgithub/reactcrawler) and
> Also clone the [frontend-repo](https://github.com/rockingatgithub/reactcrawler-client)
> All front-end request API is on localhost:9000 and react runs on port 3000(by default).
> If you want redirect request to other port make changes in the fetch-url in the react app.
> Make sure you have mongodb community edition installed as this project uses mongodb as database.
> In case you don't have mongoDB you can use mongoDB cloud edition by configuring (mongoose.js) in config directory.

Go to client directory and then run below command in terminal or cmd.

```bash
 npm install
 npm start
```

Go to api directory and then run below command in terminal or cmd.

```bash
 npm install
 npm start
```

## Usage

- Check if both api and client are working properly in the terminal.
- Go to your browser and open "localhost:3000" (if react doesn't open it automatically)

### Note:-

> You need to check if you have mongoDB installed and running, if not use any mongoDB cloud edition by configuring (mongoose.js) in config directory. otherwise you can comment out the database read/write code from controllers directory files.
> Make sure your port 3000 & 9000 are free.
> App will run fine without the database too, just data will not be persistent.

## Routes

- Home routes
  - http://localhost:3000
  - http://localhost:9000 (Server renderd page)

## Test

> Test are provided using mocha and chai.
> Test files are present in test directory of api.
> To run test run the commands below.

```bash
  npm run test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
