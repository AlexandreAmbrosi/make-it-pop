<script lang="ts">
  import { Users, FileText, Activity, ArrowUpRight } from 'lucide-svelte';
</script>

<div class="space-y-8">
  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500">Total Tools</h3>
        <Activity class="w-4 h-4 text-gray-400" />
      </div>
      <div class="text-3xl font-bold text-gray-900">124</div>
      <p class="text-xs text-green-600 mt-1 flex items-center">
        <ArrowUpRight class="w-3 h-3 mr-1" /> +12 this month
      </p>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500">Inspirations</h3>
        <FileText class="w-4 h-4 text-gray-400" />
      </div>
      <div class="text-3xl font-bold text-gray-900">892</div>
      <p class="text-xs text-green-600 mt-1 flex items-center">
        <ArrowUpRight class="w-3 h-3 mr-1" /> +45 this month
      </p>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500">Courses</h3>
        <Users class="w-4 h-4 text-gray-400" />
      </div>
      <div class="text-3xl font-bold text-gray-900">4</div>
      <p class="text-xs text-gray-500 mt-1">
        Active & Published
      </p>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden group">
        <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-2">Create New Content</h3>
            <p class="text-purple-100 mb-6 max-w-sm">Use our AI-powered tools to generate new courses, articles, or tool descriptions in seconds.</p>
            <div class="flex gap-3">
                <button class="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Generate Course</button>
                <button class="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-800 transition-colors">Write Article</button>
            </div>
        </div>
        <!-- Decorative bg -->
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-6">
        <h3 class="font-bold text-lg mb-4">Recent Activity</h3>
        <div class="space-y-4">
            <div class="flex items-start gap-3 text-sm pb-4 border-b border-gray-50 last:border-0">
                <div class="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                    <p class="font-medium text-gray-900">New tool "Supabase" added</p>
                    <p class="text-gray-500">2 hours ago</p>
                </div>
            </div>
            <div class="flex items-start gap-3 text-sm pb-4 border-b border-gray-50 last:border-0">
                <div class="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <div>
                    <p class="font-medium text-gray-900">Course "UI Fundamentals" updated</p>
                    <p class="text-gray-500">5 hours ago</p>
                </div>
            </div>
            <div class="flex items-start gap-3 text-sm">
                <div class="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                <div>
                    <p class="font-medium text-gray-900">Ingestion pipeline processed 15 items</p>
                    <p class="text-gray-500">Yesterday</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</div>
