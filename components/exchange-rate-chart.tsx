"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Données simulées des taux de change
const generateExchangeRateData = (baseCurrency: string, targetCurrency: string) => {
  const rates = []
  const today = new Date()
  const baseValue = baseCurrency === "EUR" ? 1.1 : baseCurrency === "USD" ? 1 : 0.9

  // Données historiques (6 derniers mois)
  for (let i = 180; i >= 0; i -= 15) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // Ajouter une variation aléatoire pour simuler les fluctuations
    const randomVariation = (Math.random() - 0.5) * 0.1
    const rate = baseValue + randomVariation

    rates.push({
      date: date.toISOString().split("T")[0],
      rate: Number.parseFloat(rate.toFixed(4)),
    })
  }

  // Prévisions (6 prochains mois)
  let lastRate = rates[rates.length - 1].rate
  const trend = 0.02 // Tendance légèrement à la hausse

  for (let i = 15; i <= 180; i += 15) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Ajouter une tendance et une variation aléatoire
    const randomVariation = (Math.random() - 0.5) * 0.08
    lastRate = lastRate * (1 + trend / 100) + randomVariation

    rates.push({
      date: date.toISOString().split("T")[0],
      rate: Number.parseFloat(lastRate.toFixed(4)),
      forecast: true,
    })
  }

  return rates
}

export default function ExchangeRateChart() {
  const [baseCurrency, setBaseCurrency] = useState("EUR")
  const [targetCurrency, setTargetCurrency] = useState("MAD") // Dirham marocain par défaut
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateExchangeRateData(baseCurrency, targetCurrency))
  }, [baseCurrency, targetCurrency])

  const currentIndex = data.findIndex((item) => !item.forecast)
  const currentRate = currentIndex >= 0 ? data[currentIndex].rate : 0
  const forecastRate = data.length > 0 ? data[data.length - 1].rate : 0
  const changePercent = (((forecastRate - currentRate) / currentRate) * 100).toFixed(2)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Prévisions du Taux de Change</CardTitle>
            <CardDescription>Historique et prévisions sur 12 mois</CardDescription>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Devise de base" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={targetCurrency} onValueChange={setTargetCurrency}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Devise cible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MAD">MAD</SelectItem>
                <SelectItem value="DZD">DZD</SelectItem>
                <SelectItem value="TND">TND</SelectItem>
                <SelectItem value="XOF">XOF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">Taux actuel</p>
            <h3 className="text-2xl font-bold">{currentRate.toFixed(4)}</h3>
            <p className="text-xs text-muted-foreground">
              1 {baseCurrency} = {currentRate.toFixed(4)} {targetCurrency}
            </p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">Prévision à 6 mois</p>
            <h3 className="text-2xl font-bold">{forecastRate.toFixed(4)}</h3>
            <p className="text-xs text-muted-foreground">
              1 {baseCurrency} = {forecastRate.toFixed(4)} {targetCurrency}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${Number.parseFloat(changePercent) > 0 ? "bg-red-100" : "bg-green-100"}`}>
            <p className="text-sm font-medium">Variation prévue</p>
            <h3
              className={`text-2xl font-bold ${Number.parseFloat(changePercent) > 0 ? "text-red-600" : "text-green-600"}`}
            >
              {Number.parseFloat(changePercent) > 0 ? "+" : ""}
              {changePercent}%
            </h3>
            <p className="text-xs text-muted-foreground">
              {Number.parseFloat(changePercent) > 0
                ? "Augmentation du coût d'importation"
                : "Réduction du coût d'importation"}
            </p>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(-2)}`
                }}
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value: number) => [value.toFixed(4), `Taux ${baseCurrency}/${targetCurrency}`]}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                name="Historique"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 1 }}
                activeDot={{ r: 5 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Prévision"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 1 }}
                activeDot={{ r: 5 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            * Les prévisions sont basées sur des modèles statistiques et peuvent varier. Dernière mise à jour:{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

