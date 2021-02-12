---
tags: [draft, storytime/storydump]
---

# My Last Teaching Engagement

- [[story dump]]

*note* - very rough draft of something I want to actually write about later.

Life before COVID19 seems so strange, but there was a client that I had created a JavaScript / React training course for. 

It's all open source, and still available online. 

> note: some examples may not run because the hosts they relied on are not up right now.

- [js-react-training - repo](https://github.com/e-schultz/ts-js-react-training/)
- [slide deck](https://rio-react-training.now.sh/decks/home/#0)


## The First Session

When I was asked if I could prepare the training, I thought we had some more material available. 

The initial syllabus for the course - was way too big, and covered too many topics. 

Also, after talking with the client, and their team lead for a bit on what some of the needs were for learning, and better understanding - they really wanted to cover Promises in depth.

And I did.... [[Over Indexing on Promises]], but I'll expand on that later. 

I didn't have much time to prepare for it, and remember working over time in the days leading upto it - and had produced some 90+ slide deck for a 4 day training course.

It was basically my infodump of JavaScript and React, put into MDX form - and it was a mess, it still went well - but it was a mess.

I didn't have a chance to really give the session a trial run, it made sense in my head, and when talking out loud to myself - but it's another thing in a classroom setting. 

The initial session I think was

- Monday - Weds, 9am - 5pm, with an office hour / optional day on Thurssday and Friday
- an hour lunch

As I went through the session, I started to realize things like

- Introducing concepts out of order
- Using features before I had explained them
- Not enough exercises 
- Not interactive enough
- Too much information on some things
- Too little information on other things
- Teaching things that they had no use for 
- Overwhelming newer developers, while boring more experienced ones
- Repeating the same information in different ways 

Despite all these faults, thankfully they asked me back for a second, third, and more times.

## Round Two

I was to teach a few cohorts, and there was a few weeks between each one,s o I had the opportunity to adjust it each time and improve. 

And, I learned from this.

I had taken notes from Gregs workshop earlier - and I was trying to find them, but wasn't able to - but thats when I ended up re-reading Teaching Tech Together.

I had fallen into a bit of the [expert blind spot](https://teachtogether.tech/en/index.html#g:expert-blind-spot)[^ebs]
[^ebs]: [[expert blind spot]]

and learned the dangers of: 

> #### [[The J Word]]
>
>Experts often betray their blind spot by using the word “just,” as in, “Oh, it’s easy, you just fire up a new virtual machine and then you just install these four patches to Ubuntu and then you just re-write your entire program in a pure functional language.” As we discuss in Chapter [10](https://teachtogether.tech/en/index.html#s:motivation), doing this signals that the speaker thinks the problem is trivial and that the person struggling with it must therefore be stupid, so don’t do this. [^tt]

> it is the tendency of experts to organize explanation according to the subject’s deep principles rather than being guided by what their learners already know. It can be overcome with training, but it is part of reason there is no correlation between how good someone is at doing research in an area and how good they are at teaching it [Mars2002](https://teachtogether.tech/en/index.html#ref-Mars2002) [^tt]

I needed to understand the mental model of the class, build [concept maps](https://teachtogether.tech/en/index.html#s:memory-concept-maps) to better understand the order to introduce things.

As the order got cleaned up, was able to also start dropping duplicated, and unnecessary content.

### Cutting Content

I had to consider what were the main goals of the course

- Learn enough JavaScript to start React
- Be able to work with React
- And hopefully teach them better JavaScript while writing React

The class was also a broad range of experience, and also level of interest in JavaScript - some were mostly backend .NET C# developers, and didn't care much for JavaScript

So, 

- Did they need to no Classes? a little bit
- Did they need to know about Class inheritance in JavaScript? nope - at least no in depth
- Did they need an entire 7.5 hour day dedicated to promises? nope

The goal was to teach enough JavaScript, to start being able to write React Components, and then write useful React components.

### Thinking in Public

The repo is public, the commit history is public - reading through the pull requests, you can follow how I'm thinking about things and adjusting to feedback.

One of the PR's when I was [updating the agenda early on](https://github.com/e-schultz/ts-js-react-training/pull/7/files)

![[Screen Shot 2021-02-11 at 9.51.14 PM.png]]

*laughs* with now.sh - I have immutable deploys of every change that you can still visit.

- Very Early Version - https://js-ts-react-training-git-renvrant-break-up-react.e-schultz.now.sh/#0
- One of The Most Recent - https://js-ts-react-training-5fwv3upqf.now.sh/decks/home/#0

## Learning from the Class

In the end, I ran several cohorts of 20-25 students each, and did one trip to Glasgow in February of last year to run it for their office out there. 

Each class was different, had a different dynamic, and I would also learn from where they had a hard time with the material. 

- Sometimes the exercise wasn't explained clearly
- Maybe a concept it needed hadn't been taught yet, or not clearly enough
- Maybe I needed to reinforce an idea 
- Maybe there was an incorrect mental model - and I had to work on improving that 
- I needed exercises where if they had a challenge - that it had [diagnostic power](https://teachtogether.tech/en/index.html#g:diagnostic-power)

If certain questions came up, I would try and incorporate into future lessons.

I was also learning how to teach better.

### The Brain Needs A Break

The second session followed a similar 'all day' schedule as the first time, and it was *exhausting*

Especially nearing the end of day 3 out of 4 - everyone's brain is mush, it's hard to absorb content.  

There was still too much focus on 'trying to convey as much information at once as possible', and not 'are they learning it'.

So, I proposed an alternative schedule 

- 9:30am - 3:00pm 
- 3:00pm - 5:00pm free time / office hours / optional
- one full day of drop in Q&A

This was to give people time to actually reflect and absorb what they had learned, ask questions, etc. 

Often students would stay for awhile after 3pm, trying exercises on their own, asking questions, and the students that were a bit more ahead - asking me questions about topics that I wouldn't be covering.

When it was a marathon from 9am-5pm - and then they were done for the day, there was no time to recharge. 

[^tt]: https://teachtogether.tech/en/
