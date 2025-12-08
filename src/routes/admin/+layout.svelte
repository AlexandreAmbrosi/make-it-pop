<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutDashboard, PenTool, Lightbulb, GraduationCap, Settings, LogOut } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  let { children } = $props();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/toolz', label: 'Toolz', icon: PenTool },
    { href: '/admin/inspird', label: 'Inspirations', icon: Lightbulb },
    { href: '/admin/learn', label: 'Courses', icon: GraduationCap },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];
</script>

<div class="flex min-h-screen bg-gray-100 font-sans">
  <!-- Sidebar -->
  <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 z-50">
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        MIP Admin
      </span>
    </div>

    <div class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
      {#each links as link}
        {@const isActive = $page.url.pathname === link.href || ($page.url.pathname.startsWith(link.href) && link.href !== '/admin')}
        <a 
          href={link.href}
          class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
        >
          <link.icon class="w-5 h-5 mr-3 {isActive ? 'text-purple-600' : 'text-gray-400'}" />
          {link.label}
        </a>
      {/each}
    </div>

    <div class="p-4 border-t border-gray-100">
      <Button variant="ghost" class="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" href="/">
        <LogOut class="w-4 h-4 mr-2" />
        Exit Admin
      </Button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 md:pl-64 flex flex-col min-h-screen">
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 bg-opacity-80 backdrop-blur-md">
      <h2 class="text-lg font-semibold text-gray-800">
        {links.find(l => $page.url.pathname === l.href || ($page.url.pathname.startsWith(l.href) && l.href !== '/admin'))?.label || 'Dashboard'}
      </h2>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-500">Admin User</div>
        <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
            A
        </div>
      </div>
    </header>

    <div class="p-8">
      {@render children()}
    </div>
  </main>
</div>
