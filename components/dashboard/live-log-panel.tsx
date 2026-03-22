"use client"

import { useEffect, useRef } from "react"

type AgentName = "Planner" | "Researcher" | "Coder" | "QA" | "Deployer"

export interface LogEntry {
  id: number
  time: string
  agent: AgentName
  message: string
}

const agentTextColors: Record<AgentName, string> = {
  Planner: "text-violet-500",
  Researcher: "text-sky-500",
  Coder: "text-emerald-500",
  QA: "text-amber-500",
  Deployer: "text-rose-500",
}

interface LiveLogPanelProps {
  logs: LogEntry[]
}

export function LiveLogPanel({ logs }: LiveLogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevLogsLength = useRef(logs.length)
  
  useEffect(() => {
    if (scrollRef.current && logs.length > prevLogsLength.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
    prevLogsLength.current = logs.length
  }, [logs.length])

  return (
    <div className="rounded-xl bg-[#0d0d14] border border-[rgba(255,255,255,0.06)] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h3 className="text-sm font-medium text-white/70">Live trace</h3>
        </div>
        <span className="text-xs text-white/30 font-mono">{logs.length} entries</span>
      </div>
      
      {/* Log entries */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-0.5 scrollbar-thin"
      >
        {logs.map((log, index) => {
          const isNew = index >= logs.length - 3
          return (
            <div 
              key={log.id}
              className={`py-0.5 transition-opacity duration-300 ${isNew ? "animate-fadeSlideIn" : ""}`}
              style={{ 
                animationDelay: isNew ? `${(index - (logs.length - 3)) * 50}ms` : undefined,
              }}
            >
              <span className="text-white/25 select-none">[{log.time}]</span>{" "}
              <span className={`font-semibold ${agentTextColors[log.agent]}`}>
                {log.agent.toUpperCase().padEnd(10)}
              </span>{" "}
              <span className="text-white/25 select-none">›</span>{" "}
              <span className="text-white/70">{log.message}</span>
            </div>
          )
        })}
      </div>
      
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 200ms ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
