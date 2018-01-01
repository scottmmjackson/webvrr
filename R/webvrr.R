#' Create a WebVR widget
#'
#' This function creates a WebVR widget using \pkg{htmlwidgets}.
#' It should work out of the box with RMarkdown, Shiny, or as a standalone call.
#' Note that the rendering device must support the WebVR spec or it will fail.
#'
#' @param width The width of the viewport prior to entering vr mode
#' @param height The height of the viewport prior to entering vr mode
#' @param sphere Either a url or a base64 encoded `src` to be drawn on the sphere
#'
#' @examples
#' webvrr(sphere =
#' 'https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg'
#' )
#'
#' @import htmlwidgets
#'
#' @export
webvrr <- function(
  width = NULL,
  height = NULL,
  sphere = NULL
) {
  htmlwidgets::createWidget(
    name = "webvrr",
    x = list(
      sphere = sphere
    ),
    width = width,
    height = height
  )
}
