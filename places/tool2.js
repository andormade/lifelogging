const YEAR = "2014";
const MONTH = "01";
const TARGET = `${YEAR}/places_${YEAR}_${MONTH}.json`;
const CLIENT_ID = "";
const CLIENT_SECRET = "";

const request = require("request");
const cachedRequest = require("cached-request")(request);
const checkins = require("./" + TARGET);
const fs = require("fs");
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

cachedRequest.setCacheDirectory("./.cache");

async function getDetails(original) {
	return new Promise((resolve, reject) => {
		const { id } = original;
		const url = `https://api.foursquare.com/v2/venues/${id}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20200726`;
		cachedRequest({ url, json: true, ttl: Infinity }, function (
			error,
			response,
			body
		) {
			if (error) {
				return reject();
			}

			const {
				address,
				lat,
				lng,
				postalCode,
				city,
				country,
			} = body.response.venue.location;
			const categories = body.response.venue.categories.map(
				({ name }) => name
			);
			const primaryCategory = body.response.venue.categories.find(
				({ isPrimary }) => isPrimary
			);

			resolve({
				...original,
				lat,
				lng,
				address,
				postalCode,
				city,
				country,
				categories,
				primaryCategory,
			});
		});
	});
}

const newCheckins = [];

(async function () {
	for (var i = 0; i < checkins.length; i++) {
		await delay(500); // The free Foursquare API only allows two request per sec
		const details = await getDetails(checkins[i]);
		newCheckins.push(details);
		console.log(details);
	}

	fs.writeFileSync(
		"./places/" + TARGET,
		JSON.stringify(newCheckins, null, "	")
	);
})();
