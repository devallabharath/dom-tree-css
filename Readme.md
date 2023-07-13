[![Logo](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=50&duration=2000&pause=4000&color=EB87F7&center=true&vCenter=true&width=1000&height=70&lines=Dom-Tree-CSS)](https://github.com/devallabharath/)
---

This code is written in JavaScript, using the Node.js platform. This tool creates html dom-tree in string format and then writes to an output file, with any existing content being appended to the tree content. This tool eliminates the extra peeking of the html file while writing the css files.

input `index.html`:
```html
<body>
	<main>
		<svg height="400" width="400">
			<circle r="192" cx="200" cy="200"
				fill="transparent" stroke="#000"
				stroke-width="5" transform="rotate(-90 200 200)"
			/>
		</svg>
		<div id="container">
			<input id="inp" class="input" type="text" value="30"/>
			<button class="start">Start</button>
			<button class="pause">Pause</button>
		</div>
	</main>
	<section></section>
	<script type="module" src="index.js"></script>
</body>
```

output `index.css`:
```css
/* Dom Tree: test.html
body
	main
		svg
			circle
		div, #container
			input, #inp, .input
			button, .start
			button, .pause
	section
*/
```

### Usage:
---
```sh
> node index.js -i inputFile -o outputFile
```

`inputFile` : _[filepath]_
- File must exist.
- Must be a valid html file.

`outputFile` : _[filepath]_
- File may or may not exist. This tool creates the file if not.
- Any file. But recommended css file.
