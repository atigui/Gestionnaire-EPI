"use client"

import { useState } from "react"
import { Eye, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useAffecteurStore, type Affectation } from "../../lib/use-affecteur-store"
import Layout from "../layout/layout-affectant"

// Imports directs des composants UI
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { CardContent } from "../ui/card"
import { CardHeader } from "../ui/card"
import { CardTitle } from "../ui/card"
import { CardFooter } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"

export function MesAffectations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMagasinier, setSelectedMagasinier] = useState("all")
  const [selectedMois, setSelectedMois] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedAffectation, setSelectedAffectation] = useState<Affectation | null>(null)

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const affectationsPerPage = 3

  // Utiliser le store pour accéder aux données
  const { affectations, magasiniers } = useAffecteurStore()

  const mois = [
    { value: "2024-12", label: "Décembre 2024" },
    { value: "2024-11", label: "Novembre 2024" },
    { value: "2024-10", label: "Octobre 2024" },
  ]

  const filteredAffectations = affectations.filter((affectation) => {
    const matchesSearch =
      affectation.magasinier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affectation.emplacement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affectation.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMagasinier = selectedMagasinier === "all" || affectation.magasinier === selectedMagasinier
    const matchesMois = selectedMois === "all" || affectation.date.startsWith(selectedMois)

    return matchesSearch && matchesMagasinier && matchesMois
  })

  // Calcul pour la pagination
  const totalPages = Math.ceil(filteredAffectations.length / affectationsPerPage)
  const indexOfLastAffectation = currentPage * affectationsPerPage
  const indexOfFirstAffectation = indexOfLastAffectation - affectationsPerPage
  const currentAffectations = filteredAffectations.slice(indexOfFirstAffectation, indexOfLastAffectation)

  // Fonctions de navigation de pagination
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const viewDetails = (affectation: Affectation) => {
    setSelectedAffectation(affectation)
    setDetailOpen(true)
  }

  // Réinitialiser la page actuelle lorsque les filtres changent
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  return (
    <Layout>
      <div className="space-y-6 mt-6 mr-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Mes Affectations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Recherche</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        handleFilterChange()
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="magasinier">Magasinier</Label>
                  <Select
                    value={selectedMagasinier}
                    onValueChange={(value) => {
                      setSelectedMagasinier(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les magasiniers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="all"
                        className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                      >
                        Tous les magasiniers
                      </SelectItem>
                      {magasiniers.map((mag) => (
                        <SelectItem
                          key={mag}
                          value={mag}
                          className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                        >
                          {mag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mois">Période</Label>
                  <Select
                    value={selectedMois}
                    onValueChange={(value) => {
                      setSelectedMois(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les périodes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="all"
                        className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                      >
                        Toutes les périodes
                      </SelectItem>
                      {mois.map((m) => (
                        <SelectItem
                          key={m.value}
                          value={m.value}
                          className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                        >
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={handleFilterChange}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Magasinier</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAffectations.map((affectation) => (
                      <TableRow key={affectation.id}>
                        <TableCell className="font-medium">{affectation.id}</TableCell>
                        <TableCell>{affectation.magasinier}</TableCell>
                        <TableCell>{affectation.emplacement}</TableCell>
                        <TableCell>{new Date(affectation.date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDetails(affectation)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Détail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredAffectations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune affectation trouvée avec les critères sélectionnés.
                </div>
              )}
            </div>
          </CardContent>

          {/* Pagination */}
          {filteredAffectations.length > 0 && (
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="text-sm text-gray-500">
                Affichage de {indexOfFirstAffectation + 1} à{" "}
                {Math.min(indexOfLastAffectation, filteredAffectations.length)} sur {filteredAffectations.length}{" "}
                affectations
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} sur {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Dialogue de détail d'affectation */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Détail de l'affectation {selectedAffectation?.id}</span>
              </DialogTitle>
              <DialogDescription asChild>
                <div className="text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-4 mt-2 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Magasinier</span>
                      <div className="text-sm font-semibold">{selectedAffectation?.magasinier}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date</span>
                      <div className="text-sm font-semibold">
                        {selectedAffectation?.date
                          ? new Date(selectedAffectation.date).toLocaleDateString("fr-FR")
                          : ""}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-gray-500">Emplacement</span>
                      <div className="text-sm font-semibold">{selectedAffectation?.emplacement}</div>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Matériel</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedAffectation?.materiels.map((materiel, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{materiel.categorie}</TableCell>
                      <TableCell className="font-medium text-sm">{materiel.nom}</TableCell>
                      <TableCell className="text-right text-sm">{materiel.quantite}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-right">
              <span className="text-sm font-medium text-gray-700">
                Total: {selectedAffectation?.materiels.reduce((sum, m) => sum + m.quantite, 0)} unités
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
