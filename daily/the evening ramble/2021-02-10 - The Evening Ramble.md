---
tags: ["journal/daily/evening-ramble"]
---
# 2021-02-10 - [[The Evening Ramble]]

- 5:58pm - wrapped up the day

It was a pretty good day today, was busy - got to geek about some learning and development stuff, shared the article I read last night on [[2021-02-09 - Our Roadmap for Becoming a Strategic]], and got to demo the Learning Hub I've been building out at work recently using [[Notion]]

Right now need a bit of not-screen-time, but - it was nice to have something that feels like has been an

- 'Evan being weird about notes and knowledge sharing' 

kind of project, and getting good feedback on it and people excited about it. 

# Misc Tweets added to the inbox

- [[1359530143602143237 - Having People Split 505...|Having people split 50/50 isn't really 50/50]]
- [[1359666634814849031 - I Have a Bunch of Stuff...|On my brain being a distrubted but connected mess]]
-  [[1359666634814849031 - If This Is the Only Thin...|Companies need continued anti-racist action, not check box diversity]]

# The App Sandbox

Was reading [The App Sandbox](https://slack.engineering/the-app-sandbox/) by Charlie Hess on the [slack.engineering](https://slack.engineering/) blog. [^hess1]

One of the things that I thought was interesting from this, was the use of [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) to untangle code that might be linking to unsafe modules.

But also for identifying dead code, unused code, etc and being able to remove it from the bundle.

![](https://slackhq.com/engineering/wp-content/uploads/sites/7/2020/06/0_mXLm9zpkhRfXLcXv.png)

> In practice it was not uncommon to see import chains dozens of files long, with thousands of nodes rendered, but with options like `exclude`, `focus`, and `doNotFollow` you can prune the tree into something legible. An unexpected benefit of this exercise was trimming the size of our JS bundles (particularly the preload, which runs on every page navigation) by relocating unexpected code or removing unused code. [h.](https://hyp.is/2W8MPmwOEeu_jm_lCPXxdA/slack.engineering/the-app-sandbox/) [^hess1]

- **note** execution time can be a big performance impact, especially if there are full page reloads.
	- I've seen the webpack bundle analyzer used to help sort some of this out - but another tool in the performance toolbox could be useful.

[^hess1]: [[@hessAppSandbox2020]]