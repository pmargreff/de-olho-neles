var pie = new d3pie("pie", {
	header: {
		title: {
			text: "A very simple example pie"
		}
	},
	data: {
		content: [
			{ label: "JavaScript", value: 264131 },
			{ label: "Ruby", value: 218812 },
			{ label: "Java", value: 157618},
		]
	}
});
