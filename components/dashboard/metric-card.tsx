import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive?: boolean
  }
  currency?: boolean
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  trend,
  currency = false 
}: MetricCardProps) {
  const displayValue = currency && typeof value === 'number' 
    ? formatCurrency(value) 
    : value

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {trend && (
          <div className="flex items-center pt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : trend.isPositive === false ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Minus className="h-4 w-4 text-gray-500" />
            )}
            <span className={`ml-1 text-xs ${
              trend.isPositive ? 'text-green-500' : 
              trend.isPositive === false ? 'text-red-500' : 'text-gray-500'
            }`}>
              {trend.value > 0 ? '+' : ''}{trend.value}% desde el mes pasado
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}