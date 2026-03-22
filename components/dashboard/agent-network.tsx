"use client"

import { Search, Code, ShieldCheck, Rocket, Zap } from "lucide-react"

type AgentName = "Planner" | "Researcher" | "Coder" | "QA" | "Deployer"
type AgentStatus = "running" | "idle" | "done" | "queued" | "error"

interface WorkerAgent {
  name: AgentName
  angle: number
  status: AgentStatus
  icon: React.ElementType
}

const agentColors: Record<AgentName, string> = {
  Planner: "#7c3aed",
  Researcher: "#0ea5e9",
  Coder: "#10b981",
  QA: "#f59e0b",
  Deployer: "#f43f5e",
}

const statusColors: Record<AgentStatus, string> = {
  running: "#10b981",
  done: "#10b981",
  queued: "#f59e0b",
  idle: "#6b7280",
  error: "#ef4444",
}

export function AgentNetwork() {
  const agents: WorkerAgent[] = [
    { name: "Researcher", angle: -90, status: "running", icon: Search },
    { name: "Coder", angle: 0, status: "running", icon: Code },
    { name: "QA", angle: 90, status: "queued", icon: ShieldCheck },
    { name: "Deployer", angle: 180, status: "idle", icon: Rocket },
  ]

  const centerX = 180
  const centerY = 120
  const radius = 90

  return (
    <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4 h-72 overflow-hidden">
      <h3 className="text-sm font-medium text-white/70 mb-2">Agent Network</h3>
      <svg viewBox="0 0 360 200" className="w-full h-[calc(100%-1.5rem)]">
        <defs>
          {/* Gradient definitions for each agent line */}
          {agents.map((agent) => (
            <linearGradient key={`grad-${agent.name}`} id={`line-${agent.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={agentColors.Planner} />
              <stop offset="100%" stopColor={agentColors[agent.name]} />
            </linearGradient>
          ))}
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection lines with animation */}
        {agents.map((agent) => {
          const x = centerX + radius * Math.cos((agent.angle * Math.PI) / 180)
          const y = centerY + radius * Math.sin((agent.angle * Math.PI) / 180)
          const isRunning = agent.status === "running"
          
          return (
            <g key={`line-${agent.name}`}>
              {/* Background line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={agentColors[agent.name]}
                strokeWidth="2"
                strokeOpacity={0.1}
              />
              {/* Animated dashed line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={agentColors[agent.name]}
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeOpacity={isRunning ? 0.8 : 0.25}
                style={isRunning ? {
                  animation: "dashMove 1s linear infinite",
                } : undefined}
              />
            </g>
          )
        })}

        {/* Center Planner node with pulse */}
        <g>
          {/* Outer pulse ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r="42"
            fill="none"
            stroke={agentColors.Planner}
            strokeWidth="1"
            strokeOpacity="0.3"
            style={{
              animation: "pulseRing 2s ease-in-out infinite",
              transformOrigin: `${centerX}px ${centerY}px`,
            }}
          />
          {/* Glow ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r="36"
            fill={agentColors.Planner}
            fillOpacity="0.15"
          />
          {/* Middle ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r="28"
            fill={agentColors.Planner}
            fillOpacity="0.3"
          />
          {/* Core */}
          <circle
            cx={centerX}
            cy={centerY}
            r="20"
            fill={agentColors.Planner}
            filter="url(#glow)"
          />
          {/* Icon */}
          <foreignObject x={centerX - 10} y={centerY - 10} width="20" height="20">
            <div className="flex items-center justify-center h-full">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </foreignObject>
          {/* Label */}
          <text
            x={centerX}
            y={centerY + 48}
            textAnchor="middle"
            className="fill-white text-[11px] font-semibold"
          >
            Planner
          </text>
        </g>

        {/* Worker nodes */}
        {agents.map((agent) => {
          const x = centerX + radius * Math.cos((agent.angle * Math.PI) / 180)
          const y = centerY + radius * Math.sin((agent.angle * Math.PI) / 180)
          const Icon = agent.icon
          const isRunning = agent.status === "running"
          
          return (
            <g key={agent.name}>
              {/* Outer glow for running agents */}
              {isRunning && (
                <circle
                  cx={x}
                  cy={y}
                  r="26"
                  fill={agentColors[agent.name]}
                  fillOpacity="0.1"
                  style={{
                    animation: "pulseRing 2s ease-in-out infinite",
                    transformOrigin: `${x}px ${y}px`,
                  }}
                />
              )}
              {/* Background ring */}
              <circle
                cx={x}
                cy={y}
                r="22"
                fill={agentColors[agent.name]}
                fillOpacity="0.15"
              />
              {/* Core circle */}
              <circle
                cx={x}
                cy={y}
                r="16"
                fill={agentColors[agent.name]}
              />
              {/* Icon */}
              <foreignObject x={x - 8} y={y - 8} width="16" height="16">
                <div className="flex items-center justify-center h-full">
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </foreignObject>
              {/* Name label */}
              <text
                x={x}
                y={y + 32}
                textAnchor="middle"
                className="fill-white text-[10px] font-medium"
              >
                {agent.name}
              </text>
              {/* Status badge */}
              <g transform={`translate(${x}, ${y + 42})`}>
                <rect
                  x="-22"
                  y="-6"
                  width="44"
                  height="13"
                  rx="6.5"
                  fill="rgba(255,255,255,0.08)"
                />
                <circle
                  cx="-12"
                  cy="0.5"
                  r="3"
                  fill={statusColors[agent.status]}
                  style={agent.status === "running" ? {
                    animation: "statusPulse 1.5s ease-in-out infinite",
                  } : undefined}
                />
                <text
                  x="4"
                  y="3.5"
                  textAnchor="middle"
                  className="fill-white/70 text-[8px] font-medium"
                >
                  {agent.status}
                </text>
              </g>
            </g>
          )
        })}
        
        <style>{`
          @keyframes dashMove {
            to {
              stroke-dashoffset: -28;
            }
          }
          @keyframes pulseRing {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.1;
            }
          }
          @keyframes statusPulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </svg>
    </div>
  )
}
