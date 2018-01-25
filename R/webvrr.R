#' Create a WebVR widget
#'
#' This function creates a WebVR widget using \pkg{htmlwidgets}.
#' It should work out of the box with RMarkdown, Shiny, or as a standalone call.
#' Note that the rendering device must support the WebVR spec or it will fail.
#'
#' @param width The width of the viewport prior to entering vr mode
#' @param height The height of the viewport prior to entering vr mode
#'
#' @import htmlwidgets
#'
#' @export
webvrr <- function(
  width = NULL,
  height = NULL
) {
  htmlwidgets::createWidget(
    name = "webvrr",
    x = list(
      calls = list()
    ),
    width = width,
    height = height
  )
}

#' Add a background to a WebVR widget.
#' For drawing a skybox sphere, use \code{\link{addInnerTexturedSphere}}
#'
#' @param vr A webvr widget. See \code{\link{webvrr}}
#' @param backgroundType one of "color", "texture", or "cube"
#' @param backgroundColor Hex or numeric color representation. Required if backgroundType is "color".
#'        The function call tolerates string and hexmode representations.
#' @param texture a string representing the texture in a base64 data URI or a URL. Required if
#'        backgroundType is "texture".
#' @param shouldRepeat should the texture repeat?
#' @param repeatX repeat density over X portion of mesh
#' @param repeatY repeat density over Y portion of mesh
#' @param cube a list of 6 strings representing base64 data URIs or URLs corresponding to a cube map.
#'        required if backgroundType is "cube".
#' @export
addBackground <- function(
  vr,
  backgroundType = c("color", "texture", "cube"),
  backgroundColor = NULL,
  texture = NULL,
  shouldRepeat = FALSE,
  repeatX = NULL,
  repeatY = NULL,
  cube = list()
) {
  if (backgroundType == "color") {
    if(is.character(backgroundColor)) backgroundColor <- as.hexmode(backgroundColor)
    stopifnot(is.numeric(backgroundColor))
    vr$x$background <- list(
      type = backgroundType,
      color = backgroundColor
    )
  } else if (backgroundType == "texture") {
    stopifnot(is.character(texture))
    if (shouldRepeat) {
      stopifnot(is.numeric(repeatX) && is.numeric(repeatY))
      vr$x$background <- list(
        type = backgroundType,
        texture = texture,
        `repeat` = list(
          repeatX = repeatX,
          repeatY = repeatY
        )
      )
    } else {
      vr$x$background <- list(
        type = backgroundType,
        texture = texture,
        `repeat` = FALSE
      )
    }
  } else if (backgroundType == "cube") {
      stopifnot(length(cube) == 6)
      vr$x$background <- list(
        type = backgroundType,
        cube = cube
      )
  } else {
    stop("Unknown backgroundType")
  }
  vr
}

#' Add an arbitrary object to the scene
#' Internal.
#'
#' @param vr a webvrr widget
#' @param call a specially crafted call object
addToScene <- function(
  vr,
  call = list()
) {
  vr$x$calls <- lapply(1:(length(vr$x$calls)+1), function(y) {
    if(y > length(vr$x$calls)) call
    else vr$x$calls[[y]]
  })
  vr
}

#' Puts the viewer in a big sphere with a texture painted on the inside.
#' See https://threejs.org/docs/#api/geometries/SphereGeometry
#'
#' @param vr a webvrr widget. See \code{\link{webvrr}}
#' @param texture a string representing a texture in base64 data URI format or a URL.
#'                if not provided, a wireframe will be used
#' @param repeat If false, do not repeat. Otherwise, should be a list in the following
#'               format: \code{list( repeatX = 32, repeatY = 32)}. Replace 32 with your
#'               preferred repeats.
#' @param radius sphere radius.
#' @param widthSegments how many width segments to draw
#' @param heightSegments how many height segments to draw
#' @export
addInnerTexturedSphere <- function(
  vr,
  texture = NULL,
  `repeat`= list(
    repeatX = 32,
    repeatY = 32
  ),
  radius = 5,
  widthSegments = 32,
  heightSegments = 32
) {
  if(`repeat` != FALSE) stopifnot(is.list(`repeat`))
  addToScene(vr, list(
    type = "innerTexturedSphere",
    texture = texture,
    `repeat` = `repeat`,
    radius = radius,
    widthSegments = widthSegments,
    heightSegments = heightSegments
  ))
}
