---
tags: ["inbox/readwise-review/bookreview/b7976586/hl"]
---
%%
- meta
	- created: 2021-02-25
	- last updated: 2021-02-25
	- citation key: @majorsObservability3YearRetrospective2019
	- readwise highlight: https://readwise.io/bookreview/7976586?highlight=150132861
%%

> Metrics do not equal observability.

Metrics have dominated since the 80s with tools like snpm, rrtool, cacti, Ganglia, and Etsy [had a big influence when they said measure everything](https://codeascraft.com/2011/02/15/measure-anything-measure-everything)[^1] and statsd

More modern metrics tools have emerged like:
- SignalFX
- DataDog
- WaveFront 

Requests emit dozens events as they make our way through our systems, get tagged, aggregated and displayed, and as Charity says

> _Metrics are still the dominant way to understand how your infrastructure system as a whole is behaving_, and probably always will be. But don’t miss that note above about “lose granularity” — it’s important to keep in mind because we’ll get back to it; metrics do not equal observability. [^2]

We need to be able to Observe what is happening in our systems, if we are relying on aggregated logs that don't provide granularity - we are missing information that we need.

[^1]: @malpassMeasureAnythingMeasure2011
[^2]: @majorsObservability3YearRetrospective2019