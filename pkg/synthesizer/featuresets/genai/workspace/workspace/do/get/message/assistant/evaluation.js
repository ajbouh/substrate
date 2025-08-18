const HarmonyFormat = {
    /**
     * Parses a string in the OpenAI Harmony format into an array of message objects.
     * This method is robust and can handle complete, partial, or streaming message fragments.
     *
     * @param {string} text The raw Harmony-formatted string.
     * @returns {Array<Object>} An array of parsed message objects.
     * Each object has the structure:
     * {
     * role: string,
     * channel?: string,
     * recipient?: string,
     * contentType?: string,
     * content: string,
     * stopToken?: string
     * }
     */
    parse(text) {
        let normalizedText = text.trim();
        // If the text is a model response fragment that starts with a channel,
        // we normalize it by prepending the assumed <|start|>assistant part.
        if (normalizedText.startsWith('<|channel|>')) {
            normalizedText = '<|start|>assistant' + normalizedText;
        }

        const messages = [];
        // Split the text by the <|start|> token to process each message individually.
        // This is more robust for handling incomplete/streamed messages.
        const messageBlocks = normalizedText.split(/<\|start\|>/).filter(block => block.trim() !== '');

        for (const block of messageBlocks) {
            const separatorIndex = block.indexOf('<|message|>');
            // Skip malformed blocks that don't have the message separator.
            if (separatorIndex === -1) continue;

            const header = block.substring(0, separatorIndex).trim();
            let content = block.substring(separatorIndex + '<|message|>'.length).trim();
            
            const parsedMessage = this.parseHeader(header);
            
            // Check for and extract a stop token from the end of the content.
            const stopTokenRegex = /(<\|end\|>|<\|return\|>|<\|call\|>)$/;
            const stopTokenMatch = content.match(stopTokenRegex);
            
            if (stopTokenMatch) {
                parsedMessage.stopToken = stopTokenMatch[0];
                // Remove the stop token from the content string.
                content = content.replace(stopTokenRegex, '').trim();
            }

            parsedMessage.content = content;
            messages.push(parsedMessage);
        }

        return messages;
    },

    /**
     * Parses the header part of a Harmony message using a robust, iterative approach.
     *
     * @private
     * @param {string} headerString The header string (the part between <|start|> and <|message|>).
     * @returns {Object} An object containing parsed header information (role, channel, etc.).
     */
    parseHeader(headerString) {
        const result = {};

        const roleMatch = headerString.match(/^(\w+(\.\w+)?)/);
        if (roleMatch) {
        result.role = roleMatch[0];
        } else {
        // Fallback for the simplest case if regex fails.
        result.role = headerString.split(' ')[0];
        }

        const recipientMatch = headerString.match(/to=([\w.]+)/);
        if (recipientMatch) {
        result.recipient = recipientMatch[1];
        }

        const channelMatch = headerString.match(/<\|channel\|>(\w+)/);
        if (channelMatch) {
        result.channel = channelMatch[1];
        }
        
        // Handles content type like "json", with or without <|constrain|>.
        const contentTypeMatch = headerString.match(/(?:<\|constrain\|>)?\s*(json)/);
        if (contentTypeMatch) {
        result.contentType = contentTypeMatch[1];
        }
        
        return result;
    }
}

const taskFormat = {
    parse(text) {
        const result = [];
        const lines = text.trim().split('\n');
        let path = []; // A stack of {level, title} objects to track the current path

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = line.match(/^(#+)\s*(.*)/);

            if (match) {
                const level = match[1].length;
                const title = line.trim();

                // Adjust the path stack by removing deeper or same-level headings
                while (path.length > 0 && path[path.length - 1].level >= level) {
                    path.pop();
                }
                path.push({ level, title });

                // Find the content for the current heading, which ends at the next heading
                let contentEnd = i + 1;
                while (contentEnd < lines.length && !lines[contentEnd].startsWith('#')) {
                    contentEnd++;
                }
                
                // Check if the next heading is a child (deeper level)
                const nextHeadingLevel = contentEnd < lines.length ? lines[contentEnd].match(/^(#+)/)?.[1].length : 0;
                const isParent = nextHeadingLevel > level;

                // A section is a "leaf" if it's not a parent to other headings
                if (!isParent) {
                    const content = lines.slice(i + 1, contentEnd).join('\n').trim();
                    result.push([path.map(p => p.title), content]);
                }
            }
        }
        return result;
    },
    findPrompt(message) {
        const parsed = this.parse(message)
        if (!parsed.length) {
            return undefined
        }

        const [lastSelector] = parsed[parsed.length - 1]

        // if last selector is part of a task, grab the last N that overlap with it
        const taskIndex = lastSelector.findIndex(e => /^#+\s+Task/.test(e))
        if (taskIndex === -1) {
            return undefined
        }

        const taskPrefix = JSON.stringify(lastSelector.slice(0, taskIndex)).slice(0, -1)
        const sectionEntries = parsed
            .filter(([selector]) => JSON.stringify(selector).startsWith(taskPrefix))
            .map(([selector, value]) => [
                selector.slice(taskIndex+1).map(e => e.replace(/^#+\s+/, '')).toString(), // toString() isn't great here ... we should only be grabbing the top-level headings
                value
            ])
            .map(([key, content]) => {
                const jsonMatch = content.match(/^```json\n([\s\S]+)\n```$/);
                if (jsonMatch) {
                    try {
                        return [key, JSON.parse(jsonMatch[1])];
                    } catch (e) {
                    }
                }
                return [key, content];
            })

        const task = {sections: {}, depth: 3, ok: true}
        task.sections = Object.fromEntries(sectionEntries)
        task.initialSectionKeys = Object.keys(task.sections)
        task.inputs = task.sections["Inputs"] ?? task.sections["inputs"] ?? {}
        const source = task.sections["Source"] ?? task.sections["source"] ?? ""
        const codefenceMatch = source.match(/^```([^\n]*)\n([\s\S]+)\n```$/);
        if (codefenceMatch) {
            const [, info, code] = codefenceMatch
            task.code = code
            task.lang = info.split(' ')[0]
        } else {
            task.sections['Source Error'] = 'Source must be a nonempty javascript codefence'
            task.ok = false
        }

        task.depth = lastSelector[taskIndex].match(/^(#+)\s+/)[1].length
        return task
    },

    renderSections({taskDepth, sectionEntries}) {
        const prefix = '#'.repeat(taskDepth + 1) + ' '
        return sectionEntries.flatMap(([key, content]) =>
            typeof content === 'string'
                ? [prefix + key, content].join("\n")
                : typeof content === 'object'
                    ? [prefix + key, '```' + content.info, content.code, '```']
                    : [prefix + key, '```json', JSON.stringify(content), '```'])
    },

    renderResult(task) {
        const newSectionKeys = task.initialSectionKeys
            ? Object.keys(task.sections).filter(key => !task.initialSectionKeys.includes(key))
            : Object.keys(task.sections)
        return this.renderSections({
            taskDepth: task.depth,
            sectionEntries: newSectionKeys.map(key => [key, task.sections[key]]),
        })
    },

    renderPrompt({taskDepth, name, source, inputs}) {
        return [
            `${'#'.repeat(taskDepth)} Task ${name}`,
            ...this.renderSections({taskDepth: taskDepth, sectionEntries: [
                ...(source ? [['Source', source]] : []),
                ...(inputs ? [['Inputs', inputs]] : []),
            ]}),
        ]
    }
}

export default Object.assign(
    async ({unit: {source: content}}) => {
        let now = Date.now()
        let task
        let assistantMessage = ''
        console.log(now, 'message content', content)
        if (/<\|start\|>assistant/.test(content)) {
            const parsed = HarmonyFormat.parse(content)
            for (const m of parsed) {
                console.log(now, 'message harmony part', m)
                if (m.recipient?.startsWith('functions.')) {
                    try {
                        let code
                        let functionName = m.recipient.replace(/^functions\./, '')
                        let functionArgs = m.content
                        // hard coding all this is ... not great.
                        if (functionName === 'exec' || functionName === 'run' || functionName === 'execute') {
                            const parsedArgs = JSON.parse(functionArgs)
                            if (parsedArgs.code) {
                                code = parsedArgs.code
                            } else {
                                functionName = parsedArgs.name ?? parsedArgs.tool ?? parsedArgs.function
                                functionArgs = JSON.stringify(parsedArgs.arguments ?? parsedArgs.args)
                            }
                        }
                        if (!code && functionName) {
                            code = `${functionName}(${functionArgs})`
                        }
                        assistantMessage = taskFormat.renderPrompt({
                            taskDepth: 3,
                            name: '',
                            source: {info: 'javascript', code},
                        }).join("\n") + "\n"
                        task = taskFormat.findPrompt(assistantMessage);
                    } catch (err) {
                        console.warn('could not process harmony tool call', m, err)
                    }
                }
                if (m.channel === 'commentary' || m.channel === 'final') {
                    const channelTask = taskFormat.findPrompt(m.content);
                    console.log(now, 'message harmony channelTask', channelTask)
                    if (channelTask) {
                        task = channelTask
                    }
                }
                if (m.channel === 'final') {
                    assistantMessage += m.content + "\n"
                }
                if (task) {
                    break
                }
            }
        } else if (/<\/think>/.test(content)) {
            let reasoning;
            [reasoning, assistantMessage] = content.split(/<\/think>/);
            console.log(now, 'message think part', 'reasoning', reasoning)
            console.log(now, 'message think part', 'content', content)
        } else {
            console.log(now, 'message other part', 'content', content)
            assistantMessage = content
        }

        if (!task) {
            task = taskFormat.findPrompt(content);
        }

        return {
            trimmedAssistantMessage: assistantMessage,
            task,
            renderResult: (...o) => taskFormat.renderResult(...o),
        }
    },
    {
        renderPrompt: (...o) => taskFormat.renderPrompt(...o),
        renderResult: (...o) => taskFormat.renderResult(...o),
    }
)
