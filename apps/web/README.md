# Sotsial

Sotsial allows you to connect all your social media accounts and post to them from a single API.

## Usage

### Publishing

To publish, make this API call:

```json
{
	"targets": ["arsen"], // here you can target by: <connection_id>, tag (what we're doing here), <platform>:<username>
	"post": {
		"text": "<your caption here>",
		"media": [
			{
				"type": "image", // image, video
				"url": "<url to image or video>"
			}
		]
	}
}
```
