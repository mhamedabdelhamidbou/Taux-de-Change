"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Données simulées pour le tableau
const generateHistoricalData = () => {
  const currencies = ["EUR/MAD", "USD/MAD", "EUR/DZD", "USD/DZD", "EUR/TND", "USD/TND"]
  const data = []

  const today = new Date()
  const baseRates = {
    "EUR/MAD": 10.75,
    "USD/MAD": 9.85,
    "EUR/DZD": 146.8,
    "USD/DZD": 134.5,
    "EUR/TND": 3.41,
    "USD/TND": 3.12,
  }

  // Générer des données pour les 24 derniers mois
  for (let i = 0; i < 24; i++) {
    const date = new Date(today)
    date.setMonth(today.getMonth() - i)

    currencies.forEach((currency) => {
      const baseRate = baseRates[currency]
      // Ajouter une variation aléatoire pour simuler les fluctuations
      const randomVariation = (Math.random() - 0.5) * 0.05
      const historicalRate = baseRate * (1 + randomVariation - i * 0.005)

      data.push({
        date: date.toISOString().split("T")[0],
        currency,
        rate: Number.parseFloat(historicalRate.toFixed(4)),
        monthlyChange: Number.parseFloat((randomVariation * 100).toFixed(2)),
        yearlyChange: Number.parseFloat(
          ((i > 11 ? historicalRate / (baseRate * (1 + randomVariation - (i - 12) * 0.005)) - 1 : 0) * 100).toFixed(2),
        ),
      })
    })
  }

  return data
}

const historicalData = generateHistoricalData()

export default function DataTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currencyFilter, setCurrencyFilter] = useState("all")

  // Filtrer les données
  const filteredData = historicalData.filter((item) => {
    const matchesSearch =
      item.date.includes(searchTerm) || item.currency.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCurrency = currencyFilter === "all" || item.currency === currencyFilter

    return matchesSearch && matchesCurrency
  })

  // Obtenir les dates uniques pour le regroupement
  const uniqueDates = [...new Set(filteredData.map((item) => item.date))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Données Historiques des Taux de Change</h2>
        <p className="text-muted-foreground mb-6">
          Consultez l'évolution des taux de change sur les 24 derniers mois pour analyser les tendances.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Affinez votre recherche</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par date (YYYY-MM) ou devise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les devises</SelectItem>
                  <SelectItem value="EUR/MAD">EUR/MAD</SelectItem>
                  <SelectItem value="USD/MAD">USD/MAD</SelectItem>
                  <SelectItem value="EUR/DZD">EUR/DZD</SelectItem>
                  <SelectItem value="USD/DZD">USD/DZD</SelectItem>
                  <SelectItem value="EUR/TND">EUR/TND</SelectItem>
                  <SelectItem value="USD/TND">USD/TND</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Paire de devises</TableHead>
                  <TableHead className="text-right">Taux</TableHead>
                  <TableHead className="text-right">Var. mensuelle</TableHead>
                  <TableHead className="text-right">Var. annuelle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueDates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Aucune donnée trouvée pour cette recherche
                    </TableCell>
                  </TableRow>
                ) : (
                  uniqueDates.map((date) => {
                    const dateItems = filteredData.filter((item) => item.date === date)
                    return dateItems.map((item, index) => (
                      <TableRow
                        key={`${item.date}-${item.currency}`}
                        className={index === 0 ? "border-t-4 border-muted" : ""}
                      >
                        {index === 0 && (
                          <TableCell rowSpan={dateItems.length} className="align-top font-medium">
                            {new Date(item.date).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
                          </TableCell>
                        )}
                        <TableCell>{item.currency}</TableCell>
                        <TableCell className="text-right font-medium">{item.rate.toFixed(4)}</TableCell>
                        <TableCell
                          className={`text-right ${item.monthlyChange > 0 ? "text-green-600" : item.monthlyChange < 0 ? "text-red-600" : ""}`}
                        >
                          {item.monthlyChange > 0 ? "+" : ""}
                          {item.monthlyChange}%
                        </TableCell>
                        <TableCell
                          className={`text-right ${item.yearlyChange > 0 ? "text-green-600" : item.yearlyChange < 0 ? "text-red-600" : ""}`}
                        >
                          {item.yearlyChange > 0 ? "+" : ""}
                          {item.yearlyChange}%
                        </TableCell>
                      </TableRow>
                    ))
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 text-sm text-muted-foreground">
            <p>* Les variations mensuelles et annuelles sont calculées sur la base des taux de fin de mois.</p>
            <p>
              * Un pourcentage positif indique une appréciation de la devise étrangère (augmentation du coût
              d'importation).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

