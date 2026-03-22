"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

type AgentName = "Planner" | "Researcher" | "Coder" | "QA" | "Deployer"
type AgentStatus = "running" | "idle" | "done" | "queued" | "error"

export interface Task {
  id: number
  description: string
  agent: AgentName
  status: AgentStatus
  tokens: number
  duration: string
}

const agentTextColors: Record<AgentName, string> = {
  Planner: "text-violet-500",
  Researcher: "text-sky-500",
  Coder: "text-emerald-500",
  QA: "text-amber-500",
  Deployer: "text-rose-500",
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const config = {
    running: { bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500", animate: true },
    done: { bg: "bg-white/10", text: "text-white/60", dot: "bg-white/40", animate: false },
    queued: { bg: "bg-amber-500/20", text: "text-amber-400", dot: "bg-amber-500", animate: false },
    idle: { bg: "bg-white/10", text: "text-white/40", dot: "bg-white/30", animate: false },
    error: { bg: "bg-rose-500/20", text: "text-rose-400", dot: "bg-rose-500", animate: false },
  }[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.animate ? "animate-pulse" : ""}`} />
      {status}
    </span>
  )
}

function TableRowSkeleton() {
  return (
    <TableRow className="border-white/5">
      <TableCell><Skeleton className="h-4 w-6" /></TableCell>
      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
    </TableRow>
  )
}

interface TasksTableProps {
  tasks: Task[]
  loading?: boolean
}

export function TasksTable({ tasks, loading = false }: TasksTableProps) {
  return (
    <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4">
      <h3 className="text-sm font-medium text-white/70 mb-3">Active Tasks</h3>
      <div className="overflow-hidden rounded-lg border border-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent bg-white/[0.02]">
              <TableHead className="text-white/40 w-12 font-medium">#</TableHead>
              <TableHead className="text-white/40 font-medium">Description</TableHead>
              <TableHead className="text-white/40 font-medium">Agent</TableHead>
              <TableHead className="text-white/40 font-medium">Status</TableHead>
              <TableHead className="text-white/40 text-right font-medium">Tokens</TableHead>
              <TableHead className="text-white/40 text-right font-medium">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : (
              tasks.map((task) => (
                <TableRow 
                  key={task.id} 
                  className="border-white/5 hover:bg-violet-500/5 transition-colors cursor-pointer group"
                >
                  <TableCell className="font-mono text-white/40 text-sm">{task.id}</TableCell>
                  <TableCell className="text-white/90 max-w-[300px] truncate group-hover:text-white transition-colors">
                    {task.description}
                  </TableCell>
                  <TableCell className={`font-medium ${agentTextColors[task.agent]}`}>
                    {task.agent}
                  </TableCell>
                  <TableCell><StatusBadge status={task.status} /></TableCell>
                  <TableCell className="font-mono text-right text-white/60 text-sm tabular-nums">
                    {task.tokens > 0 ? task.tokens.toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-right text-white/60 text-sm tabular-nums">
                    {task.duration}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
