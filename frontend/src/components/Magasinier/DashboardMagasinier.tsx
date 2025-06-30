"use client"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Package, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import Layout from "../layout/layout-magasinier"
import { getAffectationsRecues, getMaterielDisponible } from "../../lib/data-store"

const ITEMS_PER_PAGE = 3

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [affectations, setAffectations] = useState<any[]>([])
  const [statutsAffectations, setStatutsAffectations] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    // Charger les affectations reçues
    const affectationsData = getAffectationsRecues()
    setAffectations(affectationsData)

    // Calculer les statuts pour chaque affectation
    const statuts: { [key: string]: any } = {}
    affectationsData.forEach((affectation) => {
      let totalAffecte = 0
      let totalAttribue = 0

      affectation.materiels.forEach((materiel: any) => {
        totalAffecte += materiel.quantite
        totalAttribue += getMaterielDisponible(materiel.nom, materiel.taille)
      })

      const pourcentageAttribue =
        totalAffecte > 0 ? Math.round(((totalAffecte - (totalAffecte - totalAttribue)) / totalAffecte) * 100) : 0

      statuts[affectation.id] = {
        totalAffecte,
        totalAttribue: totalAffecte - totalAttribue,
        totalDisponible: totalAttribue,
        pourcentageAttribue,
        statut: pourcentageAttribue === 0 ? "non-attribue" : pourcentageAttribue === 100 ? "complet" : "partiel",
      }
    })

    setStatutsAffectations(statuts)
  }, [])

  const totalPages = Math.ceil(affectations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAffectations = affectations.slice(startIndex, endIndex)

  const formatMateriels = (materiels: Array<{ nom: string; taille: string; quantite: number }>) => {
    return materiels.map((materiel) => `${materiel.nom} Taille ${materiel.taille} (${materiel.quantite})`).join(", ")
  }

  const getStatutBadge = (affectationId: string) => {
    const statut = statutsAffectations[affectationId]
    if (!statut) return null

    switch (statut.statut) {
      case "non-attribue":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300">
            <Clock className="h-3 w-3 mr-1" />
            Non attribué
          </Badge>
        )
      case "partiel":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partiel ({statut.pourcentageAttribue}%)
          </Badge>
        )
      case "complet":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complet
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatutDetails = (affectationId: string) => {
    const statut = statutsAffectations[affectationId]
    if (!statut) return ""

    return `${statut.totalAttribue}/${statut.totalAffecte} attribués • ${statut.totalDisponible} disponibles`
  }

  return (
    <Layout>
      <div className="space-y-6 mt-12 mr-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2B3A67]">Affectations reçues</h1>
            <p className="text-gray-600">Gérez les affectations d'équipements de protection individuelle</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

       
        <Card className="border-gray-200">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-[#2B3A67] font-semibold">ID</TableHead>
                  <TableHead className="text-[#2B3A67] font-semibold">Date</TableHead>
                  <TableHead className="text-[#2B3A67] font-semibold">Matériels</TableHead>
                  <TableHead className="text-[#2B3A67] font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAffectations.map((affectation) => (
                  <TableRow key={affectation.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium text-[#2B3A67]">{affectation.id}</TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(affectation.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-700">{formatMateriels(affectation.materiels)}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Button asChild size="sm" className="bg-[#C41E3A] hover:bg-[#C41E3A]/90 text-white">
                        <Link to="/magasinier/nouvelle-attribution">Attribuer</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-[#2B3A67]/30 text-[#2B3A67] hover:bg-[#2B3A67]/5"
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
                  className={
                    currentPage === page
                      ? "bg-[#2B3A67] text-white hover:bg-[#2B3A67]/90"
                      : "border-[#2B3A67]/30 text-[#2B3A67] hover:bg-[#2B3A67]/5"
                  }
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
              className="border-[#2B3A67]/30 text-[#2B3A67] hover:bg-[#2B3A67]/5"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
