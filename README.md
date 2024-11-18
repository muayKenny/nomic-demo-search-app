# Nomic Web Engineer Interview Assignment

## Introduction

The goal of this assignment is to gain insight into your ability to understand an existing web architecture, assess opportunities and challenges in the application, and make decisions about how to improve it.

In the interview that follows this assignment, we will discuss the code you wrote, the decisions you made, and the challenges and opportunities you encountered.

## Task

You have been given a simple Next.js application that displays the results of our vector search endpoint. Your goal is to understand the codebase, identify opportunities for improvement, and implement those improvements as one or more pull requests.

Your improvements can involve any aspect of the application, including (but not limited to) the user interface, website functionality, API calls, data processing, framework/architecture, or code quality.

### Requirements

- Spend no more than 3 hours on this assignment. We are assessing how you approach the problem and think through the challenges, not how much code you can write in a short period of time.

- Create one or more PRs with your improvements. In each PR, include a brief description of the changes you made and why you made them at the bottom of this README.

- You are encouraged to use LLMs in whatever way you see fit. You should be prepared to discuss both architectural decisions and low-level implementations in the interview.

## Setup

1. Place this repository in a local folder on your machine. It already contains a git repository.

2. Install the npm dependencies

3. Create a `.env` file in the root of the project with the following content:

   ```bash
   PRIVATE_ATLAS_API_KEY=<your provided atlas api key>
   ```

   You should have recieved an API key in the email with this assignment.

4. Run the development server

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Navigate to the localhost URL provided in the console output. The search page can be found at `/search`.

_If you have issues with setting up the website, please reach out._

## Resources

Here are some resources that might be helpful as you work on this assignment:

- [Next.js App Router Documentation](https://nextjs.org/docs)
- [Atlas kNN Search Documentation](https://docs.nomic.ai/reference/api/query/k-nn-search) - other atlas API documentation can be found in the sidebar
- [Underlying Atlas Dataset](https://atlas.nomic.ai/data/nomic-multimodal-series/cc3m-100k-image-bytes-v15) - This is the default dataset we are querying against
- [Atlas Typescript SDK](https://github.com/nomic-ai/ts-nomic) - lightly documented but useful to if you want to understand the underlying types

---

---

## Changes Made

_Please describe the changes you made and why you made them here._
