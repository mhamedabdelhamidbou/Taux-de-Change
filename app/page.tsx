import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExchangeRateChart from "@/components/exchange-rate-chart"
import CostCalculator from "@/components/cost-calculator"
import ImpactAnalysis from "@/components/impact-analysis"
import DataTable from "@/components/data-table"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Impact du Taux de Change sur le Coût d'Importation des Médicaments
      </h1>

      <div className="grid gap-6 mb-8">
        <ExchangeRateChart />
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculateur de Coûts</TabsTrigger>
          <TabsTrigger value="analysis">Analyse d'Impact</TabsTrigger>
          <TabsTrigger value="data">Données Détaillées</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="p-4 border rounded-md mt-2">
          <CostCalculator />
        </TabsContent>
        <TabsContent value="analysis" className="p-4 border rounded-md mt-2">
          <ImpactAnalysis />
        </TabsContent>
        <TabsContent value="data" className="p-4 border rounded-md mt-2">
          <DataTable />
        </TabsContent>
      </Tabs>
    </main>
  )
}

