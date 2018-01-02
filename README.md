# WebVR for R

## Installing

I'm not on CRAN yet (there are some licensing things I'll have to finangle to do so)

Do this instead:

```{r}
# install.packages('devtools') # if you haven't already
devtools::install_github('scottmmjackson/webvrr')
```

## Using

Functionality is a little thin at the moment. Here's what you can do:

```{r}
library(webvrr)

## Wireframe scene
webvrr()

## Custom scene
webvrr(sphere = 'https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg')

## Custom scene as base64
library(base64enc)
library(ggplot2)
data("diamonds")
f <- tempfile()
png(f, width = 5000, height = 2500) # 2:1 is a good ratio for sphere views.
ggplot(diamonds, aes(x = carat, y = price)) + geom_point()
dev.off()
data <- base64encode(f)
sphere <- paste0("data:image/png;base64,", data)
webvrr(sphere = sphere)
```

The last custom scene can be seen [here](https://scottmmjackson.github.io/webvrr/ggplot.html)

The starting scene right now is just a wireframe sphere:

![a wireframe sphere](http://i.imgur.com/NMWRlLw.png)

A fun thing to do is go onto [flickr and search for "equirectangular"](https://www.flickr.com/search/?text=equirectangular). Be sure to credit
people who release their work under CC Attribution!

## Roadmap

My vision isn't really to implement all of the WebGL API in htmlwidgets. That
could be a cool project, and if someone would like to undertake that,
I would be more than happy to rewrite the API for this project using that.

Instead my vision is really more of providing a few simple starting scenes
and allowing people to build up data displays and interactivity. This is
really meant to be a "data-science-oriented" package and not a
general-purpose solution for like, writing a video game in R.

- [ ] Support for different starting scenes
  - [x] Sphere
  - [ ] Stadium (cylinder w/ floor & ceiling)
  - [ ] Infinite plane (sphere w/ floor)
- [ ] Hooks for adding/removing scene elements
  - [ ] Hook for changing base scene
  - [ ] Hook for creating textured primitives
  - [ ] Hook for deleting elements
  - [ ] Hook for modifying elements
  - [ ] Hook for creating positional sound (?)
- [ ] Interactive/Shinyfied elements
  - [ ] Hover event for elements
    - e.g.: I look at a country in my globe view, it triggers some shiny action that queries a data set and draws an info panel or something
  - [ ] Click/Gamepad Press for elements