"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Plus, Search, Edit, Trash2, Tag, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import Layout from "../layout/layout"

interface Category {
  id: number
  nom: string
  description: string
  dateCreation: string
}

const initialCategories: Category[] = [
  {
    id: 1,
    nom: "Casque",
    description: " Protection de la tête",
    dateCreation: "2024-01-10",
  },
  {
    id: 2,
    nom: "Gants",
    description: " Protection de mains",
    dateCreation: "2024-01-10",
  },
  {
    id: 3,
    nom: " Chaussures",
    description: "Protection des pieds",
    dateCreation: "2024-01-10",
  },
  {
    id: 4,
    nom: " gilets",
    description: "Protection du corps",
    dateCreation: "2024-01-15",
  },
  {
    id: 5,
    nom: "Masques anti-poussière",
    description: "Protection respiratoire",
    dateCreation: "2024-01-20",
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ nom: "", description: "" })
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const CATEGORIES_PER_PAGE = 3

  const filteredCategories = categories.filter(
    (category) =>
      category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE)
  const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE
  const endIndex = startIndex + CATEGORIES_PER_PAGE
  const currentCategories = filteredCategories.slice(startIndex, endIndex)

  // Réinitialiser la page quand on filtre
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleAddCategory = () => {
    if (!formData.nom.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est obligatoire",
        variant: "destructive",
      })
      return
    }

    const newCategory: Category = {
      id: Math.max(...categories.map((c) => c.id)) + 1,
      nom: formData.nom,
      description: formData.description,
      dateCreation: new Date().toISOString().split("T")[0],
    }

    setCategories([...categories, newCategory])
    setFormData({ nom: "", description: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "Catégorie ajoutée avec succès",
    })
  }

  const handleEditCategory = () => {
    if (!formData.nom.trim() || !editingCategory) return

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id ? { ...cat, nom: formData.nom, description: formData.description } : cat,
    )

    setCategories(updatedCategories)
    setFormData({ nom: "", description: "" })
    setEditingCategory(null)
    setIsEditDialogOpen(false)
    toast({
      title: "Succès",
      description: "Catégorie modifiée avec succès",
    })
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id))
    toast({
      title: "Succès",
      description: "Catégorie supprimée avec succès",
    })

    // Ajuster la page si nécessaire
    const newFilteredCategories = categories.filter((cat) => cat.id !== id)
    const newTotalPages = Math.ceil(newFilteredCategories.length / CATEGORIES_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({ nom: category.nom, description: category.description })
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({ nom: "", description: "" })
    setIsAddDialogOpen(true)
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
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Catégories</h1>
          <p className="text-slate-600 mt-2">Organiser les matériels par catégories d'EPI</p>
        </div>
        <Button onClick={openAddDialog} className="bg-menara-red hover:bg-menara-red/90 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Catégorie
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des catégories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste des Catégories ({filteredCategories.length})</span>
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
                <TableHead>Description</TableHead>
                <TableHead>Date de Création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.nom}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{category.description}</p>
                  </TableCell>
                  
                  <TableCell>{new Date(category.dateCreation).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Ajouter une Catégorie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom de la catégorie *</Label>
              <Input
                id="nom"
                placeholder="Ex: gilets"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de la catégorie"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddCategory} className="bg-menara-red hover:bg-menara-red text-white">
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2  text-menara-red" />
              Modifier la catégorie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nom">Nom de la catégorie *</Label>
              <Input
                id="edit-nom"
                placeholder="Ex: gilets"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Description de la catégorie"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditCategory} className="bg-menara-red hover:bg-menara-red/90 text-white">
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
