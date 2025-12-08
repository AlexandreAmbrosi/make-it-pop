<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, HelpCircle, Library, User, ChevronLeft } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  
  let { children } = $props();
  
  const links = [
    { href: '/learn/courses', label: 'Finest courses', icon: BookOpen },
    { href: '/learn/quiz', label: 'Quiz you up', icon: HelpCircle },
    { href: '/learn/glossary', label: 'Glossary', icon: Library },
  ];
</script>

<div class="flex min-h-screen bg-gray-50">
  <!-- Sidebar -->
  <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 pt-20">
    <div class="px-6 pb-6">
      <Button variant="ghost" size="sm" href="/" class="-ml-3 text-gray-500 mb-6">
        <ChevronLeft class="w-4 h-4 mr-1" /> Back to Home
      </Button>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Learning Platform</h2>
      <nav class="space-y-1">
        {#each links as link}
          {@const isActive = $page.url.pathname.startsWith(link.href)}
          <a 
            href={link.href} 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}"
          >
            <link.icon class="mr-3 h-5 w-5 {isActive ? 'text-orange-500' : 'text-gray-400'}" />
            {link.label}
          </a>
        {/each}
        
        <div class="pt-4 mt-4 border-t border-gray-100">
           <a 
            href="https://www.alexandreambrosi.com/" 
            target="_blank"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <User class="mr-3 h-5 w-5 text-gray-400" />
            About your teacher
          </a>
        </div>
      </nav>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 md:pl-64">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <!-- Mobile header would go here -->
       <div class="md:hidden mb-6">
        <Button variant="outline" href="/" size="sm">Back to Home</Button>
         <!-- Add mobile menu trigger here if needed -->
       </div>
       
      {@render children()}
    </div>
  </main>
</div>
