"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Plus, Search, Edit, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import Layout from "../layout/layout"

interface Material {
  id: number
  nom: string
  categorieId: number
  categorieName: string
  dateAjout: string
}

interface Category {
  id: number
  nom: string
}

const categories: Category[] = [
  { id: 1, nom: "gilets" },
  { id: 2, nom: "Chaussures" },
  { id: 3, nom: "Gants" },
  { id: 4, nom: "Masques anti-poussière" },
  { id: 5, nom: "Casques" },
]

const initialMaterials: Material[] = [
  {
    id: 1,
    nom: "Standard",
    categorieId: 1,
    categorieName: "Casques",
    dateAjout: "2024-01-15",
  },
  {
    id: 2,
    nom: "Standard",
    categorieId: 2,
    categorieName: "Gants",
    dateAjout: "2024-01-20",
  },
  {
    id: 3,
    nom: " Taille 41",
    categorieId: 3,
    categorieName: "Chaussures",
    dateAjout: "2024-02-01",
  },
  {
    id: 4,
    nom: " Taille XL",
    categorieId: 4,
    categorieName: "Gilets",
    dateAjout: "2024-02-05",
  },
]

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    categorieId: "",
  })
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const MATERIALS_PER_PAGE = 3

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || material.categorieId.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / MATERIALS_PER_PAGE)
  const startIndex = (currentPage - 1) * MATERIALS_PER_PAGE
  const endIndex = startIndex + MATERIALS_PER_PAGE
  const currentMaterials = filteredMaterials.slice(startIndex, endIndex)

  // Réinitialiser la page quand on filtre
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleAddMaterial = () => {
    if (!formData.nom.trim() || !formData.categorieId) {
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
        variant: "destructive",
      })
      return
    }

    const category = categories.find((c) => c.id.toString() === formData.categorieId)
    if (!category) return

    const newMaterial: Material = {
      id: Math.max(...materials.map((m) => m.id)) + 1,
      nom: formData.nom,
      categorieId: Number.parseInt(formData.categorieId),
      categorieName: category.nom,
      dateAjout: new Date().toISOString().split("T")[0],
    }

    setMaterials([...materials, newMaterial])
    setFormData({ nom: "", categorieId: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "Matériel ajouté avec succès",
    })
  }

  const handleEditMaterial = () => {
    if (!formData.nom.trim() || !formData.categorieId || !editingMaterial) return

    const category = categories.find((c) => c.id.toString() === formData.categorieId)
    if (!category) return

    const updatedMaterials = materials.map((mat) =>
      mat.id === editingMaterial.id
        ? {
            ...mat,
            nom: formData.nom,
            categorieId: Number.parseInt(formData.categorieId),
            categorieName: category.nom,
          }
        : mat,
    )

    setMaterials(updatedMaterials)
    setFormData({ nom: "", categorieId: "" })
    setEditingMaterial(null)
    setIsEditDialogOpen(false)
    toast({
      title: "Succès",
      description: "Matériel modifié avec succès",
    })
  }

  const handleDeleteMaterial = (id: number) => {
    setMaterials(materials.filter((mat) => mat.id !== id))
    toast({
      title: "Succès",
      description: "Matériel supprimé avec succès",
    })

    // Ajuster la page si nécessaire
    const newFilteredMaterials = materials.filter((mat) => mat.id !== id)
    const newTotalPages = Math.ceil(newFilteredMaterials.length / MATERIALS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  const openAddDialog = () => {
    setFormData({ nom: "", categorieId: "" })
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      nom: material.nom,
      categorieId: material.categorieId.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <Layout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Matériels</h1>
          <p className="text-slate-600 mt-2">Gérer les équipements de protection individuelle</p>
        </div>
        <Button onClick={openAddDialog} className="bg-menara-red hover:bg-menara-red/90 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Matériel
        </Button>
      </div>
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un matériel..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem  className= "hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800" key={category.id} value={category.id.toString()}>
                    {category.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste des Matériels ({filteredMaterials.length})</span>
            <span className="text-sm font-normal text-slate-500">
              Page {currentPage} sur {totalPages}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date d'ajout</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.nom}</TableCell>
                  <TableCell>{material.categorieName}</TableCell>
                  <TableCell>{new Date(material.dateAjout).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(material)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Dialog d'ajout */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Ajouter un Matériel
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom du matériel *</Label>
              <Input
                id="nom"
                placeholder="Ex: Standard"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={formData.categorieId}
                onValueChange={(value) => setFormData({ ...formData, categorieId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddMaterial} className="bg-menara-red hover:bg-menara-red text-white">
                Ajouter le matériel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2 text-menara-red" />
              Modifier le Matériel
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nom">Nom du matériel *</Label>
              <Input
                id="edit-nom"
                placeholder="Ex: Standard"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-categorie">Catégorie *</Label>
              <Select
                value={formData.categorieId}
                onValueChange={(value) => setFormData({ ...formData, categorieId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditMaterial} className="bg-menara-red hover:bg-menara-red/90 text-white">
                Modifier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </Layout>
  )
}
