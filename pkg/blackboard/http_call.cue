package http_call

#Request: {
	method !: string
	url !: {
		path: string | *"/"
		query ?: [string]: [...string]
	}
	headers ?: [string]: [...string]
	body ?: {...} | [...] | string | number | null
}

#Response: {
	status: int
	headers: [string]: [...string]
	body ?: {...} | [...] | string | number | null
}

// #Recursion: {
// 	recurse !: #Call
// 	yield: response: #Response
// }

// #BranchingCall: {
// 	request !: #Request
// 	branches !: [#Branch, ...#Branch]
// }

#DirectCall: {
	request !: #Request
	response !: #Response
}

// #Call: #BranchingCall | #DirectCall
#Call: #DirectCall
