---
tags: [DRAFT,notarobot]
---

# My First Real Program

[I've had computers in my life for almost as long as I can remember](https://twitter.com/e_p82/status/1282076405824720896), like [look at how young I was](https://www.instagram.com/p/CA_kKspAkDf/)
![[Screen Shot 2021-01-28 at 8.08.39 PM.png]]

Anyways, one year my parents bought an expensive computer - an IBM Aptiva, and they were concerned that I was going to break it, so they hired me a computer tutor.

# The First Lesson

After the first lesson of going over the basics of Windows 3.1 - of which I already knew my way around DOS, was writing batch scripts, etc - it became obvious to him that I didn't need to learn how to use a computer, and on the next lesson - he came with a copy of [[Turbo Pascal]] , and started to teach me programming.

### BBS Systems

He also introduced me to the world of dial-up [[Builliten Board Systems]] , he ran one of his own, and I started to get involved in the local BBS scene.

One of the things that really attracted me to the BBS scene - was the message boards and forums. Sure, I enjoyed playing games like Legend of The Red Dragon, but being able to talk with people online was the part I enjoyed the most.

In grade school - I had a really bad stutter, so much so - that in grade 3, I had such a hard time reading outloud, that my teacher tried to put me into special education.

### Being able to communicate

Being able to talk through text - write things out, have threaded conversation - it felt like I could be the more friendly, helpful version of my self that I had a hard time being in the real world, where simply opening my mouth - or trying to, was invitation to be being bullied, shutdown and dismissed.

Having [[ADHD]], [[possibly autistic]], a speech impediment - talking was hard, and I was able to find my voice online.

I could take my time, compose my thoughts - edit them, and not have to worry about tripping over words, being teased, having people interrupt me, or see the look of discomfort on their face as I struggled to get a word out.

Eventually on my own BBS - I got rid of the board games, got rid of the w4rez downloads, and focused on

- the message board / forum
- information / files]

I had also recently gotten access to the internet, thanks Internet In A Box - and I would download things like the anarchists cookbook (obviously), zines like 2600, phreak.

I also liked collecting ANSI/ASCII art packs from groups like ACiD and iCE

## Digital Collector 

Basically, I liked to collect, curate and share the information and art that I liked,

and I liked having forums where people could talk. There were a few other BBS's that had the online games - and I did annoy a few users when I got rid of them, but I figured I wanted to focus on a different community.

Whenever I added a new text file to my forum - I'd usually make a point of reading it, and being able to basically do my own TL;DR summary of what it was about.

With my BBS though - I also had a habit of resetting it now and then - because I was wanting to try different software, or try something new - and I'd always go through the process of re-entering the files into the download section, and entering in the summary again.

## Annoying myself 

I got annoyed doing this, and figured I'd try and solve the problem with the bit of programming that I had been learning.

When a file was uploaded to the BBS - it could be run through a program, and get information from it - this was commonly used to unzip zipped files, and read the [file_id.diz](https://en.wikipedia.org/wiki/FILE_ID.DIZ) to auto-populate the description.

The first solution I thought of was:
- create a file_id.diz
- zip the text file with it

While that would have worked, it seemed really silly to me that I'd need to create a new file, zip it - especially a plain text file just to automate getting the description.

## Solving the probem 

So what I did, was in the text files after I read them, I'd leave a note like this

```
@file_id.diz@
Description / Summary of the file
@file_id.diz@

Rest of the text
```

Basically - adding tags at the top of the file.

I then wrote a program  that ran when a text file was uploaded to my BBS - it would look for the `@file_id.diz@` tag and auto-populate the description.

Looking back now - it seems like a simple problem, but at the time there was so many things I didn't know, and had to figure out how to answer

- how do I open a file
- how do I read each line
- how do I handle arguments since it's being called by the BBS
- how do I get the text between the opening and closing tags

But with minimal programming under my belt, a few examples left from my tutor - and some stuff from the [SWAG - Sourceware Archivle Group](http://www.retroarchive.org/swag/index.html) - it was reading a lot of code that did things similar to what I needed to do, some trial and error, going through API docs.

The real appeal though, was I knew what I wanted as the output result - the text between the tags, and then kept breaking it down into smaller chunks of problem that I needed to learn how to solve.

And - it actually did something useful for me, and made my life easier. 

The combination of finding my voice and a community on line, learning to build networks, collecting, curating and sharing information - and learning how to program is a real big influence on how / why I got into tech.
