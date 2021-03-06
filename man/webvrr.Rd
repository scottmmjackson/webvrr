% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/webvrr.R
\name{webvrr}
\alias{webvrr}
\title{Create a WebVR widget}
\usage{
webvrr(width = NULL, height = NULL)
}
\arguments{
\item{width}{The width of the viewport prior to entering vr mode}

\item{height}{The height of the viewport prior to entering vr mode}
}
\description{
This function creates a WebVR widget using \pkg{htmlwidgets}.
It should work out of the box with RMarkdown, Shiny, or as a standalone call.
Note that the rendering device must support the WebVR spec or it will fail.
}
