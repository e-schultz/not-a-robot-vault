---
tags: ["inbox/readwise-review/bookreview/b7976586/hl"]
---
%%
- meta
	- UID: 202102251425
	- created: 2021-02-25
	- last updated: 2021-02-26
	- citation key: @majorsObservability3YearRetrospective2019
	- readwise highlight: https://readwise.io/bookreview/7976586?highlight=150132861
	- obsidian url: [202102251425](obsidian://open?vault=readwise-review-inbox&file=inbox%2Fzets%2F202102251425%20RW-R%20-%20ELI5%20-%20What%20does%20it%20mean%20for%20a%20system%20to%20be%20observable%3F)
%%

> “Less formally, this means that __one can determine the behavior of the entire system from the system’s outputs__. If a system is not observable, this means that the current values of some of its state variables cannot be determined through output [sensors](https://en.wikipedia.org/w/index.php?title=Sensor&utm_source=thenewstack&utm_medium=website&utm_campaign=platform).” [^1]

Observability is a term borrowed from control systems engineering, in tech - the term has been shorted to o11y as well. 

Observability means that we can understand the behavior of the system based on it's outputs, and how it is behaving, and it [[202102251433 RW-R - o11y goes beyond metrics|goes beyond metrics]]

As we continue to blow up the monolith, and move towards distributed systems, Observability is becoming of increased importance so we can understand what is going on.

Why?

> [[202102260754 RW-R  The complexity of high Cardinality and debugging|When we blew up the monolith]], we lost the ability to step through our code with a debugger: it now hops the network.  Our tools are still coming to grips with this seismic shift. [^1]

[^1]: @majorsObservability3YearRetrospective2019