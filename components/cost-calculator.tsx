"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Taux de change simulés
const exchangeRates = {
  USD: {
    MAD: 9.85,
    DZD: 134.5,
    TND: 3.12,
    XOF: 602.5,
  },
  EUR: {
    MAD: 10.75,
    DZD: 146.8,
    TND: 3.41,
    XOF: 655.96,
  },
  GBP: {
    MAD: 12.65,
    DZD: 172.3,
    TND: 4.01,
    XOF: 771.2,
  },
}

// Prévisions de variation à 6 mois (en pourcentage)
const forecastVariation = {
  USD: {
    MAD: 3.2,
    DZD: 4.5,
    TND: 2.1,
    XOF: 1.8,
  },
  EUR: {
    MAD: 2.8,
    DZD: 3.7,
    TND: 1.5,
    XOF: 0.9,
  },
  GBP: {
    MAD: -1.2,
    DZD: 2.3,
    TND: -0.8,
    XOF: 1.1,
  },
}

export default function CostCalculator() {
  const [currency, setCurrency] = useState("EUR")
  const [targetCurrency, setTargetCurrency] = useState("MAD")
  const [medicationCost, setMedicationCost] = useState(10000)
  const [importVolume, setImportVolume] = useState(1000)
  const [timeframe, setTimeframe] = useState(0) // 0 = actuel, 6 = dans 6 mois

  // Calculer le taux de change actuel et prévu
  const currentRate =
    exchangeRates[currency as keyof typeof exchangeRates][
      targetCurrency as keyof (typeof exchangeRates)[keyof typeof exchangeRates]
    ]
  const variation =
    forecastVariation[currency as keyof typeof forecastVariation][
      targetCurrency as keyof (typeof forecastVariation)[keyof typeof forecastVariation]
    ]
  const forecastRate = currentRate * (1 + variation / 100)

  // Calculer le taux interpolé en fonction du timeframe
  const interpolatedRate = currentRate + (forecastRate - currentRate) * (timeframe / 6)

  // Calculer les coûts
  const currentCost = medicationCost * currentRate
  const forecastCost = medicationCost * interpolatedRate
  const totalCurrentCost = currentCost * importVolume
  const totalForecastCost = forecastCost * importVolume
  const costDifference = totalForecastCost - totalCurrentCost
  const costDifferencePercent = (costDifference / totalCurrentCost) * 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Calculateur d'Impact sur les Coûts</h2>
        <p className="text-muted-foreground mb-6">
          Estimez l'impact des variations du taux de change sur vos coûts d'importation de médicaments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
            <CardDescription>Ajustez les variables pour votre calcul</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Devise d'achat</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">Dollar américain (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">Livre sterling (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCurrency">Devise locale</Label>
              <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                <SelectTrigger id="targetCurrency">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAD">Dirham marocain (MAD)</SelectItem>
                  <SelectItem value="DZD">Dinar algérien (DZD)</SelectItem>
                  <SelectItem value="TND">Dinar tunisien (TND)</SelectItem>
                  <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicationCost">Coût unitaire du médicament (en {currency})</Label>
              <Input
                id="medicationCost"
                type="number"
                value={medicationCost}
                onChange={(e) => setMedicationCost(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="importVolume">Volume d'importation (unités)</Label>
              <Input
                id="importVolume"
                type="number"
                value={importVolume}
                onChange={(e) => setImportVolume(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label>Horizon temporel: {timeframe} mois</Label>
              <Slider value={[timeframe]} min={0} max={6} step={1} onValueChange={(value) => setTimeframe(value[0])} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Actuel</span>
                <span>Dans 6 mois</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résultats</CardTitle>
            <CardDescription>Impact du taux de change sur vos coûts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Taux actuel</p>
                <p className="text-2xl font-bold">{currentRate.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">
                  1 {currency} = {currentRate.toFixed(4)} {targetCurrency}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Taux prévu ({timeframe} mois)</p>
                <p className="text-2xl font-bold">{interpolatedRate.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">
                  1 {currency} = {interpolatedRate.toFixed(4)} {targetCurrency}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Coût unitaire actuel</p>
                    <p className="text-xl font-semibold">
                      {currentCost.toFixed(2)} {targetCurrency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Coût unitaire prévu</p>
                    <p className="text-xl font-semibold">
                      {forecastCost.toFixed(2)} {targetCurrency}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Coût total d'importation</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Actuel</p>
                      <p className="text-2xl font-bold">
                        {totalCurrentCost.toLocaleString("fr-FR")} {targetCurrency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prévu ({timeframe} mois)</p>
                      <p className="text-2xl font-bold">
                        {totalForecastCost.toLocaleString("fr-FR")} {targetCurrency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${costDifference > 0 ? "bg-red-100" : "bg-green-100"}`}>
                  <p className="text-sm font-medium">Impact sur le budget</p>
                  <div className="flex justify-between items-center">
                    <p className={`text-xl font-bold ${costDifference > 0 ? "text-red-600" : "text-green-600"}`}>
                      {costDifference > 0 ? "+" : ""}
                      {costDifference.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} {targetCurrency}
                    </p>
                    <p className={`text-xl font-bold ${costDifference > 0 ? "text-red-600" : "text-green-600"}`}>
                      {costDifference > 0 ? "+" : ""}
                      {costDifferencePercent.toFixed(2)}%
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {costDifference > 0
                      ? "Augmentation prévue des coûts d'importation"
                      : "Réduction prévue des coûts d'importation"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

