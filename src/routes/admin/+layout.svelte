<script lang="ts">
  import { page } from '$app/stores'
  import { LayoutDashboard, PenTool, Lightbulb, GraduationCap, Settings, LogOut } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'

  let { children } = $props()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/toolz', label: 'Toolz', icon: PenTool },
    { href: '/admin/learn', label: 'Courses', icon: GraduationCap },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]
</script>

<div class="flex min-h-screen bg-gray-100 font-sans">
  <!-- Sidebar -->
  <aside class="fixed inset-y-0 z-50 hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
    <div class="flex h-16 items-center border-b border-gray-100 px-6">
      <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent"> MIP Admin </span>
    </div>

    <div class="flex-1 space-y-1 overflow-y-auto px-4 py-6">
      {#each links as link}
        {@const isActive = $page.url.pathname === link.href || ($page.url.pathname.startsWith(link.href) && link.href !== '/admin')}
        <a
          href={link.href}
          class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {isActive
            ? 'bg-purple-50 text-purple-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
        >
          <link.icon class="mr-3 h-5 w-5 {isActive ? 'text-purple-600' : 'text-gray-400'}" />
          {link.label}
        </a>
      {/each}
    </div>

    <div class="border-t border-gray-100 p-4">
      <Button variant="ghost" class="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" href="/">
        <LogOut class="mr-2 h-4 w-4" />
        Exit Admin
      </Button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex min-h-screen flex-1 flex-col md:pl-64">
    <header class="bg-opacity-80 sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 backdrop-blur-md">
      <h2 class="text-lg font-semibold text-gray-800">
        {links.find((l) => $page.url.pathname === l.href || ($page.url.pathname.startsWith(l.href) && l.href !== '/admin'))?.label || 'Dashboard'}
      </h2>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-500">Admin User</div>
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">A</div>
      </div>
    </header>

    <div class="p-8">
      {@render children()}
    </div>
  </main>
</div>
