# rtk-lt

NERM stands for Node.js, Express, React and Material-UI. The repository is a simple sample of NERM application.

This repository was made as a source package for the following (Japanese) tutorial page.

* [そこそこ実用的な翻訳アプリを開発してみる (1) 概要編](https://qiita.com/yamachan360/items/5b20e7181d663d70e924)

# How to build

```
npm install
npm run build
```

Please check the `public/App.js` file is created/updated.

# How to start the application

At first, you should create Cloudant and Language Translator service, and get their credential information. You should input them into Server.js file.

For the local environment, type the following command, then open http://localhost:3000/ by web browser.

```
npm start
```

If you have an IBM Cloud account, type the following command to start it on the cloud (Need to change the application name to unique one);

```
cf login
cf push -m 128M rtk-lt
```
