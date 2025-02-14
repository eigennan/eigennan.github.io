---
title: "Blog"
layout: page
sitemap: false
permalink: /blogs/
---

<ul>
  {% for post in site.posts %}
    <li>
      {{ post.date | date: "%B %d, %Y" }}: <a href="{{ site.url }}{{ site.baseurl }}{{ post.url }}">{{ post.title}}</a>
    </li>
  {% endfor %}
</ul>
