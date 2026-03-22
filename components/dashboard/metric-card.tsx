"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  trend?: "up" | "down"
  trendValue?: string
  icon: React.ElementType
  loading?: boolean
}

export function MetricCard({ 
  label, 
  value, 
  trend, 
  trendValue,
  icon: Icon,
  loading = false
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  const targetValue = typeof value === "number" ? value : parseFloat(value.replace(/[^0-9.]/g, "")) || 0
  const prefix = typeof value === "string" && value.startsWith("$") ? "$" : ""
  const suffix = typeof value === "string" ? value.replace(/^[\$0-9.]+/, "") : ""
  
  useEffect(() => {
    if (loading || hasAnimated) return
    
    const duration = 800
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(targetValue * easeOut)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setHasAnimated(true)
      }
    }
    
    requestAnimationFrame(animate)
  }, [targetValue, loading, hasAnimated])

  // Update display value when target changes (for live updates after initial animation)
  useEffect(() => {
    if (hasAnimated) {
      setDisplayValue(targetValue)
    }
  }, [targetValue, hasAnimated])

  if (loading) {
    return (
      <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-4 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
      </div>
    )
  }

  const formatDisplay = () => {
    if (suffix === "M") {
      return `${prefix}${displayValue.toFixed(1)}${suffix}`
    }
    if (prefix === "$") {
      return `${prefix}${displayValue.toFixed(2)}`
    }
    return `${prefix}${Math.round(displayValue)}${suffix}`
  }

  return (
    <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4 flex-1 group hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/50 uppercase tracking-wider font-medium">{label}</span>
        <Icon className="h-4 w-4 text-white/30 group-hover:text-white/40 transition-colors" />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white tabular-nums">
          {formatDisplay()}
        </span>
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
            {trend === "up" ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
            {trendValue || (trend === "up" ? "+12%" : "-3%")}
          </span>
        )}
      </div>
    </div>
  )
}
