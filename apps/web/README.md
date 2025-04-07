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

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](../LICENSE) file for details.

<sub>Copyright © 2025 Arsen Shkrumelyak. All rights reserved.</sub>
