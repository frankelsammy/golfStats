function getUpcomingTournaments(tourneys, id) {
	return new Promise((resolve, reject) => {
		let playersSet = new Set();
		for (const player in tourneys) {
			playersSet.add(player)
		}


		const http = require("https");

		const options = {
			"method": "GET",
			"hostname": "golf-leaderboard-data.p.rapidapi.com",
			"port": null,
			"path": `/entry-list/${id}`,
			"headers": {
				"X-RapidAPI-Key": "cd2f78eee0msh57d5ae1e1810fa2p1d0880jsn872939440f2c",
				"X-RapidAPI-Host": "golf-leaderboard-data.p.rapidapi.com",
				"useQueryString": true
			}
		};

		const req = http.request(options, function (res) {
			const chunks = [];

			res.on("data", function (chunk) {
				chunks.push(chunk);
			});

			res.on("end", function () {
				const body = Buffer.concat(chunks);
				const name = JSON.parse(body).meta.title.replace('Golf Entry List - ', "");
				let entries = JSON.parse(body).results.entry_list;
				for (let i = 0; i < entries.length; i++) {
					if (playersSet.has(entries[i].last_name.toLowerCase())) {
						tourneys[entries[i].last_name.toLowerCase()].push(name)
					}

				}
				resolve(tourneys)
			});
		});
		
		req.end();
		

	})
}


module.exports = {getUpcomingTournaments};