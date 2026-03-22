"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bot, Zap, DollarSign, CheckCircle, Plus } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MetricCard } from "@/components/dashboard/metric-card"
import { AgentNetwork } from "@/components/dashboard/agent-network"
import { TasksTable, type Task } from "@/components/dashboard/tasks-table"
import { TokenSparkline } from "@/components/dashboard/token-sparkline"
import { LiveLogPanel, type LogEntry } from "@/components/dashboard/live-log-panel"
import { NewTaskModal } from "@/components/dashboard/new-task-modal"

type AgentName = "Planner" | "Researcher" | "Coder" | "QA" | "Deployer"

// Initial tasks data
const initialTasks: Task[] = [
  { id: 1, description: "Analyse issue #482 — auth token expiry bug", agent: "Researcher", status: "running", tokens: 2840, duration: "12s" },
  { id: 2, description: "Read codebase: src/auth/middleware.ts", agent: "Researcher", status: "done", tokens: 1250, duration: "8s" },
  { id: 3, description: "Write fix: refresh token rotation logic", agent: "Coder", status: "running", tokens: 4120, duration: "24s" },
  { id: 4, description: "Generate unit tests for auth module", agent: "QA", status: "queued", tokens: 0, duration: "—" },
  { id: 5, description: "Open PR to main with summary", agent: "Deployer", status: "idle", tokens: 0, duration: "—" },
]

// Initial log messages
const initialLogs: LogEntry[] = [
  { id: 1, time: "14:03:01", agent: "Planner", message: "Task received: fix auth token expiry bug in #482" },
  { id: 2, time: "14:03:02", agent: "Planner", message: "Decomposing into 4 subtasks, assigning to agents" },
  { id: 3, time: "14:03:03", agent: "Researcher", message: "Starting codebase analysis" },
  { id: 4, time: "14:03:05", agent: "Researcher", message: "Located: src/auth/middleware.ts, src/utils/jwt.ts" },
  { id: 5, time: "14:03:09", agent: "Coder", message: "Reading auth middleware — 312 lines" },
  { id: 6, time: "14:03:14", agent: "Coder", message: "Identified root cause: refresh token not rotated on use" },
  { id: 7, time: "14:03:18", agent: "Coder", message: "Writing patch — estimating 40 lines changed" },
  { id: 8, time: "14:03:22", agent: "Researcher", message: "Cross-referencing JWT implementation patterns" },
  { id: 9, time: "14:03:25", agent: "Planner", message: "Progress update: 2/4 subtasks in progress" },
  { id: 10, time: "14:03:28", agent: "Coder", message: "Implementing rotateRefreshToken() method" },
  { id: 11, time: "14:03:32", agent: "Researcher", message: "Checking for related security advisories" },
  { id: 12, time: "14:03:35", agent: "Coder", message: "Adding token version tracking to user session" },
  { id: 13, time: "14:03:38", agent: "QA", message: "Preparing test scaffolding for auth module" },
  { id: 14, time: "14:03:41", agent: "Coder", message: "Updating middleware to validate token version" },
  { id: 15, time: "14:03:44", agent: "Researcher", message: "Analysis complete: 3 files need updates" },
  { id: 16, time: "14:03:47", agent: "Planner", message: "Researcher task marked complete" },
  { id: 17, time: "14:03:50", agent: "Coder", message: "Patch draft complete — running local validation" },
  { id: 18, time: "14:03:53", agent: "QA", message: "Awaiting code completion to begin testing" },
  { id: 19, time: "14:03:56", agent: "Coder", message: "Local tests passing — preparing for QA handoff" },
  { id: 20, time: "14:03:59", agent: "Planner", message: "Coder task 80% complete, QA next in queue" },
]

// Log message templates for simulation
const logTemplates: { agent: AgentName; messages: string[] }[] = [
  { agent: "Planner", messages: [
    "Monitoring task progress — all agents nominal",
    "Adjusting priorities based on completion times",
    "Preparing summary for final PR",
    "Task coordination checkpoint reached",
    "Evaluating resource allocation efficiency",
    "Scheduling next batch of subtasks",
  ]},
  { agent: "Researcher", messages: [
    "Verifying code changes against requirements",
    "Documentation review in progress",
    "Checking for edge cases in auth flow",
    "Analysis phase complete",
    "Scanning dependency tree for conflicts",
    "Cross-referencing with security best practices",
  ]},
  { agent: "Coder", messages: [
    "Optimizing token refresh performance",
    "Adding error handling for edge cases",
    "Code review suggestions incorporated",
    "Final touches on implementation",
    "Refactoring for better maintainability",
    "Running linter and formatter passes",
  ]},
  { agent: "QA", messages: [
    "Test case generation started",
    "Setting up mock authentication context",
    "Writing integration tests",
    "Validating error scenarios",
    "Coverage analysis in progress",
    "Edge case testing queued",
  ]},
  { agent: "Deployer", messages: [
    "Preparing deployment configuration",
    "Checking CI/CD pipeline status",
    "Awaiting QA approval for deployment",
    "Staging environment ready",
    "Pre-deployment checks initiated",
    "Rollback strategy prepared",
  ]},
]

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isLoading, setIsLoading] = useState(true)
  const [tokenData, setTokenData] = useState<number[]>(() => 
    Array.from({ length: 60 }, () => Math.floor(Math.random() * 15000) + 5000)
  )
  const [totalTokens, setTotalTokens] = useState(1200000)
  const [modalOpen, setModalOpen] = useState(false)
  const logIdRef = useRef(21)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Simulate live log updates
  useEffect(() => {
    const interval = setInterval(() => {
      const templateGroup = logTemplates[Math.floor(Math.random() * logTemplates.length)]
      const message = templateGroup.messages[Math.floor(Math.random() * templateGroup.messages.length)]
      const now = new Date()
      const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
      
      const newLog: LogEntry = {
        id: logIdRef.current++,
        time,
        agent: templateGroup.agent,
        message,
      }
      
      setLogs((prev) => [...prev.slice(-50), newLog])
    }, 1500)
    
    return () => clearInterval(interval)
  }, [])

  // Simulate token count updates
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 500) + 100
      setTotalTokens((prev) => prev + increment)
      setTokenData((prev) => [...prev.slice(1), Math.floor(Math.random() * 15000) + 5000])
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  // Simulate task progress
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) => prev.map((task) => {
        if (task.status === "running") {
          const newTokens = task.tokens + Math.floor(Math.random() * 200) + 50
          const currentDuration = parseInt(task.duration) || 0
          return { ...task, tokens: newTokens, duration: `${currentDuration + 1}s` }
        }
        return task
      }))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`
    return tokens.toString()
  }

  const estimatedCost = (totalTokens / 1000000 * 0.70).toFixed(2)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white min-w-[1280px]">
      <Sidebar onNewTask={() => setModalOpen(true)} />
      
      <main className="ml-[220px] p-6">
        {/* Metrics Row */}
        <div className="flex gap-4 mb-6">
          <MetricCard 
            label="Active Agents" 
            value={3} 
            trend="up" 
            trendValue="+1"
            icon={Bot} 
            loading={isLoading}
          />
          <MetricCard 
            label="Tasks Running" 
            value={7} 
            trend="up" 
            trendValue="+3"
            icon={Zap} 
            loading={isLoading}
          />
          <MetricCard 
            label="Tokens Used" 
            value={formatTokens(totalTokens)} 
            icon={CheckCircle} 
            loading={isLoading}
          />
          <MetricCard 
            label="Est. Cost" 
            value={`$${estimatedCost}`} 
            trend="down" 
            trendValue="-8%"
            icon={DollarSign} 
            loading={isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-[6] space-y-6 min-w-0">
            <AgentNetwork />
            <TasksTable tasks={tasks} loading={isLoading} />
            <TokenSparkline data={tokenData} />
          </div>
          
          {/* Right Column */}
          <div className="flex-[4] min-w-[340px]">
            <div className="h-[calc(100vh-180px)] sticky top-6">
              <LiveLogPanel logs={logs} />
            </div>
          </div>
        </div>
      </main>

      {/* Floating New Task Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/25 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-violet-500/40 z-50 group"
        aria-label="Create new task"
      >
        <Plus className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-200" />
      </button>

      <NewTaskModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
