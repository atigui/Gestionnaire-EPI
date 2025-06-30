"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { Search, Eye, FileText, Calendar, ChevronLeft, ChevronRight, Edit, Trash2, History } from "lucide-react"
import Layout from "../layout/layout"
import { useAffectations, useModificationLogs, useEPIUtils, type Affectation } from "../../lib/epi-store"
import { MaterielEditor } from "../../lib/materiel-editor"

const ITEMS_PER_PAGE = 5

export default function AffectationsPage() {
  const { affectations, updateAffectation, deleteAffectation } = useAffectations()
  const { modificationLogs, addModificationLog } = useModificationLogs()
  const { getUniqueMonths, prepareMaterielsForEdit, cleanMaterielsForSave } = useEPIUtils()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAffectation, setSelectedAffectation] = useState<Affectation | null>(null)
  const [editingAffectation, setEditingAffectation] = useState<Affectation | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [affectationToDelete, setAffectationToDelete] = useState<Affectation | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState("all")

  // Filtrer les affectations actives par recherche et mois
  const activeAffectations = affectations.filter((affectation) => affectation.statut === "active")

  const filteredAffectations = activeAffectations.filter((affectation) => {
    const matchesSearch =
      affectation.id.toString().includes(searchTerm) ||
      affectation.dateAffectation.includes(searchTerm) ||
      affectation.affecteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affectation.magasinier.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesMonth = true
    if (selectedMonth !== "all") {
      const date = new Date(affectation.dateAffectation)
      const affectationMonth = `${date.getFullYear()}-${date.getMonth() + 1}`
      matchesMonth = affectationMonth === selectedMonth
    }

    return matchesSearch && matchesMonth
  })

  // Pagination
  const totalPages = Math.ceil(filteredAffectations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAffectations = filteredAffectations.slice(startIndex, endIndex)

  const handleViewDetails = (affectation: Affectation) => {
    setSelectedAffectation(affectation)
    setIsDetailDialogOpen(true)
  }

  const handleEditAffectation = (affectation: Affectation) => {
    setEditingAffectation({
      ...affectation,
      materiels: prepareMaterielsForEdit(affectation.materiels),
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteAffectation = (affectation: Affectation) => {
    setAffectationToDelete(affectation)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (affectationToDelete) {
      deleteAffectation(affectationToDelete.id)
      addModificationLog({
        itemId: affectationToDelete.id,
        itemType: "affectation",
        type: "suppression",
        utilisateur: "Admin",
        details: `Suppression de l'affectation #${affectationToDelete.id}`,
      })
      setIsDeleteDialogOpen(false)
      setAffectationToDelete(null)
    }
  }

  const saveEditedAffectation = () => {
    if (editingAffectation) {
      const cleanedAffectation = {
        ...editingAffectation,
        materiels: cleanMaterielsForSave(editingAffectation.materiels),
        nombreMateriels: editingAffectation.materiels.reduce((sum, m) => sum + m.quantite, 0),
      }

      updateAffectation(cleanedAffectation)
      addModificationLog({
        itemId: editingAffectation.id,
        itemType: "affectation",
        type: "modification",
        utilisateur: "Admin",
        details: `Modification de l'affectation #${editingAffectation.id}`,
      })

      setIsEditDialogOpen(false)
      setEditingAffectation(null)
    }
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFilterChange()
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    handleFilterChange()
  }

  const uniqueMonths = getUniqueMonths(activeAffectations, "dateAffectation")

  return (
    <Layout>
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestion des Affectations</h1>
              <p className="text-slate-600 mt-2">Consulter, modifier et supprimer les affectations</p>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par ID, date, affecteur ou magasinier..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select value={selectedMonth} onValueChange={handleMonthChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par mois" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les mois</SelectItem>
                      {uniqueMonths.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affectations Table */}
          <Card className="shadow-sm">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Affectations ({filteredAffectations.length})</CardTitle>
                {totalPages > 1 && (
                  <div className="text-sm text-slate-600">
                    Page {currentPage} sur {totalPages}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Affectation</TableHead>
                    <TableHead>Date d'Affectation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAffectations.length > 0 ? (
                    currentAffectations.map((affectation) => (
                      <TableRow key={affectation.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-slate-400 mr-2" />
                            <span className="font-medium">#{affectation.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                            {new Date(affectation.dateAffectation).toLocaleDateString("fr-FR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(affectation)}
                              title="Voir les détails"
                               className="text-gray-600 hover:text-gray-800 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAffectation(affectation)}
                              title="Modifier"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAffectation(affectation)}
                              title="Supprimer"
                               className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                        Aucune affectation trouvée pour les critères sélectionnés
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>

                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-slate-800 text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detail Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center text-red-800">
                  <FileText className="h-5 w-5 mr-2 text-red-800 " />
                  Détails de l'Affectation #{selectedAffectation?.id}
                </DialogTitle>
              </DialogHeader>
              {selectedAffectation && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Informations générales</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Affecteur:</span>
                          <span className="font-medium">{selectedAffectation.affecteur}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Magasinier:</span>
                          <span className="font-medium">{selectedAffectation.magasinier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Emplacement:</span>
                          <span className="font-medium">{selectedAffectation.emplacement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date:</span>
                          <span className="font-medium">
                            {new Date(selectedAffectation.dateAffectation).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Nombre de matériels:</span>
                          <span className="font-medium">{selectedAffectation.nombreMateriels}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Matériels affectés</h4>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Matériel</TableHead>
                            <TableHead className="text-right">Quantité</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAffectation.materiels.map((materiel, index) => (
                            <TableRow key={index}>
                              <TableCell>{materiel.nom}</TableCell>
                              <TableCell className="text-right font-medium">{materiel.quantite}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center text-red-800">
                  <Edit className="h-5 w-5 mr-2 text-red-800 "/>
                  Modifier l'Affectation #{editingAffectation?.id}
                </DialogTitle>
              </DialogHeader>
              {editingAffectation && (
                <div className="space-y-4 ">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="affecteur">Affecteur</Label>
                      <Input
                        id="affecteur"
                        value={editingAffectation.affecteur}
                        onChange={(e) => setEditingAffectation({ ...editingAffectation, affecteur: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="magasinier">Magasinier</Label>
                      <Input
                        id="magasinier"
                        value={editingAffectation.magasinier}
                        onChange={(e) => setEditingAffectation({ ...editingAffectation, magasinier: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emplacement">Emplacement</Label>
                      <Input
                        id="emplacement"
                        value={editingAffectation.emplacement}
                        onChange={(e) => setEditingAffectation({ ...editingAffectation, emplacement: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateAffectation">Date d'affectation</Label>
                      <Input
                        id="dateAffectation"
                        type="date"
                        value={editingAffectation.dateAffectation}
                        onChange={(e) =>
                          setEditingAffectation({ ...editingAffectation, dateAffectation: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <MaterielEditor
                    materiels={editingAffectation.materiels}
                    onMaterielsChange={(materiels) => setEditingAffectation({ ...editingAffectation, materiels })}
                  />
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}
                  className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
                  Annuler
                </Button>
                <Button onClick={saveEditedAffectation}>Enregistrer les modifications</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer l'affectation #{affectationToDelete?.id} ? Cette action sera
                  enregistrée dans l'historique des modifications.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Layout>
  )
}
