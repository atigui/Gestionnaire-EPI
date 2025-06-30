"use client"

import { useState } from "react"
import { Package, AlertTriangle, CheckCircle } from "lucide-react"
import { useAffecteurStore } from "../../lib/use-affecteur-store"
import Layout from "../layout/layout-affectant"

// Imports directs des composants UI
import { Card } from "../ui/card"
import { CardContent } from "../ui/card"
import { CardHeader } from "../ui/card"
import { CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"

export function StockCategorie() {
  const [selectedCategorie, setSelectedCategorie] = useState("")

  // Utiliser le store pour accéder aux données
  const { categories, stockByCategory } = useAffecteurStore()

  const getStockStatus = (quantite: number, seuil: number) => {
    if (quantite <= seuil * 0.5) {
      return { status: "critique", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    } else if (quantite <= seuil) {
      return { status: "faible", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
    } else {
      return { status: "normal", color: "bg-green-100 text-green-800", icon: CheckCircle }
    }
  }

  const currentStock = selectedCategorie ? stockByCategory[selectedCategorie] || [] : []

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Consultation du Stock par Catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="categorie">Sélectionner une catégorie</Label>
                <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                  <SelectTrigger className="w-full md:w-1/3">
                    <SelectValue placeholder="Choisir une catégorie..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                        key={cat}
                        value={cat}
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategorie && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Stock - {selectedCategorie}</h3>
                    <div className="text-sm text-gray-500">{currentStock.length} article(s) dans cette catégorie</div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom du matériel</TableHead>
                          <TableHead>Quantité disponible</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Dernière mise à jour</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentStock.map((item) => {
                          const stockStatus = getStockStatus(item.quantiteDisponible, item.seuil)
                          const StatusIcon = stockStatus.icon

                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.nom}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-semibold">{item.quantiteDisponible}</span>
                                  <span className="text-sm text-gray-500">unités</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={stockStatus.color}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {stockStatus.status === "critique"
                                    ? "Stock critique"
                                    : stockStatus.status === "faible"
                                      ? "Stock faible"
                                      : "Stock normal"}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(item.derniereMiseAJour).toLocaleDateString("fr-FR")}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {currentStock.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Aucun matériel trouvé dans cette catégorie.</div>
                  )}
                </div>
              )}

              {!selectedCategorie && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>Sélectionnez une catégorie pour consulter le stock disponible.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
