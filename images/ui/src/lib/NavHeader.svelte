<script>
  import { getContext } from 'svelte'
  import { urls }from '$lib/activities'

	const user$ = getContext('user')
</script>

<nav class="border-b border-gray-200 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 justify-between">
      <div class="flex">
        <slot />         
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center whitespace-nowrap">
        <div class="relative ml-3">
          <div>
            <a href="{urls.ui.user({user: $user$})}" class="text-gray-500 max-w-5 text-base font-medium text-gray-800">{$user$}</a>
          </div>
        </div>
        <div class="relative ml-3">
          <slot name="menu"></slot>
        </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <div class="sm:hidden" id="mobile-menu">
    <div class="border-t border-gray-200 pt-4 pb-3">
      <div class="flex items-center px-4">
        <div class="flex-shrink-0">
        </div>
        <div class="ml-3">


          <!-- <span class="text-gray-500">Hi,</span> <input style="width: {$user$.length + 2}ex" class="max-w-5 text-base font-medium text-gray-800" bind:value={$user$}/> -->

          <a href="{urls.ui.user({user: $user$})}" class="text-gray-500 max-w-5 text-base font-medium text-gray-800">{$user$}</a>
        </div>
      </div>
    </div>
  </div>
</nav>
