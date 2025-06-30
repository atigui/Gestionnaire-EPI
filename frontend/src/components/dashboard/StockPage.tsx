"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Plus, Package, Search, Filter, X, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import Layout from "../layout/layout"

interface Material {
  id: number
  nom: string
  quantite: number
  categorieId: number
  categorieName: string
}

interface Category {
  id: number
  nom: string
  description: string
  materiels: Material[]
}

const initialMaterials: Material[] = [
  { id: 1, nom: "Standard", quantite: 150, categorieId: 1, categorieName: "Casques" },
  { id: 2, nom: "T40", quantite: 75, categorieId: 3, categorieName: "Chaussures" },
  { id: 3, nom: "Taille L", quantite: 200, categorieId: 2, categorieName: "Gants" },
  { id: 4, nom: "Taille M", quantite: 45, categorieId: 2, categorieName: "Gants " },
  { id: 5, nom: "T42", quantite: 80, categorieId: 3, categorieName: "Chaussures" },
  { id: 6, nom: "T39", quantite: 35, categorieId: 3, categorieName: "Chaussures" },
  { id: 7, nom: "Taille XL", quantite: 120, categorieId: 4, categorieName: "Gilets" },
  { id: 8, nom: "Taille S", quantite: 60, categorieId: 4, categorieName: "Gilets" },
  { id: 9, nom: "Standard", quantite: 300, categorieId: 5, categorieName: "Masques anti-poussière" },
  { id: 10, nom: "Standard", quantite: 25, categorieId: 6, categorieName: "Lunettes" },
  { id: 11, nom: "Taille XXL", quantite: 15, categorieId: 7, categorieName: "Gilets" },
  { id: 12, nom: "T38", quantite: 90, categorieId: 3, categorieName: "Chaussures" },
  { id: 13, nom: "Taille XXL", quantite: 180, categorieId: 2, categorieName: "Gilets" },
  { id: 14, nom: "T43", quantite: 55, categorieId: 3, categorieName: "Chaussures" },
]

const categoriesData = [
  { id: 1, nom: "Casques", description: "Protection de la tête" },
  { id: 2, nom: "Gants", description: "Protection des mains" },
  { id: 3, nom: "Chaussures", description: "Protection des pieds" },
  { id: 4, nom: "Gilets", description: "Protection de corps " },
  {
    id: 5,
    nom: "Masques anti-poussière",
    description: "Protection respiratoire",
  },
  { id: 6, nom: "Lunettes ", description: "Protection des yeux" },
  
]

const stockLevels = [
  { value: "all", label: "Tous les niveaux" },
  { value: "critical", label: "Critique (< 30)" },
  { value: "low", label: "Faible (30-49)" },
  { value: "normal", label: "Normal (50-99)" },
  { value: "high", label: "Élevé (≥ 100)" },
]

const ITEMS_PER_PAGE = 3

export default function StockPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [quantiteAjouter, setQuantiteAjouter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStockLevel, setFilterStockLevel] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const [isOpenCategories, setIsOpenCategories] = useState(categoriesData.map(() => true)) // Par défaut ouvert

  // Fonction pour filtrer les matériels
  const getFilteredMaterials = () => {
    let filtered = materials

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (material) =>
          material.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.categorieName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtre par catégorie
    if (filterCategory !== "all") {
      filtered = filtered.filter((material) => material.categorieId.toString() === filterCategory)
    }

    // Filtre par niveau de stock
    if (filterStockLevel !== "all") {
      filtered = filtered.filter((material) => {
        switch (filterStockLevel) {
          case "critical":
            return material.quantite < 30
          case "low":
            return material.quantite >= 30 && material.quantite < 50
          case "normal":
            return material.quantite >= 50 && material.quantite < 100
          case "high":
            return material.quantite >= 100
          default:
            return true
        }
      })
    }

    return filtered
  }

  // Grouper les matériels filtrés par catégorie
  const categoriesWithMaterials: Category[] = categoriesData
    .map((category) => ({
      ...category,
      materiels: getFilteredMaterials().filter((material) => material.categorieId === category.id),
    }))
    .filter((category) => category.materiels.length > 0)

  // Pagination
  const totalPages = Math.ceil(categoriesWithMaterials.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentCategories = categoriesWithMaterials.slice(startIndex, endIndex)

  // Fonction pour gérer la sélection du matériel et auto-sélectionner la catégorie
  const handleMaterialSelection = (materialId: string) => {
    setSelectedMaterial(materialId)

    if (materialId) {
      const material = materials.find((m) => m.id.toString() === materialId)
      if (material) {
        setSelectedCategory(material.categorieId.toString())
      }
    } else {
      setSelectedCategory("")
    }
  }

  const handleAddStock = () => {
    if (!selectedMaterial || !quantiteAjouter) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un matériel et saisir une quantité",
        variant: "destructive",
      })
      return
    }

    const quantite = Number.parseInt(quantiteAjouter)
    if (quantite <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité doit être supérieure à 0",
        variant: "destructive",
      })
      return
    }

    const updatedMaterials = materials.map((material) =>
      material.id.toString() === selectedMaterial ? { ...material, quantite: material.quantite + quantite } : material,
    )

    setMaterials(updatedMaterials)
    setSelectedMaterial("")
    setSelectedCategory("")
    setQuantiteAjouter("")
    setIsAddStockDialogOpen(false)

    const materialName = materials.find((m) => m.id.toString() === selectedMaterial)?.nom
    toast({
      title: "Succès",
      description: `${quantite} unités ajoutées au stock de ${materialName}`,
    })
  }

  const openAddStockDialog = () => {
    setSelectedMaterial("")
    setSelectedCategory("")
    setQuantiteAjouter("")
    setIsAddStockDialogOpen(true)
  }

  const getStockStatus = (quantite: number) => {
    if (quantite < 30) return { color: "text-red-600", bgColor: "bg-red-50", label: "Critique", icon: AlertTriangle }
    if (quantite < 50)
      return { color: "text-orange-600", bgColor: "bg-orange-50", label: "Faible", icon: AlertTriangle }
    if (quantite < 100) return { color: "text-blue-600", bgColor: "bg-blue-50", label: "Normal", icon: Package }
    return { color: "text-green-600", bgColor: "bg-green-50", label: "Élevé", icon: Package }
  }

  const clearFilters = () => {
    setFilterCategory("all")
    setFilterStockLevel("all")
    setSearchTerm("")
    setCurrentPage(1)
  }

  const hasActiveFilters = filterCategory !== "all" || filterStockLevel !== "all" || searchTerm !== ""

  // Reset page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1)
    if (filterType === "category") {
      setFilterCategory(value)
    } else if (filterType === "stock") {
      setFilterStockLevel(value)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const toggleCategory = (index: number) => {
    const newIsOpenCategories = [...isOpenCategories]
    newIsOpenCategories[index] = !newIsOpenCategories[index]
    setIsOpenCategories(newIsOpenCategories)
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
        
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestion du Stock </h1>
              <p className="text-slate-600 mt-1">Gérez efficacement le stock des équipements de protection</p>
            </div>
          </div>
          <Button onClick={openAddStockDialog} className="bg-menara-red hover:bg-menara-red/90 text-white" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Ajouter du Stock
          </Button>
        </div>

        {/* Section de filtres */}
        <Card className="shadow-sm">

          <CardContent className="p-6 space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un matériel ou une catégorie..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Filtres en ligne */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtre par catégorie */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Catégorie</Label>
                <Select value={filterCategory} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">Toutes les catégories</SelectItem>
                     {categoriesData.map((category) => (
                      <SelectItem className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800" key={category.id} value={category.id.toString()}>
                        {category.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par niveau de stock */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Niveau de stock</Label>
                <Select value={filterStockLevel} onValueChange={(value) => handleFilterChange("stock", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent >
                    {stockLevels.map((level) => (
                      <SelectItem className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800" key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton de réinitialisation */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Actions</Label>
                <Button onClick={clearFilters} variant="outline" disabled={!hasActiveFilters} className="h-11 w-full hover:text-white hover:bg-menara-red focus:text-white  ">
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </div>

            {/* Indicateurs de filtres actifs */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-3 border-t">
                <span className="text-sm font-medium text-slate-600">Filtres actifs:</span>
                {filterCategory !== "all" && (
                  <Badge variant="secondary">
                    {categoriesData.find((c) => c.id.toString() === filterCategory)?.nom}
                  </Badge>
                )}
                {filterStockLevel !== "all" && (
                  <Badge variant="secondary">{stockLevels.find((l) => l.value === filterStockLevel)?.label}</Badge>
                )}
                {searchTerm && <Badge variant="secondary">"{searchTerm}"</Badge>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Affichage du stock par catégorie avec accordéons */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Stock par Catégorie
            </h2>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {categoriesWithMaterials.length} catégorie{categoriesWithMaterials.length > 1 ? "s" : ""} •{" "}
                {getFilteredMaterials().length} matériel{getFilteredMaterials().length > 1 ? "s" : ""}
              </Badge>
              {totalPages > 1 && (
                <span className="text-sm text-slate-600">
                  Page {currentPage} sur {totalPages}
                </span>
              )}
            </div>
          </div>

          {currentCategories.length > 0 ? (
            <>
              {/* Accordéons des catégories */}
              <div className="space-y-4">
                {currentCategories.map((category, index) => {
                  const totalStock = category.materiels.reduce((sum, material) => sum + material.quantite, 0)
                  const criticalItems = category.materiels.filter((m) => m.quantite < 30).length

                  return (
                    <Card key={category.id} className="shadow-sm border-l-4 border-l-slate-600">
                      {/* En-tête de la catégorie (cliquable) */}
                      <CardHeader
                        className="bg-slate-50 border-b cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleCategory(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-200 rounded-lg">
                              <Package className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                {category.nom}
                                <ChevronRight
                                  className={`h-4 w-4 ml-2 transition-transform ${isOpenCategories[index] ? "rotate-90" : ""}`}
                                />
                              </h3>
                              <p className="text-slate-600 text-sm">{category.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {criticalItems > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {criticalItems} critique{criticalItems > 1 ? "s" : ""}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-sm">
                              {category.materiels.length} matériel{category.materiels.length > 1 ? "s" : ""}
                            </Badge>
                            <Badge variant="secondary" className="text-sm">
                              Total: {totalStock} unités
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Contenu déroulant */}
                      {isOpenCategories[index] && (
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-slate-25 border-b">
                                <tr>
                                  <th className="text-left p-4 font-medium text-slate-700">Matériel</th>
                                  <th className="text-center p-4 font-medium text-slate-700">Quantité</th>
                                  <th className="text-center p-4 font-medium text-slate-700">Statut</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {category.materiels.map((material) => {
                                  const status = getStockStatus(material.quantite)
                                  const StatusIcon = status.icon
                                  return (
                                    <tr
                                      key={material.id}
                                      className={`hover:bg-slate-50 transition-colors ${
                                        material.id % 2 === 0 ? "bg-white" : "bg-slate-25"
                                      }`}
                                    >
                                      <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                          <div className={`p-2 rounded-lg ${status.bgColor}`}>
                                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-slate-900">{material.nom}</h4>
                                            {material.quantite < 50 && (
                                              <div className="flex items-center mt-1">
                                                <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
                                                <span className="text-xs text-orange-600">
                                                  Réapprovisionnement recommandé
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-4 text-center">
                                        <div className="text-xl font-bold text-slate-900">{material.quantite}</div>
                                        <div className="text-xs text-slate-500">unités</div>
                                      </td>
                                      <td className="p-4 text-center">
                                        <Badge className={`${status.color} ${status.bgColor} border-0 text-xs`}>
                                          {status.label}
                                        </Badge>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
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
            </>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Aucune catégorie trouvée</h3>
                <p className="text-slate-500 mb-4">Aucune catégorie ne correspond aux critères sélectionnés</p>
                <Button onClick={clearFilters} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dialog d'ajout de stock */}
        <Dialog open={isAddStockDialogOpen} onOpenChange={setIsAddStockDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Ajouter du Stock
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material">Matériel *</Label>
                <Select value={selectedMaterial} onValueChange={handleMaterialSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un matériel" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{material.nom}</span>
                          <span className="text-xs text-slate-500">
                            Stock: {material.quantite} | {material.categorieName}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie (automatique)</Label>
                <Select value={selectedCategory} disabled>
                  <SelectTrigger className="bg-slate-50">
                    <SelectValue placeholder="Sélectionnée automatiquement" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantite">Quantité à ajouter *</Label>
                <Input
                  id="quantite"
                  type="number"
                  placeholder="Ex: 50"
                  value={quantiteAjouter}
                  onChange={(e) => setQuantiteAjouter(e.target.value)}
                  min="1"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddStockDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddStock} className="bg-menara-red hover:bg-menara-red/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
