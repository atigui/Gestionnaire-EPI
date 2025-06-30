"use client"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Plus, Minus } from "lucide-react"
import { CATEGORIES_MATERIELS, type Materiel } from "../lib/epi-store"

interface MaterielEditorProps {
  materiels: Materiel[]
  onMaterielsChange: (materiels: Materiel[]) => void
  showAddButton?: boolean
}

export function MaterielEditor({ materiels, onMaterielsChange, showAddButton = true }: MaterielEditorProps) {
  const addMateriel = () => {
    const newMateriels = [...materiels, { nom: "", quantite: 1, categorie: "", isExisting: false }]
    onMaterielsChange(newMateriels)
  }

  const removeMateriel = (index: number) => {
    const newMateriels = materiels.filter((_, i) => i !== index)
    onMaterielsChange(newMateriels)
  }

  const updateMateriel = (index: number, field: string, value: any) => {
    const updatedMateriels = [...materiels]
    if (field === "categorie") {
      // Réinitialiser le nom du matériel quand on change de catégorie
      updatedMateriels[index] = { ...updatedMateriels[index], [field]: value, nom: "" }
    } else {
      updatedMateriels[index] = { ...updatedMateriels[index], [field]: value }
    }
    onMaterielsChange(updatedMateriels)
  }

  const existingMateriels = materiels.filter((m) => m.isExisting)
  const newMateriels = materiels.filter((m) => !m.isExisting)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-slate-900">Matériels</h4>
        {showAddButton && (
          <Button onClick={addMateriel} size="sm" className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter matériel
          </Button>
        )}
      </div>

      {/* Matériels existants */}
      {existingMateriels.length > 0 && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-800 rounded-full mr-2"></span>
            Matériels actuellement assignés
          </h5>
          <div className="space-y-3">
            {existingMateriels.map((materiel, index) => {
              const actualIndex = materiels.findIndex((m) => m === materiel)
              return (
                <div
                  key={actualIndex}
                  className="grid grid-cols-12 gap-3 p-4 border-2 border-blue-800 rounded-lg bg-white"
                >
                  <div className="col-span-4">
                    <Label className="text-xs text-gray-600 mb-1 block">Catégorie</Label>
                    <Select
                      value={materiel.categorie || ""}
                      onValueChange={(value) => updateMateriel(actualIndex, "categorie", value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Choisir catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CATEGORIES_MATERIELS).map((categorie) => (
                          <SelectItem key={categorie} value={categorie}>
                            {categorie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5">
                    <Label className="text-xs text-gray-600 mb-1 block">Matériel</Label>
                    <Select
                      value={materiel.nom}
                      onValueChange={(value) => updateMateriel(actualIndex, "nom", value)}
                      disabled={!materiel.categorie}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue
                          placeholder={materiel.categorie ? "Choisir matériel" : "Sélectionner d'abord une catégorie"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {materiel.categorie &&
                          CATEGORIES_MATERIELS[materiel.categorie as keyof typeof CATEGORIES_MATERIELS]?.map((mat) => (
                            <SelectItem key={mat} value={mat}>
                              {mat}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600 mb-1 block">Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      className="h-9"
                      value={materiel.quantite}
                      onChange={(e) => updateMateriel(actualIndex, "quantite", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      onClick={() => removeMateriel(actualIndex)}
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Nouveaux matériels */}
      {newMateriels.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Nouveaux matériels à ajouter
          </h5>
          <div className="space-y-3">
            {newMateriels.map((materiel, index) => {
              const actualIndex = materiels.findIndex((m) => m === materiel)
              return (
                <div
                  key={actualIndex}
                  className="grid grid-cols-12 gap-3 p-4 border-2 border-green-200 rounded-lg bg-white"
                >
                  <div className="col-span-4">
                    <Label className="text-xs text-gray-600 mb-1 block">Catégorie</Label>
                    <Select
                      value={materiel.categorie || ""}
                      onValueChange={(value) => updateMateriel(actualIndex, "categorie", value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Choisir catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CATEGORIES_MATERIELS).map((categorie) => (
                          <SelectItem key={categorie} value={categorie}>
                            {categorie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5">
                    <Label className="text-xs text-gray-600 mb-1 block">Matériel</Label>
                    <Select
                      value={materiel.nom}
                      onValueChange={(value) => updateMateriel(actualIndex, "nom", value)}
                      disabled={!materiel.categorie}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue
                          placeholder={materiel.categorie ? "Choisir matériel" : "Sélectionner d'abord une catégorie"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {materiel.categorie &&
                          CATEGORIES_MATERIELS[materiel.categorie as keyof typeof CATEGORIES_MATERIELS]?.map((mat) => (
                            <SelectItem key={mat} value={mat}>
                              {mat}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600 mb-1 block">Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      className="h-9"
                      value={materiel.quantite}
                      onChange={(e) => updateMateriel(actualIndex, "quantite", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      onClick={() => removeMateriel(actualIndex)}
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {materiels.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <p>Aucun matériel</p>
          <p className="text-sm">Cliquez sur "Ajouter matériel" pour commencer</p>
        </div>
      )}
    </div>
  )
}
