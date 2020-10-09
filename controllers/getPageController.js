const puppeteer = require("puppeteer");
const chalk = require("chalk");
const fs = require("fs");
const Tag = require("../models/tag");
const Blog = require("../models/blog");
const SuggestedTag = require("../models/suggestedTag");

const error = chalk.bold.red;
const success = chalk.keyword("green");

// =======================================get user tags from database=============================================

module.exports.getUserTags = async function (req, res) {
  try {
    let tags = await Tag.find({});
    let tagsTitleArray = [];
    for (let i = 0; i < tags.length; i++) {
      tagsTitleArray.push(tags[i].tagTitle);
    }

    let suggestedTags = await SuggestedTag.find({});
    let suggestedTagsTitleArray = [];
    for (let i = 0; i < suggestedTags.length; i++) {
      suggestedTagsTitleArray.push(suggestedTags[i].tagTitle);
    }

    return res.status(200).json({
      message: "Here is list of tags of user interests",
      tags: tagsTitleArray,
      suggestedTags: suggestedTagsTitleArray,
    });
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      message: "Some error occured",
      error: err,
    });
  }
};

// ====================================fwetch page with puppeter=============================================

module.exports.getPage = async function (req, res) {
  try {
    // open the headless browser
    let browser = await puppeteer.launch({
      // executablePath: "/usr/bin/chromium-browser",
      headless: true,
    });
    // open a new page
    let page = await browser.newPage();
    // enter url in page
    await page.goto(req.query.url, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    await page.waitForSelector("a");

    let posts = await page.evaluate(async () => {
      let titleNodeList = document.querySelectorAll(`h1`);
      let blogParaList = document.querySelectorAll(`p`);
      let hrefLinkList = document.querySelectorAll(`a`);
      let responseList = document.querySelectorAll(`pre`);
      let divList = document.querySelectorAll(`div`);

      let titleLinkArray = [];
      let paraListArray = [];
      let hrefListArray = [];
      let responseListArray = [];
      let divListArray = [];
      let authorsList = [];
      let tagsList = [];
      let minread = [];

      for (let i = 0; i < titleNodeList.length; i++) {
        titleLinkArray[i] = titleNodeList[i].innerText.trim();
      }
      let lengthArr = blogParaList.length > 5 ? 5 : blogParaList.length;
      for (let i = 0; i < lengthArr; i++) {
        paraListArray[i] = blogParaList[i].innerText.trim();
      }
      for (let i = 0; i < hrefLinkList.length; i++) {
        hrefListArray[i] = hrefLinkList[i].getAttribute("href").trim();
      }

      for (let i = 0; i < responseList.length; i++) {
        responseListArray[i] = responseList[i].innerText;
      }

      for (let i = 0; i < divList.length; i++) {
        divListArray[i] = divList[i].innerText;
      }

      authorsList = hrefListArray.filter((str) => {
        return str[1] === "@";
      });

      tagsList = hrefListArray.filter((str) => {
        return str.includes("tagged");
      });

      let responseUser = hrefListArray.filter((str) => {
        return str.includes("source=responses");
      });

      minread = divListArray.filter((str) => {
        return str.includes("min read");
      });

      //store the page and data in database.....................................

      let postListArray = {
        heading: titleLinkArray[0],
        blogContent: paraListArray[0],
        wholeBlogContent: paraListArray,
        links: hrefListArray,
        author: authorsList[0].substr(1, authorsList[0].indexOf("?") - 1),
        tags: tagsList,
        responseUser: responseUser,
        responses: responseListArray,
        timeRead: minread,
      };
      return postListArray;
    });

    // await page.pdf({ path: "page.pdf", format: "A4" });

    let blog = await Blog.findOne({
      blogUrl: req.query.url,
    });

    
    if (!blog) {
      await Blog.create({
        blogUrl: req.query.url,
        blogHeading: posts.heading,
        blogContent: posts.blogContent,
        blogAuthor: posts.author,
        blogTags: posts.tags,
      });
    }

    for (let i = 0; i < posts.tags.length; i++) {
      let tag = posts.tags[i].substr(posts.tags[i].lastIndexOf("/") + 1);
      let tagPresent = await SuggestedTag.findOne({
        tagTitle: tag,
      });

      if (!tagPresent) {
        await SuggestedTag.create({
          tagTitle: tag,
        });
      }
    }
    await browser.close();

    console.log(success("Browser Closed"));
    return res.json(200, {
      message: "Page fetched",
      pageResponse: posts,
    });
  } catch (err) {
    console.log(error(err));
    console.log(error("Browser Closed"));
    return res.json(401, {
      message: "Error occured",
    });
  }
};

//===============================================get page on tags...................................................

module.exports.getPageWithTag = async function (req, res) {
  try {
    // open the headless browser
    let browser = await puppeteer.launch({
      // executablePath: "/usr/bin/chromium-browser",
      headless: true,
    });
    
    let page = await browser.newPage();
    let tag = req.params.tag.toLowerCase();
    await page.goto(`https://medium.com/hackernoon/tagged/${tag}`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    let tagPresent = await Tag.findOne({
      tagTitle: tag,
    });

    if (!tagPresent) {
      await Tag.create({
        tagTitle: tag,
      });
    }

    await page.waitForSelector("a");

    let posts = await page.evaluate(() => {
      let postsdiv = document.querySelectorAll(
        "div.streamItem.streamItem--postPreview.js-streamItem"
      );
      let postsList = document.querySelectorAll("div.postArticle-readMore > a");

      let hrefListArray = [];

      for (let i = 0; i < postsList.length; i++) {
        hrefListArray[i] = postsList[i].getAttribute("href").trim();
      }

      let postListArray = {
        hrefListArray: hrefListArray,
      };
      return postListArray;
    });

    await browser.close();

    console.log(success("Browser Closed"));
    return res.json(200, {
      message: "Page fetched",
      pageResponse: posts,
    });
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    // await browser.close();
    console.log(error("Browser Closed"));
    return res.json(401, {
      message: "Error occured",
    });
  }
};

//......................................................get more with tag==============================================

module.exports.loadMoreWithTag = async function (req, res) {
  try {
    // open the headless browser
    let browser = await puppeteer.launch({
      // executablePath: "/usr/bin/chromium-browser",
      headless: true,
    });
    // open a new page
    let page = await browser.newPage();
    // enter url in page
    let tag = req.params.tag.toLowerCase();
    await page.goto(`https://medium.com/hackernoon/tagged/${tag}`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    let tagPresent = await Tag.findOne({
      tagTitle: tag,
    });

    if (!tagPresent) {
      await Tag.create({
        tagTitle: tag,
      });
    }

    await page.waitForSelector("a");
    let num1 = 0;
    let num2 = 0;
    let posts = await page.evaluate(() => {
      let postsdiv = document.querySelectorAll(
        "div.streamItem.streamItem--postPreview.js-streamItem"
      );
      let postsList = document.querySelectorAll("div.postArticle-readMore > a");
      num1 = postsList.length;
      window.scrollTo(0, document.body.scrollHeight);
      postsList = document.querySelectorAll("div.postArticle-readMore > a");
      num2 = postsList.length;
      let hrefListArray = [];

      for (let i = 0; i < postsList.length; i++) {
        hrefListArray[i] = postsList[i].getAttribute("href").trim();
      }

      let postListArray = {
        hrefListArray: hrefListArray,
      };
      return postListArray;
    });

    console.log(`we were here${num1} ${num2}`);

    await browser.close();

    console.log(success("Browser Closed"));
    return res.json(200, {
      message: "Page fetched",
      pageResponse: posts,
    });
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    // await browser.close();
    console.log(error("Browser Closed"));
    return res.json(401, {
      message: "Error occured",
    });
  }
};
