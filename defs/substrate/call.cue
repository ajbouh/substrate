package call

#HTTPRequest: {
	method !: string
	url !: {
		path: string | *"/"
		query ?: [string]: [...string]
	}
	headers ?: [string]: [...string]
	body ?: {...} | [...] | string | number | null
}

#HTTPResponse: {
	status: int
	headers: [string]: [...string]
	body ?: {...} | [...] | string | number | null
}

#HTTPCall: {
	request !: #HTTPRequest
	response !: #HTTPResponse
}
