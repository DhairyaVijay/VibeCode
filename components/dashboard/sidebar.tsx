"use client"

import {
  LayoutDashboard,
  ListTodo,
  Bot,
  Brain,
  Wrench,
  ScrollText,
  Settings,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ListTodo, label: "Tasks", active: false },
  { icon: Bot, label: "Agents", active: false },
  { icon: Brain, label: "Memory", active: false },
  { icon: Wrench, label: "Tools", active: false },
  { icon: ScrollText, label: "Logs", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function Sidebar({ onNewTask }: { onNewTask: () => void }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] border-r border-[rgba(255,255,255,0.08)] bg-[#0a0a0f] flex flex-col z-50">
      <div className="p-5">
        <h1 className="text-xl font-bold text-violet-500 flex items-center gap-2">
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          AgentOS
        </h1>
      </div>
      
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 mb-1 ${
              item.active
                ? "bg-violet-500/15 text-violet-400 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.2)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-3">
        <Button 
          onClick={onNewTask}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:shadow-violet-500/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
    </aside>
  )
}
