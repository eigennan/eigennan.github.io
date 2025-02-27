---
title: 'How I Built My Website'
seoTitle: 'How I built my website'
slug: 'how-i-built-my-website'
description: 'A tutorial for building a personal website using Astro and Github pages'
pubDate: '2025-02-24'
updatedDate: '2025-02-24'
tags: ["Astro", "Guide", "Github Pages"]
coverImage: './astro-banner.png'
---

## Astro Template

My website is based on [devolio][1], an Astro based blog template that offers blazing fast response and no-frill, minimalist layout. I then added few more functionalities such as hover effects, cite buttons for publications and [KaTeX][3] support.

## Hosting

This website is hosted on Github. You can follow this [guide][2] to deploy an Astro website on Github. Astro websites can be built locally on your own computer before deploying it on hosting services like Netlify or Vercel. This allows you to see what it looks like before publishing changes on the server. This building process is independent of the Github deployment, i.e., you can make a commit to Github and let it deploy on its own with having the website built on your local devices in advance.

[1]: https://github.com/devaradise/devolio
[2]: https://docs.astro.build/en/guides/deploy/github/
[3]: https://katex.org