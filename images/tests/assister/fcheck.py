import os
import yaml
from openai import OpenAI

client = OpenAI(
    api_key="sx-xxx",
    base_url=os.environ["URL"],
)

model = "airoboros-l2-13b-2.1.ggmlv3.Q2_K.bin"

funcyaml = {
  "doJob": {
    "description": "perform the job",
    "parameters": {}
  },
  "sum": {
    "description": "Adds two numbers together",
    "parameters": {
      "a": {
          "type": "number",
          "description": "the first number",
          "required": True
      },
      "b": {"type": "number", "description": "the second number", "required": True},
    },
  },
  "openURL": {
    "description": "opens a URL to a website",
    "parameters": {
      "url": {
        "type": "string",
        "description": "the URL to open",
        "required": True,
      }
    },
  },
  "setFullscreen": {
    "description": "make the browser fullscreen or not",
    "parameters": {
      "state": {
          "type": "boolean",
          "description": "whether to make full screen or not"
        }
    }
  },
  "addAssistant": {
    "description": "adds an assistant with a name and behavior prompt",
    "parameters": {
      "name": {
          "type": "string",
          "description": "name of the assistant"
        },
      "prompt": {
          "type": "string",
          "description": "full description of how the assistant should behave"
        },
    }
  }
}

def prompt(content):
  print("\"{}\"".format(content))
  print(client.chat.completions.create(
      model=model,
      messages=[
        {"role": "system", "content": "As an AI assistant, please select the single most suitable function and parameters from the list of available functions below, based on the user's input. Provide your response in JSON format."},
        {"role": "user", "content": "Input: "+content},
        {"role": "system", "content": "Available functions:\n"+yaml.dump(funcyaml)},
        {"role": "system", "content": "Response:\n"},
      ],
      temperature=0.1,
  ).choices[0].message.content)

if __name__ == "__main__":
  prompt("add an assistant named pat. it should employ the socratic method in conversation, but only when the user seems to be stumped.")
  prompt("open nintendo.com")
  prompt("add 1 and 200")
  prompt("make it fullscreen")
  prompt("make it not fullscreen")
  prompt("do the job")
