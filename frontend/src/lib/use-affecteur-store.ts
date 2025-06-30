import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types pour notre store
export interface Materiel {
  id: string
  nom: string
  quantiteDisponible: number
  derniereMiseAJour: string
  seuil: number
}

export interface MaterielLine {
  id: string
  categorie: string
  materiel: string
  quantite: number
}

export interface Affectation {
  id: string
  magasinier: string
  emplacement: string
  date: string
  materiels: {
    categorie: string
    nom: string
    quantite: number
  }[]
  dateCreation: string
}

interface StockState {
  categories: string[]
  stockByCategory: Record<string, Materiel[]>
  magasiniers: string[]
  emplacements: string[]
  materielsByCategory: Record<string, string[]>
  affectations: Affectation[]

  // Actions
  addAffectation: (affectation: Omit<Affectation, "id" | "dateCreation">) => void
  updateStock: (categorie: string, materielId: string, quantite: number) => void
}

export const useAffecteurStore = create<StockState>()(
  persist(
    (set) => ({
      categories: [
        "Casques de sécurité",
        "Chaussures de sécurité",
        "Gants de protection",
        "Gilets haute visibilité",
        "Lunettes de protection",
        "Masques respiratoires",
        "Harnais de sécurité",
      ],

      stockByCategory: {
        "Casques de sécurité": [
          { id: "1", nom: "Casque blanc standard", quantiteDisponible: 45, derniereMiseAJour: "2024-12-15", seuil: 20 },
          { id: "2", nom: "Casque jaune chantier", quantiteDisponible: 12, derniereMiseAJour: "2024-12-14", seuil: 15 },
          {
            id: "3",
            nom: "Casque rouge superviseur",
            quantiteDisponible: 8,
            derniereMiseAJour: "2024-12-13",
            seuil: 10,
          },
        ],
        "Chaussures de sécurité": [
          { id: "4", nom: "Chaussures S3 noires", quantiteDisponible: 25, derniereMiseAJour: "2024-12-15", seuil: 20 },
          { id: "5", nom: "Bottes de sécurité", quantiteDisponible: 18, derniereMiseAJour: "2024-12-14", seuil: 15 },
          { id: "6", nom: "Chaussures montantes", quantiteDisponible: 32, derniereMiseAJour: "2024-12-13", seuil: 25 },
        ],
        "Gants de protection": [
          { id: "7", nom: "Gants latex", quantiteDisponible: 150, derniereMiseAJour: "2024-12-15", seuil: 100 },
          { id: "8", nom: "Gants cuir", quantiteDisponible: 35, derniereMiseAJour: "2024-12-14", seuil: 30 },
          { id: "9", nom: "Gants anti-coupure", quantiteDisponible: 22, derniereMiseAJour: "2024-12-13", seuil: 25 },
        ],
        "Gilets haute visibilité": [
          { id: "10", nom: "Gilet jaune classe 2", quantiteDisponible: 65, derniereMiseAJour: "2024-12-15", seuil: 40 },
          {
            id: "11",
            nom: "Gilet orange classe 3",
            quantiteDisponible: 28,
            derniereMiseAJour: "2024-12-14",
            seuil: 30,
          },
          { id: "12", nom: "Gilet avec bandes", quantiteDisponible: 42, derniereMiseAJour: "2024-12-13", seuil: 35 },
        ],
        "Lunettes de protection": [
          {
            id: "13",
            nom: "Lunettes transparentes",
            quantiteDisponible: 85,
            derniereMiseAJour: "2024-12-15",
            seuil: 50,
          },
          { id: "14", nom: "Lunettes teintées", quantiteDisponible: 38, derniereMiseAJour: "2024-12-14", seuil: 40 },
          { id: "15", nom: "Lunettes anti-buée", quantiteDisponible: 15, derniereMiseAJour: "2024-12-13", seuil: 20 },
        ],
        "Masques respiratoires": [
          { id: "16", nom: "Masque FFP2", quantiteDisponible: 200, derniereMiseAJour: "2024-12-15", seuil: 100 },
          { id: "17", nom: "Masque FFP3", quantiteDisponible: 50, derniereMiseAJour: "2024-12-14", seuil: 30 },
          { id: "18", nom: "Masque à cartouche", quantiteDisponible: 25, derniereMiseAJour: "2024-12-13", seuil: 20 },
        ],
        "Harnais de sécurité": [
          { id: "19", nom: "Harnais antichute", quantiteDisponible: 15, derniereMiseAJour: "2024-12-15", seuil: 10 },
          {
            id: "20",
            nom: "Harnais de positionnement",
            quantiteDisponible: 12,
            derniereMiseAJour: "2024-12-14",
            seuil: 8,
          },
          { id: "21", nom: "Harnais complet", quantiteDisponible: 8, derniereMiseAJour: "2024-12-13", seuil: 5 },
        ],
      },

      magasiniers: [
        "Ahmed Benali",
        "Fatima Zahra",
        "Youssef Alami",
        "Khadija Mansouri",
        "Omar Tazi",
        "Aicha Benkirane",
      ],

      emplacements: [
        "Chantier A ",
        "Chantier B ",
        "Chantier C ",
        "Chantier D ",
      ],

      materielsByCategory: {
        "Casques de sécurité": [
          "Casque blanc standard",
          "Casque jaune chantier",
          "Casque rouge superviseur",
          "Casque bleu électricien",
          "Casque avec visière",
        ],
        "Chaussures de sécurité": [
          "Chaussures S3 noires",
          "Bottes de sécurité",
          "Chaussures montantes",
          "Bottes imperméables",
          "Chaussures anti-dérapantes",
        ],
        "Gants de protection": [
          "Gants latex",
          "Gants cuir",
          "Gants anti-coupure",
          "Gants isolants électriques",
          "Gants chimiques",
        ],
        "Gilets haute visibilité": [
          "Gilet jaune classe 2",
          "Gilet orange classe 3",
          "Gilet avec bandes",
          "Gilet manches longues",
          "Gilet imperméable",
        ],
        "Lunettes de protection": [
          "Lunettes transparentes",
          "Lunettes teintées",
          "Lunettes anti-buée",
          "Lunettes de soudage",
          "Lunettes panoramiques",
        ],
        "Masques respiratoires": ["Masque FFP2", "Masque FFP3", "Masque à cartouche", "Demi-masque", "Masque complet"],
        "Harnais de sécurité": [
          "Harnais antichute",
          "Harnais de positionnement",
          "Harnais complet",
          "Longe de sécurité",
          "Absorbeur d'énergie",
        ],
      },

      affectations: [
        {
          id: "AFF-001",
          magasinier: "Ahmed Benali",
          emplacement: "Chantier A ",
          date: "2024-12-15",
          materiels: [
            { categorie: "Casques de sécurité", nom: "Casque blanc standard", quantite: 10 },
            { categorie: "Gants de protection", nom: "Gants latex", quantite: 20 },
            { categorie: "Lunettes de protection", nom: "Lunettes transparentes", quantite: 15 },
          ],
          dateCreation: "2024-12-14T10:30:00Z",
        },
        {
          id: "AFF-002",
          magasinier: "Fatima Zahra",
          emplacement: "Chantier B ",
          date: "2024-12-14",
          materiels: [
            { categorie: "Chaussures de sécurité", nom: "Chaussures S3 noires", quantite: 5 },
            { categorie: "Gilets haute visibilité", nom: "Gilet jaune classe 2", quantite: 8 },
          ],
          dateCreation: "2024-12-13T14:45:00Z",
        },
        {
          id: "AFF-003",
          magasinier: "Youssef Alami",
          emplacement: " Chantier B",
          date: "2024-12-13",
          materiels: [
            { categorie: "Casques de sécurité", nom: "Casque rouge superviseur", quantite: 3 },
            { categorie: "Gants de protection", nom: "Gants anti-coupure", quantite: 15 },
            { categorie: "Lunettes de protection", nom: "Lunettes teintées", quantite: 10 },
            { categorie: "Masques respiratoires", nom: "Masque FFP2", quantite: 50 },
          ],
          dateCreation: "2024-12-12T09:15:00Z",
        },
        {
          id: "AFF-004",
          magasinier: "Khadija Mansouri",
          emplacement: "Chantier C ",
          date: "2024-12-12",
          materiels: [
            { categorie: "Gilets haute visibilité", nom: "Gilet orange classe 3", quantite: 12 },
            { categorie: "Harnais de sécurité", nom: "Harnais antichute", quantite: 6 },
          ],
          dateCreation: "2024-12-11T16:20:00Z",
        },
      ],

      // Actions pour modifier l'état
      addAffectation: (affectation) =>
        set((state) => {
          // Générer un nouvel ID
          const newId = `AFF-${String(state.affectations.length + 1).padStart(3, "0")}`

          // Créer la nouvelle affectation
          const newAffectation = {
            ...affectation,
            id: newId,
            dateCreation: new Date().toISOString(),
          }

          // Mettre à jour le stock
          const updatedStock = { ...state.stockByCategory }

          affectation.materiels.forEach((materiel) => {
            const categorie = materiel.categorie
            const items = updatedStock[categorie]

            if (items) {
              const itemIndex = items.findIndex((item) => item.nom === materiel.nom)
              if (itemIndex !== -1) {
                // Décrémenter le stock
                const newQuantite = Math.max(0, items[itemIndex].quantiteDisponible - materiel.quantite)
                items[itemIndex] = {
                  ...items[itemIndex],
                  quantiteDisponible: newQuantite,
                  derniereMiseAJour: new Date().toISOString().split("T")[0],
                }
              }
            }
          })

          return {
            affectations: [...state.affectations, newAffectation],
            stockByCategory: updatedStock,
          }
        }),

      updateStock: (categorie, materielId, quantite) =>
        set((state) => {
          const updatedStock = { ...state.stockByCategory }
          const items = updatedStock[categorie]

          if (items) {
            const itemIndex = items.findIndex((item) => item.id === materielId)
            if (itemIndex !== -1) {
              items[itemIndex] = {
                ...items[itemIndex],
                quantiteDisponible: quantite,
                derniereMiseAJour: new Date().toISOString().split("T")[0],
              }
            }
          }

          return { stockByCategory: updatedStock }
        }),
    }),
    {
      name: "affecteur-storage", // nom pour le localStorage
    },
  ),
)
