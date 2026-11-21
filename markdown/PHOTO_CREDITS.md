# Photography and library sources

I selected real stock photographs for the public pages and the management login.
The light theme uses a sunny exterior. The dark theme uses photographs taken at
night or in the evening. These show different properties. I have not presented
them as CK listings or as photographs of Omaha neighborhoods.

| Photograph | Photographer and original | Local files in static/img/estates/ |
| --- | --- | --- |
| Sunny red house | [Zac Gudakov on Unsplash](https://unsplash.com/photos/wwqZ8CM21gg) | day.webp, day-small.webp, neighborhood-day.webp, neighborhood-day-small.webp |
| Illuminated house at night | [Ryan Liu on Unsplash](https://unsplash.com/photos/u3XgNv37qC0) | night.webp, night-small.webp |
| Estate in the evening | [Marco Bianchetti on Unsplash](https://unsplash.com/photos/28RpzhHlLQ0) | neighborhood-night.webp, neighborhood-night-small.webp |

I downloaded these photographs under the [Unsplash License](https://unsplash.com/license),
checked on November 21, 2026. I resized and compressed them to WebP for local
delivery. The browser crops them to fit their containers. I did not generate a
night view by recoloring a daytime photograph.

The public footer links to `/photo-credits/`. Missing listing photos are labeled
as stock. An existing uploaded property photo takes precedence over that fallback.
Photo uploads remain a later blueprint story.

## Confirmation library

I vendored [SweetAlert2](https://github.com/sweetalert2/sweetalert2) version
11.26.25 from its pinned npm distribution through jsDelivr. The JavaScript and
stylesheet are in `static/vendor/`, with the MIT license in
`static/vendor/sweetalert2.LICENSE`. I applied CK's existing light and dark theme
colors to its dialogs. The site serves this library locally.
