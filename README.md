# Nomic Web Engineer Interview Exercise

## Introduction

For a technical exercise, we're asking you to make some improvements to a real-world next.js repository. The code you'll see here is a slightly edited from next.js app that we made as a proof-of-concept for a client to show the ways that our API can be used to create a website showing similarity search in a vector space. When run, you can enter a text query and the map displays a list of the images from [an Atlas dataset](https://atlas.nomic.ai/data/nomic-multimodal-series/cc3m-100k-image-bytes-v15/map) that most closely resemble it.

This code was written very quickly with a lot of help from Anthropic's Claude. It is not production ready, and may have dead code, edge case bugs, etc.

The goal of this exercise is to showcase your ability to understand an existing next.js site with server- and client-side endpoints, assess opportunities and challenges in the application, and make decisions about how to improve or change it.

In the interview that follows this exercise, we will discuss the code you wrote, the decisions you made, and the challenges and opportunities you encountered.

## Task

You have been given a simple Next.js application that displays the results of our vector search endpoint. Your goal is to understand the codebase, identify opportunities for improvement or alternate functionalities, and implement those improvements as a new git branch..

Your improvements can involve any aspect of the application, including (but not limited to) the user interface, website functionality, API calls, data processing, framework/architecture, or code quality.

### Requirements

- Spend no more than 3 hours on this exercise. We are assessing how you approach the problem and think through the challenges, not how much code you can write in a short period of time.

- Feel free to leave areas marked as TODO or implement stubs of functions, classes, or components that you don't fully use if you think they'd be fruitful for discussion.

 - That said, it would be best if you did so in a way that `npm run dev` still runs on your branch so we can see your changes in action.
 

- Create one or more PRs with your improvements. In each PR, include a brief description of the changes you made and why you made them at the bottom of this README.

- You can use LLMs like Claude or GitHub copilot in whatever way you see fit. (We would!) You should be prepared to discuss both architectural decisions and low-level implementations in the interview. 

## Setup

1. Place this repository in a local folder on your machine. It already contains a git repository.

2. Install the npm dependencies

3. Create a `.env` file in the root of the project with the following content:

   ```bash
   PRIVATE_ATLAS_API_KEY=<your provided atlas api key>
   ```

   You should have recieved an API key in the email with this exercise.

4. Run the development server

   ```bash
   npm run dev
   ```

5. Navigate to the localhost URL provided in the console output. The search page can be found at `/search`.

_If you have issues with setting up the website, please reach out by e-mailing `bob@nomic.ai` and `ben@nomic.ai`._ It's very possible there are problems here.

## Resources

Here are some resources that might be helpful as you work on this exercise:

- [Next.js App Router Documentation](https://nextjs.org/docs)
- [Atlas kNN Search Documentation](https://docs.nomic.ai/reference/api/query/k-nn-search) - other atlas API documentation can be found in the sidebar
- [Underlying Atlas Dataset](https://atlas.nomic.ai/data/nomic-multimodal-series/cc3m-100k-image-bytes-v15) - This is the default dataset we are querying against
- [Atlas Typescript SDK](https://github.com/nomic-ai/ts-nomic) - lightly documented but useful to if you want to understand the underlying types

---

---

## Changes Made

_Please describe the changes you made and why you made them here._
