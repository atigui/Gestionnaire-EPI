"use client"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Users, Package, ClipboardList,Calendar } from "lucide-react"
import Layout from "../layout/layout"
import { ChartContainer, ChartTooltip } from "../ui/chart"

// Données pour la répartition par rôle (sans consultant)
const roleData = [
  { name: "Administrateur", value: 15, color: "#D31E25" }, // Rouge Menara
  { name: "Affecteur", value: 45, color: "#1E2D59" }, // Bleu Menara
  { name: "Magasinier", value: 120, color: "#8C8C8C" }, // Gris Menara
]

// Données pour les affectations mensuelles
const affectationsData = [
  { month: "Jan", affectations: 65 },
  { month: "Mar", affectations: 80 },
  { month: "Mai", affectations: 56 },
  { month: "Juil", affectations: 40 },
  { month: "Sep", affectations: 67 },
  { month: "Nov", affectations: 110 },
  { month: "Fév", affectations: 59 },
  { month: "Avr", affectations: 81 },
  { month: "Juin", affectations: 55 },
  { month: "Août", affectations: 45 },
  { month: "Oct", affectations: 90 },
  { month: "Déc", affectations: 85 },
]

// Données pour les attributions mensuelles
const attributionsData = [
  { month: "Jan", attributions: 120 },
  { month: "Mar", attributions: 145 },
  { month: "Mai", attributions: 167 },
  { month: "Juil", attributions: 156 },
  { month: "Sep", attributions: 178 },
  { month: "Nov", attributions: 223 },
  { month: "Fév", attributions: 98 },
  { month: "Avr", attributions: 132 },
  { month: "Juin", attributions: 189 },
  { month: "Août", attributions: 134 },
  { month: "Oct", attributions: 201 },
  { month: "Déc", attributions: 195 },
]

export default function Dashboard() {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Layout>
      <div className="p-8  min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord Administrateur</h1>
          <p className="text-slate-600 mt-2">Système de Gestion des Équipements de Protection Individuelle (EPI)</p>
        </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("fr-FR")}</span>
          </div>
          </div>
        </div>
  
        {/* Cartes de graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Répartition par Rôle */}
          <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
            <div className="mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-[#D31E25]" />
              <h2 className="text-xl font-semibold text-[#1E2D59]">Répartition par Rôle</h2>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              Distribution des utilisateurs par rôle dans le système
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-white p-3 border rounded-lg shadow-md">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-sm text-gray-600">
                            {payload[0].payload.value} utilisateurs
                          </p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          {/* Affectations Mensuelles */}
          <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
            <div className="mb-4 flex items-center">
              <Package className="h-6 w-6 mr-2 text-[#D31E25]" />
              <h2 className="text-xl font-semibold text-[#1E2D59]">Affectations Mensuelles</h2>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              Évolution du nombre d'affectations d'équipements par mois
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={affectationsData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#666" }} domain={[0, 120]} />
                  <ChartTooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="bg-white p-3 border rounded-lg shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-[#D31E25]">
                            {payload[0].value} affectations
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="affectations" fill="#D31E25" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          {/* Attributions Mensuelles */}
          <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
            <div className="mb-4 flex items-center">
              <ClipboardList className="h-6 w-6 mr-2 text-[#1E2D59]" />
              <h2 className="text-xl font-semibold text-[#1E2D59]">Attributions Mensuelles</h2>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              Évolution du nombre d'attributions aux employés par mois
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attributionsData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#666" }} domain={[0, 240]} />
                  <ChartTooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="bg-white p-3 border rounded-lg shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-[#1E2D59]">
                            {payload[0].value} attributions
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="attributions" fill="#1E2D59" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
  
}
