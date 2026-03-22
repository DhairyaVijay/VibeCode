"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"

interface TokenSparklineProps {
  data: number[]
}

export function TokenSparkline({ data }: TokenSparklineProps) {
  const chartData = data.map((value, index) => ({ 
    index, 
    value,
    time: `${60 - index}s ago`
  }))
  
  return (
    <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs text-white/50 font-medium uppercase tracking-wider">Token usage — last 60s</h3>
        <span className="text-xs text-white/30 font-mono tabular-nums">
          {data[data.length - 1]?.toLocaleString() || 0} tok/s
        </span>
      </div>
      <div className="h-[70px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.5} />
                <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "#0d0d14",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ display: "none" }}
              itemStyle={{ color: "#a78bfa", fontFamily: "monospace" }}
              formatter={(value: number) => [`${value.toLocaleString()} tokens`, ""]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#tokenGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
