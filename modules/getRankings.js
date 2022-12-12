
function getRankingsProm() {
	let prom = new Promise((resolve, reject) => {
		const http = require("https");
		const options = {
			"method": "GET",
			"hostname": "golf-leaderboard-data.p.rapidapi.com",
			"port": null,
			"path": "/world-rankings",
			"headers": {
				"X-RapidAPI-Key": "cd2f78eee0msh57d5ae1e1810fa2p1d0880jsn872939440f2c",
				"X-RapidAPI-Host": "golf-leaderboard-data.p.rapidapi.com",
				"useQueryString": true
			}
		};
		
			let PGA_RANKINGS = []
			const req = http.request(options, function (res) {
				
				const chunks = [];

				res.on("data", function (chunk) {
					chunks.push(chunk);
				});

				res.on("end", function () {
					const body = Buffer.concat(chunks);
					const rankings = JSON.parse(body).results.rankings
					for (let i = 0; i < 50; i++) {
						let player = {
							name: rankings[i].player_name,
							rank : rankings[i].position,
							points: rankings[i].total_points
						}
						PGA_RANKINGS.push(player)
					}
					resolve(PGA_RANKINGS);
					
					
				});
			});
			
			

			req.end();
			
		});

		
	

		return prom;
	}
function makeRankingsTable(rankings) {
	let res = "<table border='1'><tr><th>Position</th><th>Name</th><th>Total Points</th></tr>"
	rankings.forEach(player => {
		res += `<tr><td>${player.rank}</td><td>${player.name}</td><td>${player.points}</td></tr>`;
	})
	res += "</table>";
	return res;


}
module.exports = {getRankingsProm, makeRankingsTable};





