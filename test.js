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

const req = http.request(options, function (res) {
	const chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		const body = Buffer.concat(chunks);
		const rankings = JSON.parse(body).results.rankings
		//console.log(rankings[0])
		for (let i = 0; i < 49; i++) {
			console.log(`${i+1}: ${rankings[i].player_name}`);
		}
		

	});
});

req.end();
