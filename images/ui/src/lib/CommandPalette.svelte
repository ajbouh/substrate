<script lang="ts">
	import { goto } from '$app/navigation'
  import type { MaybePromise } from '@sveltejs/kit/types/private';
	import { createCombobox, createDialog } from 'svelte-headlessui'
	import Transition from 'svelte-transition'
	import type { Command } from '$lib/activities'

	export let commands: Command[] = []

	const dialog = createDialog({ label: 'Command Palette' })

	const combobox = createCombobox({ label: 'Actions', active: 0 })

	let itemElements: HTMLElement[] = []

	function onSelect(e: Event) {
		const detail = (e as CustomEvent).detail
		if (!detail) {
			return
		}
		const {selected: i} = detail
		const element = itemElements[i]
		element && element.click()
		// console.log('select', element, itemElements, i, e)
		reset()
		close()
	}

	function capitalize(s: string): string {
		if (s.length === 0) {
			return s
		}

		const ch = s[0]
		const up = ch.toUpperCase()
		if (ch === up) {
			return s
		}

		return up + s.slice(1)
	}

	console.log({ '$combobox.filter': $combobox.filter, '$combobox.selected': $combobox.selected })

	$: filtered = $combobox.filter
		? commands.filter(command => command.label.toLowerCase().replace(/\s+/g, '').includes($combobox.filter.toLowerCase().replace(/\s+/g, '')))
		: commands

	let input: HTMLElement

	export let context: string | undefined = undefined

	let prefix: string = ''
	let conjunction: string = ' and '
	$: prefixWithConjunction = prefix ? prefix + conjunction : prefix

	export async function open(commandSet: MaybePromise<{context?: string; commands: Command[]}>) {
		console.log('open', commandSet)
		const {context: ctx, commands: c} = await commandSet
		commands = c
		context = ctx
		combobox.open()
		dialog.open()
	}

	export function close() {
		input.value = ''
		prefix = ''
		return dialog.close()
	}

	export function reset() {
		input.value = ''
		prefix = ''
		return combobox.reset()
	}
</script>

<div class="flex w-full flex-col items-center justify-center">
	<div class="relative z-10">
		<Transition
			show={$dialog.expanded}
			on:after-enter={() => input.focus()}
		>
			<Transition
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" on:click={close} />
			</Transition>

			<div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
					<Transition
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
						on:after-leave={() => reset()}
					>
						<div class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all" use:dialog.modal>
							<div>
								{#if context}
									<div class="px-4 pt-4">
										<span class="inline-flex items-center rounded-sm bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">{context}</span>
									</div>
								{/if}
	
								<div class="relative">
									<!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-900 text-opacity-40">
										<path fill-rule="evenodd" d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
										<path fill-rule="evenodd" d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
									</svg> -->
									<input
										use:combobox.input
										bind:this={input}
										on:select={onSelect}
										class="h-12 w-full border-0 bg-transparent pl-4 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:ring-0 sm:text-sm"
										placeholder="Enter command..."
										value={$combobox.selected != null && filtered[$combobox.selected] ? filtered[$combobox.selected].label : ''}
									/>
								</div>
							</div>
							<h2 class="bg-gray-100 py-1 px-4 text-xs uppercase font-medium text-gray-700">Actions</h2>
							<ul
								use:combobox.items
								class="max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto py-2 text-sm"
							>
								{#each filtered as value, i}
									{@const active = $combobox.active === i}
									<li
										class="flex cursor-default select-none px-4 py-2 {active ? 'bg-indigo-600 text-white' : 'text-gray-800'}"
										use:combobox.item={{value: i}}
									>
										{#if value.subcommands}
											<button
												bind:this={itemElements[i]}
												on:click={async () => {
													// TODO we should update context area to include chosen option
													console.log(value.subcommands)
													prefix = prefix + value.label
													input.value = prefix
													input.focus()
													commands = value.subcommands
												}}
												class="cursor-default flex flex-auto text-left">
												<!-- <span class="w-5 h-5 flex-none {active ? 'bg-white' : 'bg-gray-600'}" style="-webkit-mask-image: url('{value.image}'); -webkit-mask-size: cover;">&nbsp;</span> -->
												<span class="flex-none font-medium truncate">{capitalize(prefixWithConjunction)}</span>&nbsp;<span class="flex-auto truncate">{prefixWithConjunction ? value.label : capitalize(value.label)}</span>

												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-none w-5 h-5">
													<path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
												</svg>
											</button>
										{:else if value.request}
											{@const request = value.request}
											{#if request.href}
												{@const href = request.href}
												{#if typeof href === 'string'}
													<a
														bind:this={itemElements[i]}
														data-sveltekit-preload-data="tap" 
														href={href}
														class="cursor-default flex flex-auto">
														<!-- <span class="w-5 h-5 flex-none {active ? 'bg-white' : 'bg-gray-600'}" style="-webkit-mask-image: url('{value.image}'); -webkit-mask-size: cover;">&nbsp;</span> -->
														<span class="flex-none font-medium truncate">{capitalize(prefixWithConjunction)}</span>&nbsp;<span class="flex-auto truncate">{prefixWithConjunction ? value.label : capitalize(value.label)}</span>
													</a>
												{:else}
													<button
														bind:this={itemElements[i]}
														on:click={async () =>  goto(await href())}
														class="cursor-default flex flex-auto text-left">
														<!-- <span class="w-5 h-5 flex-none {active ? 'bg-white' : 'bg-gray-600'}" style="-webkit-mask-image: url('{value.image}'); -webkit-mask-size: cover;">&nbsp;</span> -->
														<span class="flex-none font-medium truncate">{capitalize(prefixWithConjunction)}</span>&nbsp;<span class="flex-auto truncate">{prefixWithConjunction ? value.label : capitalize(value.label)}</span>
													</button>
												{/if}
											{:else}
												<div bind:this={itemElements[i]} class="flex flex-auto">
													<!-- <span class="w-5 h-5 flex-none {active ? 'bg-white' : 'bg-gray-600'}" style="-webkit-mask-image: url('{value.image}'); -webkit-mask-size: cover;">&nbsp;</span> -->
													<span class="flex-auto truncate">{prefixWithConjunction ? value.label : capitalize(value.label)}</span>
												</div>
											{/if}
										{/if}
									</li>
								{:else}
                  <div class="py-14 px-2 text-center sm:px-14">
                    <p class="mt-4 text-sm text-gray-900">No commands found using that search term.</p>
                  </div>
								{/each}
							</ul>
						</div>
					</Transition>
				</div>
		</Transition>
	</div>
</div>
