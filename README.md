# opencode-agent-template
A template for creating opencode agents

A template for creating opencode agents with assistance for installing dependencies. It will focus on running the llms locally for development purposes. Supports Mac Darwin, Ubuntu and WSL on Windows.

## Installing
To install run:
```
make install
```

Will install npm, the necessary dependencies to run typescript files and opencode globally on the target machines.

## Running
Running is simple, simply run:

```
opencode
```

## Different llms
First thing to do is to use `ctrl+p` to open the menu, select `Switch Model` and pick your desired model. Different models may need different authentication. In my org, we are instructed to use GPT-5-mini GitHub Copilot, which is authenticated via a github account.

## Opencode agents
Agent definitions are located in the `opencode.json` file, custom tools are in the `.opencode/tools` folder and the prompts for the agent behaviour are in the `opencode/prompts` folder.

When inside opencode, the `tab` key cycles through agents, so you can ask the agent that best fits your use case to action your request.

## Uninstall
To uninstall run:
```
make uninstall
```

Will remove npm, the dependencies and opencode.
