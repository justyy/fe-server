exports.default = {
	'/adsdad/:id/:fu': function(id,fu) {
		console.log(id,fu)
	},
	'/test/:id/:ab': '/$id/llll/$ab',
	'/:ent_id/service/:xx': '/$version/index.html?id=$ent_id&xx=$xx'
}