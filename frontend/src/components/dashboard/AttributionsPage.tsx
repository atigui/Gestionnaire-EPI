"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import {
  Search,
  Eye,
  Download,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { useAttributions, useModificationLogs, useEPIUtils, type Attribution } from "../../lib/epi-store"
import { MaterielEditor } from "../../lib/materiel-editor"
import { generateAnnualPDF } from "../../utils/pdf-generator"
import Layout from "../layout/layout"

const ITEMS_PER_PAGE = 3

export default function AttributionsPage() {
  const { attributions, updateAttribution, deleteAttribution } = useAttributions()
  const { modificationLogs, addModificationLog } = useModificationLogs()
  const { getUniqueMonths, prepareMaterielsForEdit, cleanMaterielsForSave } = useEPIUtils()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAttribution, setSelectedAttribution] = useState<Attribution | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingAttribution, setEditingAttribution] = useState<Attribution | null>(null)
  const [deletingAttribution, setDeletingAttribution] = useState<Attribution | null>(null)

  // Filtrer les attributions par recherche et mois
  const filteredAttributions = attributions.filter((attribution) => {
    const matchesSearch =
      attribution.magasinier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attribution.employe.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attribution.employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attribution.employe.prenom.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesMonth = true
    if (selectedMonth !== "all") {
      const date = new Date(attribution.dateAttribution)
      const attributionMonth = `${date.getFullYear()}-${date.getMonth() + 1}`
      matchesMonth = attributionMonth === selectedMonth
    }

    return matchesSearch && matchesMonth
  })

  // Pagination
  const totalPages = Math.ceil(filteredAttributions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAttributions = filteredAttributions.slice(startIndex, endIndex)

  const handleViewDetails = (attribution: Attribution) => {
    setSelectedAttribution(attribution)
    setIsDetailDialogOpen(true)
  }

  const handleDownloadPdf = (employe: any) => {
    generateAnnualPDF(employe, 2024, attributions)
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

  const uniqueMonths = getUniqueMonths(attributions, "dateAttribution")

  const handleEditAttribution = (attribution: Attribution) => {
    setEditingAttribution({
      ...attribution,
      materiels: prepareMaterielsForEdit(attribution.materiels),
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteAttribution = (attribution: Attribution) => {
    setDeletingAttribution(attribution)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteAttribution = () => {
    if (deletingAttribution) {
      deleteAttribution(deletingAttribution.id)
      addModificationLog({
        itemId: deletingAttribution.id,
        itemType: "attribution",
        type: "suppression",
        utilisateur: "Admin",
        details: `Suppression de l'attribution #${deletingAttribution.id}`,
      })
      setIsDeleteDialogOpen(false)
      setDeletingAttribution(null)
    }
  }

  const handleSaveEdit = () => {
    if (editingAttribution) {
      const cleanedAttribution = {
        ...editingAttribution,
        materiels: cleanMaterielsForSave(editingAttribution.materiels),
      }

      updateAttribution(cleanedAttribution)
      addModificationLog({
        itemId: editingAttribution.id,
        itemType: "attribution",
        type: "modification",
        utilisateur: "Admin",
        details: `Modification de l'attribution #${editingAttribution.id}`,
      })

      setIsEditDialogOpen(false)
      setEditingAttribution(null)
    }
  }

  return (
    <Layout>
    <div className="min-h-screen ">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Consultation des Attributions</h1>
            <p className="text-slate-600 mt-2">Visualiser toutes les attributions effectuées par les Magasiniers</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par magasinier, employé ou matricule..."
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

        {/* Attributions Table */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>Liste des Attributions ({filteredAttributions.length})</span>
                {totalPages > 1 && (
                  <div className="text-sm text-slate-600">
                    Page {currentPage} sur {totalPages}
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Attribution</TableHead>
                  <TableHead>Date Attribution</TableHead>
                  <TableHead>Matériels</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAttributions.length > 0 ? (
                  currentAttributions.map((attribution) => (
                    <TableRow key={attribution.id}>
                      <TableCell>
                        <span className="font-mono font-medium">#{attribution.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                          {new Date(attribution.dateAttribution).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400 text-black">
                          {attribution.materiels.length} matériels
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(attribution)}
                            className="text-gray-600 hover:text-gray-800 hover:bg-blue-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAttribution(attribution)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAttribution(attribution)}
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
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      Aucune attribution trouvée pour les critères sélectionnés
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
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-800">
                <FileText className="h-5 w-5 mr-2 text-red-800"/>
                Détails de l'Attribution #{selectedAttribution?.id}
                
              </DialogTitle>
            </DialogHeader>
            {selectedAttribution && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Magasinier:</span>
                        <span className="font-medium">{selectedAttribution.magasinier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date attribution:</span>
                        <span className="font-medium">
                          {new Date(selectedAttribution.dateAttribution).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Employé bénéficiaire</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Matricule:</span>
                        <span className="font-medium font-mono">{selectedAttribution.employe.matricule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Nom complet:</span>
                        <span className="font-medium">
                          {selectedAttribution.employe.prenom} {selectedAttribution.employe.nom}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Poste:</span>
                        <span className="font-medium">{selectedAttribution.employe.poste}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => handleDownloadPdf(selectedAttribution.employe)}
                        className="w-full bg-red-800 hover:bg-slate-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger Fiche PDF
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Matériels attribués</h4>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matériel</TableHead>
                          <TableHead className="text-center">Quantité</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAttribution.materiels.map((materiel, index) => (
                          <TableRow key={index}>
                            <TableCell>{materiel.nom}</TableCell>
                            <TableCell className="text-center font-medium">{materiel.quantite}</TableCell>
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
                <Edit className="h-5 w-5 mr-2 text-red-800"/>
                Modifier l'Attribution #{editingAttribution?.id}
              </DialogTitle>
            </DialogHeader>
            {editingAttribution && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="magasinier">Magasinier</Label>
                      <Input
                        id="magasinier"
                        value={editingAttribution.magasinier}
                        onChange={(e) =>
                          setEditingAttribution({
                            ...editingAttribution,
                            magasinier: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateAttribution">Date d'attribution</Label>
                      <Input
                        id="dateAttribution"
                        type="date"
                        value={editingAttribution.dateAttribution}
                        onChange={(e) =>
                          setEditingAttribution({
                            ...editingAttribution,
                            dateAttribution: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="matricule">Matricule employé</Label>
                      <Input
                        id="matricule"
                        value={editingAttribution.employe.matricule}
                        onChange={(e) =>
                          setEditingAttribution({
                            ...editingAttribution,
                            employe: { ...editingAttribution.employe, matricule: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          value={editingAttribution.employe.nom}
                          onChange={(e) =>
                            setEditingAttribution({
                              ...editingAttribution,
                              employe: { ...editingAttribution.employe, nom: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                          id="prenom"
                          value={editingAttribution.employe.prenom}
                          onChange={(e) =>
                            setEditingAttribution({
                              ...editingAttribution,
                              employe: { ...editingAttribution.employe, prenom: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="poste">Poste</Label>
                      <Input
                        id="poste"
                        value={editingAttribution.employe.poste}
                        onChange={(e) =>
                          setEditingAttribution({
                            ...editingAttribution,
                            employe: { ...editingAttribution.employe, poste: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <MaterielEditor
                  materiels={editingAttribution.materiels}
                  onMaterielsChange={(materiels) => setEditingAttribution({ ...editingAttribution, materiels })}
                />

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
                    Annuler
                  </Button>
                  <Button onClick={handleSaveEdit} className="bg-red-600 hover:bg-red-700">
                    Sauvegarder les modifications
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirmer la suppression
              </DialogTitle>
            </DialogHeader>
            {deletingAttribution && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 mb-2">
                    Vous êtes sur le point de supprimer définitivement cette attribution :
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>ID :</strong> #{deletingAttribution.id}
                    </p>
                    <p>
                      <strong>Employé :</strong> {deletingAttribution.employe.prenom} {deletingAttribution.employe.nom}
                    </p>
                    <p>
                      <strong>Date :</strong>{" "}
                      {new Date(deletingAttribution.dateAttribution).toLocaleDateString("fr-FR")}
                    </p>
                    <p>
                      <strong>Matériels :</strong> {deletingAttribution.materiels.length} éléments
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Cette action est irréversible. Toutes les données associées seront perdues.
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    📄 Le PDF sera automatiquement mis à jour après suppression.
                  </p>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={confirmDeleteAttribution} className="bg-red-600 hover:bg-red-700 text-white">
                    Confirmer la suppression
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </Layout>
  )
}
