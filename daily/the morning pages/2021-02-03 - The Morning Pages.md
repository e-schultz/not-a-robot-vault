# 2021-02-03 - [[The Morning Pages]]

- start: 07:34am
- end:  08:51am

## [[Good Morning Evan, how are you doing this morning]]? [^1]

[^1]: [[The Morning Pages Prompts#^ba5681]]

Feeling pretty good this morning - slowly building up my morning routine again, and getting myself setup for a smoother morning.

- Was up well before my alarm - took a long lasting one of my ADHD meds, and then napped for a bit longer
- Woke up just before my alarm - made coffee, fed the cats, puttered around a bit, had coffee
- Killed a bit of time on twitter as my brain got booting up
- and now, done the shift from tweeting in bed to standing at my desk 

## Re-establishing my morning routines

![[2102030805 - Re-establishing my morning routines]]

### Self Care Anchors 

![[2102030814 - Self Care Anchors]]


## Sometimes a good mood can be a warning sign

![[2102030805 - Sometimes a good mood can be a warning sign]]


## Bah - Distracted by CSS

While [[switching from RoamResearch to Obsidian]]  - one of the things I miss is how smoothly having block refs/block-embeds work in Roam. 

When I want to display a block / file inline in Obsidian - the default display of it I don't like that much

For example, if I am embedding a section from a file - I want to have a header in this file to help with the table of contents, but I don't want to see the header of the embedded file when it's embedded, as it looks like this:

![[self care anchors Screen Shot 2021-02-03 at 8.46.16 AM.png]]

On the upside - you can customize the CSS of Obsidian quite a bit, and there is pretty good theme support.

I was trying to use some CSS examples from this [collection of obsidian CSS snippets](https://github.com/Dmitriy-Shulha/obsidian-css-snippets/blob/master/Snippets/Embeds.md)

```css
/* Hide all H1 in transclusions .... */
div[src*="#"].internal-embed .markdown-embed-content>.markdown-preview-view>div.markdown-preview-sizer>div.markdown-preview-section > h1,
div[src*="#"].internal-embed .markdown-embed-content>.markdown-preview-view>div.markdown-preview-sizer>div.markdown-preview-section > h2,
div[src*="#"].internal-embed .markdown-embed-content>.markdown-preview-view>div.markdown-preview-sizer>div.markdown-preview-section > h3,
div[src*="#"].internal-embed .markdown-embed-content>.markdown-preview-view>div.markdown-preview-sizer>div.markdown-preview-section > h4,
div[src*="#"].internal-embed .markdown-embed-content>.markdown-preview-view>div.markdown-preview-sizer>div.markdown-preview-section > h5,
div[src*="#"].internal-embed .markdown-embed-content>.markdown-preview-view>div.markdown-preview-sizer>div.markdown-preview-section > h6 {
  display:none;
}
```

But looks like the DOM structure has changed a bit, and it wasn't working quite how I wanted.

Trying this tweak for now:

```css
div[src].internal-embed .markdown-embed-content>.markdown-preview-view>div.markdown-preview-sizer > div:nth-child(2)  > h1 {
display:none;
}
```

as I only want to hide the first H1 in the embed, not all following ones, which results in this:

![[Screen Shot 2021-02-03 at 8.50.31 AM.png]]

Which is getting a little bit closer, but not quite. 

I'll fiddle latter - as I'd rather focus on writing than messing around with CSS all of the time.

Anyways, almost 9:00am - and need to do my final getting ready for work.