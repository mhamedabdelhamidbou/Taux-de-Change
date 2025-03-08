"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Données simulées pour l'analyse d'impact
const impactByMedicationType = [
  { name: "Antibiotiques", impact: 4.2 },
  { name: "Antihypertenseurs", impact: 3.8 },
  { name: "Antidiabétiques", impact: 5.1 },
  { name: "Anticancéreux", impact: 7.3 },
  { name: "Vaccins", impact: 2.9 },
  { name: "Analgésiques", impact: 1.7 },
]

const impactByOrigin = [
  { name: "Europe", value: 45 },
  { name: "États-Unis", value: 28 },
  { name: "Inde", value: 15 },
  { name: "Chine", value: 8 },
  { name: "Autres", value: 4 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const riskMitigationStrategies = [
  {
    title: "Contrats à terme",
    description: "Négocier des contrats à terme pour fixer les prix d'achat sur une période déterminée.",
    impact: "Élevé",
    complexity: "Moyenne",
    timeframe: "Moyen terme",
  },
  {
    title: "Diversification des fournisseurs",
    description: "Répartir les achats entre différents fournisseurs dans diverses zones monétaires.",
    impact: "Moyen",
    complexity: "Élevée",
    timeframe: "Long terme",
  },
  {
    title: "Couverture de change",
    description: "Utiliser des instruments financiers pour se protéger contre les fluctuations des devises.",
    impact: "Élevé",
    complexity: "Élevée",
    timeframe: "Court terme",
  },
  {
    title: "Production locale",
    description: "Investir dans la production locale pour réduire la dépendance aux importations.",
    impact: "Très élevé",
    complexity: "Très élevée",
    timeframe: "Long terme",
  },
]

export default function ImpactAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Analyse d'Impact et Stratégies</h2>
        <p className="text-muted-foreground mb-6">
          Comprendre l'impact des variations de taux de change sur différentes catégories de médicaments et explorer des
          stratégies d'atténuation.
        </p>
      </div>

      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="impact">Analyse d'Impact</TabsTrigger>
          <TabsTrigger value="strategies">Stratégies d'Atténuation</TabsTrigger>
        </TabsList>

        <TabsContent value="impact" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impact par Type de Médicament</CardTitle>
                <CardDescription>
                  Sensibilité aux variations de taux de change (% d'augmentation des coûts pour une hausse de 5% du
                  taux)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactByMedicationType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "% Impact", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${value}%`, "Impact"]} />
                      <Legend />
                      <Bar dataKey="impact" name="Impact (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm">
                  <p>
                    Les médicaments anticancéreux sont les plus sensibles aux variations de taux de change en raison de
                    leur coût élevé et de leur provenance principalement de zones à devises fortes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Importations par Origine</CardTitle>
                <CardDescription>Pourcentage des importations par région d'origine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactByOrigin}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {impactByOrigin.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Proportion"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm">
                  <p>
                    L'Europe reste la principale source d'importation de médicaments, ce qui expose particulièrement aux
                    fluctuations de l'Euro.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Facteurs Clés Influençant les Taux de Change</CardTitle>
              <CardDescription>Comprendre les mécanismes qui affectent les devises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Facteurs Économiques</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Taux d'inflation relatifs</li>
                      <li>Taux d'intérêt différentiels</li>
                      <li>Balance commerciale</li>
                      <li>Dette publique</li>
                      <li>Croissance économique</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Facteurs Politiques</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Stabilité politique</li>
                      <li>Élections et changements de gouvernement</li>
                      <li>Politiques commerciales</li>
                      <li>Sanctions économiques</li>
                      <li>Réglementations sur les investissements étrangers</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Facteurs Géopolitiques</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Conflits régionaux</li>
                      <li>Crises énergétiques</li>
                      <li>Pandémies et crises sanitaires</li>
                      <li>Catastrophes naturelles</li>
                      <li>Accords commerciaux internationaux</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 text-sm">
                  <p className="font-medium">Impact sur le secteur pharmaceutique:</p>
                  <p>
                    Les fluctuations des taux de change affectent particulièrement le secteur pharmaceutique en raison
                    de la nature internationale de la chaîne d'approvisionnement et des longs cycles de développement
                    des produits. Une dépréciation de la monnaie locale peut entraîner une augmentation significative
                    des coûts d'importation, ce qui peut se répercuter sur les prix des médicaments ou réduire les
                    marges des importateurs et distributeurs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stratégies d'Atténuation des Risques</CardTitle>
              <CardDescription>Options pour gérer l'exposition aux fluctuations des taux de change</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskMitigationStrategies.map((strategy, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold">{strategy.title}</h3>
                    <p className="text-sm mt-2">{strategy.description}</p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Impact potentiel</p>
                        <p className="font-medium">{strategy.impact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Complexité de mise en œuvre</p>
                        <p className="font-medium">{strategy.complexity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Horizon temporel</p>
                        <p className="font-medium">{strategy.timeframe}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-muted p-4 rounded-lg mt-6">
                  <h3 className="font-semibold mb-2">Approche recommandée</h3>
                  <p className="text-sm">
                    Une stratégie hybride combinant des mesures à court terme (couverture de change) et à long terme
                    (diversification des fournisseurs et production locale) offre généralement la meilleure protection
                    contre les risques liés aux fluctuations des taux de change. L'approche optimale dépend de la taille
                    de l'entreprise, de son volume d'importation et de sa tolérance au risque.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Étude de cas: Impact de la dévaluation sur le secteur pharmaceutique</CardTitle>
              <CardDescription>Leçons tirées d'expériences passées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-semibold">Cas du Maroc (2015-2016)</h3>
                  <p className="text-sm mt-1">
                    Lorsque le dirham marocain s'est déprécié de 8% face à l'euro en 2015-2016, les importateurs de
                    médicaments ont vu leurs coûts augmenter significativement. Les entreprises qui avaient mis en place
                    des contrats à terme ont pu maintenir leurs marges, tandis que celles sans protection ont dû
                    absorber les coûts ou les répercuter sur les prix.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-semibold">Stratégie réussie: Laboratoires Cooper Pharma</h3>
                  <p className="text-sm mt-1">
                    Cooper Pharma a réussi à atténuer l'impact des fluctuations monétaires en combinant une stratégie de
                    couverture de change pour les importations à court terme avec un investissement progressif dans la
                    production locale. Cette approche a permis de réduire l'exposition aux risques de change de 45% sur
                    une période de trois ans.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h3 className="font-semibold">Échec stratégique: Distributeur pharmaceutique anonyme</h3>
                  <p className="text-sm mt-1">
                    Un important distributeur n'ayant pas anticipé la dévaluation de la monnaie locale a subi une perte
                    de 12% sur sa marge brute en un seul trimestre. L'absence de mécanismes de couverture et la rigidité
                    des prix réglementés ont amplifié l'impact négatif.
                  </p>
                </div>

                <div className="mt-4 text-sm">
                  <p className="font-medium">Enseignements clés:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>
                      La prévisibilité des besoins d'importation facilite la mise en place de stratégies de couverture
                      efficaces
                    </li>
                    <li>
                      Les médicaments essentiels à marge réglementée sont particulièrement vulnérables aux fluctuations
                      des taux de change
                    </li>
                    <li>
                      Une approche proactive de gestion des risques de change est essentielle pour maintenir la
                      viabilité financière
                    </li>
                    <li>
                      L'intégration verticale et la production locale constituent une solution stratégique à long terme
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

