from typing import Any, List, Optional, Dict, Union
from typing_extensions import TypedDict, NotRequired, Literal


class EmbeddingUsage(TypedDict):
    prompt_tokens: int
    total_tokens: int


class EmbeddingData(TypedDict):
    index: int
    object: str
    embedding: List[float]


class Embedding(TypedDict):
    object: Literal["list"]
    model: str
    data: List[EmbeddingData]
    usage: EmbeddingUsage


class CompletionLogprobs(TypedDict):
    text_offset: List[int]
    token_logprobs: List[Optional[float]]
    tokens: List[str]
    top_logprobs: List[Optional[Dict[str, float]]]


class CompletionChoice(TypedDict):
    text: str
    index: int
    logprobs: Optional[CompletionLogprobs]
    finish_reason: Optional[str]


class CompletionUsage(TypedDict):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class CompletionChunk(TypedDict):
    id: str
    object: Literal["text_completion"]
    created: int
    model: str
    choices: List[CompletionChoice]


class Completion(TypedDict):
    id: str
    object: Literal["text_completion"]
    created: int
    model: str
    choices: List[CompletionChoice]
    usage: CompletionUsage

class FunctionCall(TypedDict):
    name: str
    arguments: str

class ChatCompletionMessage(TypedDict):
    role: Literal["assistant", "user", "system"]
    content: str
    user: NotRequired[str]

    function_call: NotRequired[FunctionCall]

class FunctionSchemaDefinition(TypedDict):
    type: Literal["object", "number", "integer", "string", "array", "null", "boolean"]
    description: NotRequired[str]
    enum: NotRequired[List[str]]
    properties: NotRequired[Dict[str, 'FunctionSchemaDefinition']]
    required: NotRequired[List[str]]
    items: NotRequired['FunctionSchemaDefinition']

class FunctionDefinition(TypedDict):
    name: str
    description: NotRequired[str]
    parameters: NotRequired[Union[FunctionSchemaDefinition, Dict[str, FunctionSchemaDefinition]]]

class ChatCompletionChoice(TypedDict):
    index: int
    message: ChatCompletionMessage
    finish_reason: NotRequired[Literal["stop", "length", "function_call"]]

class ChatCompletion(TypedDict):
    id: str
    object: Literal["chat.completion"]
    created: int
    model: str
    choices: List[ChatCompletionChoice]
    usage: CompletionUsage

class ChatCompletionChunkDeltaEmpty(TypedDict):
    pass

class ChatCompletionChunkDelta(TypedDict):
    role: NotRequired[Literal["assistant"]]
    content: NotRequired[str]


class ChatCompletionChunkChoice(TypedDict):
    index: int
    delta: Union[ChatCompletionChunkDelta, ChatCompletionChunkDeltaEmpty]
    finish_reason: NotRequired[Literal["stop", "length", "function_call"]]


class ChatCompletionChunk(TypedDict):
    id: str
    model: str
    object: Literal["chat.completion.chunk"]
    created: int
    choices: List[ChatCompletionChunkChoice]
