# Mappette

Mappette is a project born to experiment on today's (2022) web technologies, applied on building a light webmapping library and a set of examples.

The goals of Mappette:

-   offering a **simple API** for mapping, by abstracting different mapping libraries own API, while leaving direct access to the mapping library itself
-   depending on a **minimal** set of well documented libraries; currently our runtime dependencies are:

    -   a mapping library ([OpenLayers](https://openlayers.org/) and [CesiumJS](https://cesium.com/) are supported)
    -   [proj4js](https://github.com/proj4js/proj4js)
    -   [Preact](https://preactjs.com/)

-   leveraging the **web platform** whenever possible, instead of adding new dependencies

## Download and test locally

```bash
git clone https://github.com/mbarto/mappette-viewer.git

cd mappette-viewer
npm install
npm run dev
```

Point your browser to http://localhost:3000

## Examples

-   a [MapStore](https://www.geosolutionsgroup.com/technologies/mapstore/) contexts viewer: [Link](https://mappette.infosia.it/)
-   a print composer for maps: [Link](https://mappette.infosia.it/print.html)

## Online Demo

https://mappette.infosia.it/

## Presentation given at FOSS4G 2022

-   [Slides](https://docs.google.com/presentation/d/1b_9ECRm42eOlklMM6aonloCMrSWwQsjLaAjCpwbaNUU/edit?usp=sharing)
