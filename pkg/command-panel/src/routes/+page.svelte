<script lang="ts">
	import type { DefIndex, Call } from '$lib/defs.ts';
	import { CommandPanel, ReflectCommands } from '$lib';

	let toolCall = new ReflectCommands('https://substrate.home.arpa/tool-call/commands');
	async function suggest(input: string, commands: DefIndex) {
		if (!input) {
			return Object.entries(commands).map(([key, def]) => [key, def, {}]);
		}
		const r = await toolCall.run('suggest', { input, commands });
		return r.choices.flatMap((call: Call) => {
			const def = commands[call.command];
			if (!def) return [];
			return [[call.command, def, call.parameters]];
		});
	}

	let commands = {
		async run(name: string, params: Record<string, any>) {
			console.log('Running command', name, params);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return 'ok';
		},
		index: Promise.resolve({
			'assistant:add': {
				description: 'Add an assistant to the session',
				parameters: {
					name: { description: "The assistant's name", name: 'name', type: 'string' },
					prompt_template: {
						description: 'Template for assistant prompts',
						name: 'prompt_template',
						type: 'string'
					}
				},
				returns: {
					success: {
						description: 'True if the assistant was added successfully',
						name: 'success',
						type: 'boolean'
					}
				}
			},
			'assistant:remove': {
				description: 'Remove an assistant from the session',
				parameters: {
					name: { description: "The assistant's name", name: 'name', type: 'string' }
				},
				returns: {
					success: {
						description: 'True if the assistant was removed successfully',
						name: 'success',
						type: 'boolean'
					}
				}
			},
			'workingset:add_url': {
				description: 'Add a URL to the working set',
				parameters: {
					key: {
						description:
							'Unique key for the URL. Lower case letters, numbers, and underscores allowed.',
						name: 'key',
						type: 'string'
					},
					url: {
						description:
							'URL to add to working set. Should be fully qualified with the URL scheme.',
						name: 'url',
						type: 'string'
					}
				},
				returns: {
					error: {
						description: 'Description of the error when success is false',
						name: 'error',
						type: 'string'
					},
					success: {
						description: 'True if the URL was added successfully',
						name: 'success',
						type: 'boolean'
					}
				}
			},
			'workingset:list': {
				description: 'List the URLs in the working set',
				returns: {
					urls: {
						description: 'List of URLs in the working set',
						name: 'urls',
						type: 'map[string]string'
					}
				}
			}
		})
	};
	let panel;
	$effect(() => {
		if (panel) {
			panel.commands = commands;
		}
	});
</script>

<section>
	<h1>Welcome to your library project</h1>

	<!-- <command-panel bind:this={panel}></command-panel> -->
	<CommandPanel {commands} />
</section>

<style>
	:global(body) {
		background: blue;
	}
</style>
