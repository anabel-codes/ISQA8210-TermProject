# Photography and library sources

I selected real stock photographs for the public pages and the management login.
The light theme uses a sunny exterior. At the owner's request, the homepage now
uses an AI-expanded framing of that photograph, and the dark theme uses an
AI-edited night version of the owner's Kent Rebman twilight photograph.
These show different properties. I have not presented
them as CK listings or as photographs of Omaha neighborhoods.

| Photograph | Photographer and original | Local files in static/img/estates/ |
| --- | --- | --- |
| Sunny red house | [Zac Gudakov on Unsplash](https://unsplash.com/photos/wwqZ8CM21gg) | day.webp, day-small.webp, neighborhood-day.webp, neighborhood-day-small.webp |
| Sunny red house, AI-expanded banner | Zac Gudakov source above | day-banner-wide.webp, day-banner-wide-small.webp |
| Neighborhood, AI-edited from twilight to night | [Kent Rebman on Unsplash](https://unsplash.com/photos/Hau9TnHS130), file supplied by the owner | night-kent.webp, night-kent-small.webp |
| Illuminated house at night | [Ryan Liu on Unsplash](https://unsplash.com/photos/u3XgNv37qC0) | night.webp, night-small.webp |
| Estate in the evening | [Marco Bianchetti on Unsplash](https://unsplash.com/photos/28RpzhHlLQ0) | neighborhood-night.webp, neighborhood-night-small.webp |

I downloaded the original Zac Gudakov, Ryan Liu and Marco Bianchetti photographs under the [Unsplash License](https://unsplash.com/license),
checked on November 21, 2026. I resized and compressed them to WebP for local
delivery. The browser crops them to fit their containers. Ryan Liu and Marco
Bianchetti's files are retained from the previous version; the current night
slots use the Kent Rebman edit. I preserved the original downloaded file on the
owner's machine. I used the built-in image editing tool for the two new variants,
then exported WebP copies. The public credits identify both AI edits.

The public footer links to `/photo-credits/`. Missing listing photos are labeled
as stock. An existing uploaded property photo takes precedence over that fallback.
Photo uploads remain a later blueprint story.

## Confirmation library

I vendored [SweetAlert2](https://github.com/sweetalert2/sweetalert2) version
11.26.25 from its pinned npm distribution through jsDelivr. The JavaScript and
stylesheet are in `static/vendor/`, with the MIT license in
`static/vendor/sweetalert2.LICENSE`. I applied CK's existing light and dark theme
colors to its dialogs. The site serves this library locally.
