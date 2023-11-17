package chat_completion

#Message: {
    role !: string
    name ?: string
    content !: string
}

#Request: {
    max_tokens ?: number
    messages !: _ // [...#Message]
}

#FinishReason: "stop" | "length" | "function_call" | "content_filter" | "null"

#Choice: {
    index !: number
    message !: #Message
    finish_reason !: #FinishReason
}

#Response: {
	id ?:      string
	object ?:  string
	created ?: number
	model ?:   string
	choices ?: _ // [...#Choice]
}
