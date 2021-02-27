---
tags: ["inbox/readwise-review/bookreview/b7976586/hl"]
---
%%
- meta
	- UID: 202102260758
	- title: [202102260754 The complexity of high Cardinality and debugging]
	- created: 2021-02-26 07:58
	- last updated: 2021-02-26
	- citation key:  @majorsObservability3YearRetrospective2019
	- readwise highlight: https://readwise.io/bookreview/7976586?highlight=150132866
	- obsidian url: [202102260758](obsidian://open?vault=readwise-review-inbox&file=inbox%2Fzets%2F202102260754%20RW-R%20%20The%20complexity%20of%20high%20Cardinality%20and%20debugging)
%%

### Reading Notes 

#### Questions 

##### Q: What is High Cardinality?

Cardinality is the number of unique items in a set, the more unique identifiers you have - the higher the cardinality.

Things like first name last name may seem like high cardinality, but first name / last names can repeat, lowering the ability to uniquely identify by that.

In engineering, we can have

- system IDs
- process IDs
- clusters
- events
- container
- build number
- etc

We have a vast array of information to identify something as unique, and unique beyond auto-generating a new ID.

Metrics based tools tend to only deal with low cardinality at scale, and simply being able to use a host name as an identifier is not enough.

For metrics based tools, we also need to know what we want to measure, what questions we want to ask ahead of time. While this is useful, metrics help measure known unknowns.

# Highlights 

###### HL: The Impact of high Cardinality

> This means  
> a) if you want to ask any new question after the fact, you can’t, and  
> b) cost goes up linearly with the number of questions you want to be able to ask(!).  
> 
> When we blew up the monolith into many services, we lost the ability to step through our code with a debugger: it now hops the network.   
> 
> Our tools are still coming to grips with this seismic shift [^1]



[^1]: @majorsObservability3YearRetrospective2019