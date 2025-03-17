---
title: '(Demo) Deploying an Astro App: A Step-by-Step Guide'
description: 'Learn how to deploy your Astro application with ease.'
author: 'Rishi Raj Jain'
published: true
head_image: 'https://picsum.photos/900/600?a=1'
blog_image: 'https://picsum.photos/900/600?a=1'
created_at: 2024-04-16T00:00:00.000+00:00
---

# Deploying an Astro App

In this guide, you will learn how to deploy an Astro application step by step. We'll cover setting up your project, configuring it for deployment, and deploying it to a hosting provider.

## Prerequisites

You'll need the following:

- [Node.js 18](https://nodejs.org/en/blog/announcements/v18-release-announce) or later
- A GitHub account
- A hosting provider such as [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)

## Create a new Astro application

First, create a new Astro project using the following command:

```bash
npm create astro@latest my-app
```

Follow the prompts and select the following options:

- `Empty` for the project template.
- `Yes` for TypeScript.
- `Strict` for TypeScript settings.
- `Yes` to install dependencies.
- `Yes` to initialize a Git repository.

Navigate to the project directory and start the development server:

```bash
cd my-app
npm run dev
```

Your app should now be running at [localhost:4321](http://localhost:4321/).

## Configure Deployment Settings

Before deploying, ensure that your project is configured correctly. Add a `package.json` script for building your application:

```json
"scripts": {
  "build": "astro build",
  "preview": "astro preview"
}
```

## Deploy to Vercel

To deploy to Vercel, install the CLI tool:

```bash
npm install -g vercel
```

Then, deploy your project:

```bash
vercel
```

Follow the prompts, and your site will be live in seconds!

## Deploy to Netlify

For Netlify, install the CLI tool:

```bash
npm install -g netlify-cli
```

Then, deploy your project:

```bash
netlify deploy --prod
```

This will generate a live URL for your Astro application.

## Conclusion

In this guide, you learned how to deploy an Astro application using Vercel and Netlify. Now, your project is live and ready for users!
