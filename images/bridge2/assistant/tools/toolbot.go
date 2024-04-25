package tools

type ToolAgent struct {
	// this is almost the same as the assistant, but
	// * it will use a "tool" prompt template
	// * maybe system prompt should be canned for these?
	// * output should be parsed to generate a tool event

	// Flow:
	// 1) send prompt for completion
	// 2) parse for proposed tool call format (write this as an event)
	// (both yes or no to call something)
	// 3) send tool call to handler (automatic, or manual?)
	// 4) store tool response (as event)
	// 5) pass response to completion again to get chat output
}

// linus assistant - tool call to "change parameter" with other parameters curried

var example = Definition{
	Type: "function",
	Function: Func{
		Name: "get_stock_fundamentals",
		Description: `get_stock_fundamentals(symbol: str) -> dict
			Get fundamental data for a given stock symbol using yfinance API.

			Args:
				symbol (str): The stock symbol.

			Returns:
				dict: A dictionary containing fundamental data.`,
		Parameters: Params{
			Type: "object",
			Properties: map[string]Prop{
				"symbol": {Type: "string"},
			},
			Required: []string{"symbol"},
		},
	},
}

/*
{
	'type': 'function',
	'function': {
		'name': 'get_stock_fundamentals',
		'description': '
			get_stock_fundamentals(symbol: str) -> dict
			Get fundamental data for a given stock symbol using yfinance API.

			Args:
				symbol (str): The stock symbol.

			Returns:
				dict: A dictionary containing fundamental data.',
		'parameters': {
			'type': 'object',
			'properties': {
				'symbol': {'type': 'string'}
			},
			'required': ['symbol']
		}
	}
}
*/

/*
Define funcs:

<|im_start|>system
You are a function calling AI model. You are provided with function signatures within <tools></tools> XML tags. You may call one or more functions to assist with the user query. Don't make assumptions about what values to plug into functions. Here are the available tools: <tools> {'type': 'function', 'function': {'name': 'get_stock_fundamentals', 'description': 'get_stock_fundamentals(symbol: str) -> dict - Get fundamental data for a given stock symbol using yfinance API.\n\n    Args:\n    symbol (str): The stock symbol.\n\n    Returns:\n    dict: A dictionary containing fundamental data.', 'parameters': {'type': 'object', 'properties': {'symbol': {'type': 'string'}}, 'required': ['symbol']}}}  </tools> Use the following pydantic model json schema for each tool call you will make: {'title': 'FunctionCall', 'type': 'object', 'properties': {'arguments': {'title': 'Arguments', 'type': 'object'}, 'name': {'title': 'Name', 'type': 'string'}}, 'required': ['arguments', 'name']} For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:
<tool_call>
{'arguments': <args-dict>, 'name': <function-name>}
</tool_call><|im_end|>

User input:

<|im_start|>user
Fetch the stock fundamentals data for Tesla (TSLA)<|im_end|>

Tool params:

<|im_start|>assistant
<tool_call>
{'arguments': {'symbol': 'TSLA'}, 'name': 'get_stock_fundamentals'}
</tool_call><|im_end|>

Tool response:

<|im_start|>tool
<tool_response>
{"name": "get_stock_fundamentals", "content": {'symbol': 'TSLA', 'company_name': 'Tesla, Inc.', 'sector': 'Consumer Cyclical', 'industry': 'Auto Manufacturers', 'market_cap': 611384164352, 'pe_ratio': 49.604652, 'pb_ratio': 9.762013, 'dividend_yield': None, 'eps': 4.3, 'beta': 2.427, '52_week_high': 299.29, '52_week_low': 152.37}}
</tool_response>
<|im_end|>

Final output:

<|im_start|>assistant
The stock fundamentals data for Tesla (TSLA) are as follows:
- **Symbol**: TSLA
- **Company Name**: Tesla, Inc.
- **Sector**: Consumer Cyclical
- **Industry**: Auto Manufacturers
- **Market Capitalization**: $566,160,130,480
- **Forward Price-to-Earnings Ratio (PE Ratio)**: 42.73
- **Price-to-Book Ratio (PB Ratio)**: 9.04
- **Dividend Yield**: N/A
- **Trailing Earnings Per Share (EPS)**: $4.3
- **Beta Value of the Stock**: 2.42
- **52-Week High Price of the Stock**: $299.29
- **52-Week Low Price of the Stock**: $152.37

This information provides a snapshot of Tesla's financial position and performance based on the fundamental data obtained from the yfinance API. It shows that Tesla has a substantial market capitalization and a relatively high P/E and P/B ratio compared to other stocks in its industry. The company does not pay a dividend at the moment, which is reflected by a 'Dividend Yield' of 'None'. The Beta value indicates that Tesla's stock has a moderate level of volatility relative to the market. The 52-week high and low prices give an idea of the stock's range over the past year. This data can be useful when assessing investment opportunities and making investment decisions.<|im_end|>

*/
