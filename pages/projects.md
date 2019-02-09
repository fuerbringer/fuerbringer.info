# Projects
I occasionaly work on some programming projects on GitHub I find to be either
useful or interesting. Unfortunately they usually end up in the latter
category.

## Pathfinding algorithm comparator

As part of my secondary school project I've developed a web application that
compares a selected set of pathfinding algorithms against eachother in randomly
generated mazes. For statistical purposes it measures execution time,
iterations and path length of each algorithm for each run. The web application
is accessible [here](https://bma.fuerbringer.info/comparison) with its
accompanying thesis document and statistical analysis
[here](https://github.com/fuerbringer/bma/blob/master/thesis/bma.pdf) (in
german). The entirety of the [source code](https://github.com/fuerbringer/bma)
is freely available under the terms of the GNU Affero GPL v3.

![A screenshot of the pathfinding algorithm comparator](/res/bma_scrot.png)

## Image-based sorting algorithm visualized

Ever seen those videos where sorting algorithms are visualized either in bar
charts or similar graphical visualizations? I figured this concept would be
neat to apply using image data. The result is a very crude CoffeeScript
implementation of said idea. Only one sorting algorithms is implemented. That
ofcourse being bubble sort.

<video controls>
<source src="https://u.teknik.io/LTQ0V.mp4" type="video/mp4">
</video> 

The idea would ideally be reimplemented in a faster compiled language. The web
platform does not suit itself too well to this kind of application, though it
does make it easier for people to discover and demo it. Perhaps C with SDL2 would
be better tools for the job.

## Telegram bots

I programmed some trivial fetch'n'forward Telegram chat bots some time ago. 

### tldr-telegram

A front end to the very useful [tldr-pages](https://github.com/tldr-pages/tldr) for Telegram ([GitHub Repository](https://github.com/fuerbringer/tldr-telegram)).

![A screenshoft of an example query to tldr-telegram](https://raw.githubusercontent.com/fuerbringer/tldr-telegram/master/screenshot.png)

### Searxbot

A front end to the Searx meta search engine ([GitHub Repository](https://github.com/fuerbringer/searxbot)).

![A screenshot of an example query to searxbot.](https://raw.githubusercontent.com/fuerbringer/searxbot/master/usage.png)
