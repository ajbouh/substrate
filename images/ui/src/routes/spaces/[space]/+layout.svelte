<script>
  import { getContext } from 'svelte'
  import { urls } from '$lib/activities'
  import NavHeader from '$lib/NavHeader.svelte'

  const user$ = getContext('user')
  export let data
  $: space = {
    space: data.space,
    memberships: data.memberships,
  }
</script>

<div class="min-h-screen w-full flex-col flex">
	<NavHeader>
    <nav class="flex items-center" aria-label="Breadcrumb">
        <div class="flex mr-2">
          <a href="{urls.ui.home()}" class="text-4xl text-gray-600 hover:text-gray-700">
            🦋
            <!-- Heroicon name: mini/globe-alt -->
            <!-- <svg class="h-7 w-7 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M16.555 5.412a8.028 8.028 0 00-3.503-2.81 14.899 14.899 0 011.663 4.472 8.547 8.547 0 001.84-1.662zM13.326 7.825a13.43 13.43 0 00-2.413-5.773 8.087 8.087 0 00-1.826 0 13.43 13.43 0 00-2.413 5.773A8.473 8.473 0 0010 8.5c1.18 0 2.304-.24 3.326-.675zM6.514 9.376A9.98 9.98 0 0010 10c1.226 0 2.4-.22 3.486-.624a13.54 13.54 0 01-.351 3.759A13.54 13.54 0 0110 13.5c-1.079 0-2.128-.127-3.134-.366a13.538 13.538 0 01-.352-3.758zM5.285 7.074a14.9 14.9 0 011.663-4.471 8.028 8.028 0 00-3.503 2.81c.529.638 1.149 1.199 1.84 1.66zM17.334 6.798a7.973 7.973 0 01.614 4.115 13.47 13.47 0 01-3.178 1.72 15.093 15.093 0 00.174-3.939 10.043 10.043 0 002.39-1.896zM2.666 6.798a10.042 10.042 0 002.39 1.896 15.196 15.196 0 00.174 3.94 13.472 13.472 0 01-3.178-1.72 7.973 7.973 0 01.615-4.115zM10 15c.898 0 1.778-.079 2.633-.23a13.473 13.473 0 01-1.72 3.178 8.099 8.099 0 01-1.826 0 13.47 13.47 0 01-1.72-3.178c.855.151 1.735.23 2.633.23zM14.357 14.357a14.912 14.912 0 01-1.305 3.04 8.027 8.027 0 004.345-4.345c-.953.542-1.971.981-3.04 1.305zM6.948 17.397a8.027 8.027 0 01-4.345-4.345c.953.542 1.971.981 3.04 1.305a14.912 14.912 0 001.305 3.04z" />
            </svg> -->
          </a>
        </div>
        <div class="">
          <h2 class="text-xl font-medium leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
            <ol class="flex items-center space-x-2">
              {#if data.owner}
                <li>
                  <div class="flex items-center">
                    <!-- Heroicon name: mini/chevron-right -->
                    <!-- <svg class="h-7 w-7 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg> -->
                    <a href="{urls.ui.user({user: data.owner})}" class="ml-2 hover:text-gray-700">{data.owner}</a>
                  </div>
                </li>
              {/if}
              {#if data.space}
                <li>
                  <div class="flex items-center">
                    <!-- Heroicon name: mini/chevron-right -->
                    <span class="text-gray-600">/</span>
                    <a href="#" class="ml-2 hover:text-gray-700 truncate">{data.space}</a>
                  </div>
                </li>
              {/if}
            </ol>
          </h2>
          {#if data.forked_from}
            <div class="text-gray-500 text-xs ml-2 mt-0.5">Forked from&nbsp;<a class="font-medium" href="{urls.ui.space({space: data.forked_from})}">{data.forked_from}</a></div>
          {/if}
      </div>
    </nav>
  </NavHeader>
  <main class="flex flex-col flex-grow">
    <slot />
  </main>
</div>
