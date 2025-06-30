import { create } from "zustand"

// Types communs
export type Materiel = {
  nom: string
  quantite: number
  categorie?: string
  isExisting?: boolean
}

export type Attribution = {
  id: number
  magasinier: string
  employe: {
    matricule: string
    nom: string
    prenom: string
    poste: string
  }
  dateAttribution: string
  fichePdf: string
  materiels: Materiel[]
}

export type Affectation = {
  id: number
  affecteur: string
  magasinier: string
  emplacement: string
  dateAffectation: string
  nombreMateriels: number
  statut: "active" | "supprimee"
  materiels: Materiel[]
}

export type ModificationLog = {
  id: string
  itemId: number
  type: "modification" | "suppression"
  date: string
  utilisateur: string
  details: string
  itemType: "attribution" | "affectation"
}

// Structure des catégories et matériels disponibles
export const CATEGORIES_MATERIELS = {
  Tenue: [
    "Gilet - Taille S",
    "Gilet - Taille M",
    "Gilet - Taille L",
    "Gilet - Taille XL",
    "Gilet - Taille XXL",
    "Combinaison - Taille S",
    "Combinaison - Taille M",
    "Combinaison - Taille L",
    "Combinaison - Taille XL",
    "Combinaison - Taille XXL",
  ],
  Chaussures: [
    "Chaussures - T38",
    "Chaussures - T39",
    "Chaussures - T40",
    "Chaussures - T41",
    "Chaussures - T42",
    "Chaussures - T43",
    "Chaussures - T44",
    "Chaussures - T45",
    "Chaussures - T46",
    "Bottes - T38",
    "Bottes - T39",
    "Bottes - T40",
    "Bottes - T41",
    "Bottes - T42",
    "Bottes - T43",
    "Bottes - T44",
    "Bottes - T45",
    "Bottes - T46",
  ],
  Gants: [
    "Gants - Taille S",
    "Gants - Taille M",
    "Gants - Taille L",
    "Gants - Taille XL",
    "Gants anti-coupure - Taille S",
    "Gants anti-coupure - Taille M",
    "Gants anti-coupure - Taille L",
    "Gants anti-coupure - Taille XL",
    "Gants isolants - Taille S",
    "Gants isolants - Taille M",
    "Gants isolants - Taille L",
    "Gants isolants - Taille XL",
  ],
  Casques: [
    "Casque - Standard",
    "Casque - Avec visière",
    "Casque - Électricien",
    "Casque - Forestier",
    "Casque - Soudeur",
  ],
  "Protection respiratoire": [
    "Masques anti-poussière - Standard",
    "Masques anti-poussière - FFP1",
    "Masques anti-poussière - FFP2",
    "Masques anti-poussière - FFP3",
    "Masque à gaz - Standard",
    "Demi-masque respiratoire",
    "Masque complet respiratoire",
  ],
  "Protection oculaire": [
    "Lunettes - Standard",
    "Lunettes - Anti-buée",
    "Lunettes - Teintées",
    "Lunettes - Soudeur",
    "Écran facial - Standard",
    "Écran facial - Anti-projection",
  ],
  "Protection auditive": [
    "Bouchons d'oreilles - Standard",
    "Bouchons d'oreilles - Silicone",
    "Casque anti-bruit - Standard",
    "Casque anti-bruit - Électronique",
  ],
}

// Fonction utilitaire pour trouver la catégorie d'un matériel
export const findCategorieForMateriel = (nomMateriel: string): string => {
  for (const [categorie, materiels] of Object.entries(CATEGORIES_MATERIELS)) {
    if (materiels.some((mat) => nomMateriel.toLowerCase().includes(mat.split(" - ")[0].toLowerCase()))) {
      return categorie
    }
  }
  return ""
}

// Données initiales
const initialAttributions: Attribution[] = [
  {
    id: 1,
    magasinier: "Fatima Zahra",
    employe: {
      matricule: "EMP001",
      nom: "Bennani",
      prenom: "Mohammed",
      poste: "Maçon",
    },
    dateAttribution: "2024-03-16",
    fichePdf: "fiche_001_20240316.pdf",
    materiels: [
      { nom: "Casque - Standard", quantite: 1 },
      { nom: "Gants - Taille L", quantite: 2 },
      { nom: "Gilet - Taille XL", quantite: 1 },
    ],
  },
  {
    id: 2,
    magasinier: "Omar Tazi",
    employe: {
      matricule: "EMP002",
      nom: "Idrissi",
      prenom: "Aicha",
      poste: "Chef d'équipe",
    },
    dateAttribution: "2024-04-12",
    fichePdf: "fiche_002_20240412.pdf",
    materiels: [
      { nom: "Chaussures - T42", quantite: 1 },
      { nom: "Masques anti-poussière - Standard", quantite: 10 },
    ],
  },
  {
    id: 3,
    magasinier: "Zineb Alaoui",
    employe: {
      matricule: "EMP003",
      nom: "Tazi",
      prenom: "Omar",
      poste: "Électricien",
    },
    dateAttribution: "2024-05-22",
    fichePdf: "fiche_003_20240522.pdf",
    materiels: [
      { nom: "Gilet - Taille L", quantite: 1 },
      { nom: "Lunettes - Standard", quantite: 1 },
    ],
  },
  {
    id: 4,
    magasinier: "Fatima Zahra",
    employe: {
      matricule: "EMP001",
      nom: "Bennani",
      prenom: "Mohammed",
      poste: "Maçon",
    },
    dateAttribution: "2024-06-10",
    fichePdf: "fiche_001_20240610.pdf",
    materiels: [
      { nom: "Chaussures - T43", quantite: 1 },
      { nom: "Masques anti-poussière - Standard", quantite: 5 },
    ],
  },
  {
    id: 5,
    magasinier: "Omar Tazi",
    employe: {
      matricule: "EMP004",
      nom: "Alami",
      prenom: "Fatima",
      poste: "Ingénieur",
    },
    dateAttribution: "2024-07-15",
    fichePdf: "fiche_004_20240715.pdf",
    materiels: [
      { nom: "Casque - Standard", quantite: 1 },
      { nom: "Gilet - Taille M", quantite: 1 },
    ],
  },
]

const initialAffectations: Affectation[] = [
  {
    id: 1,
    affecteur: "Ahmed Benali",
    magasinier: "Fatima Zahra",
    emplacement: "Magasin A",
    dateAffectation: "2024-03-15",
    nombreMateriels: 35,
    statut: "active",
    materiels: [
      { nom: "Casque - Standard", quantite: 10 },
      { nom: "Gants - Taille L", quantite: 20 },
      { nom: "Gilet - Taille XL", quantite: 5 },
    ],
  },
  {
    id: 2,
    affecteur: "Ahmed Benali",
    magasinier: "Omar Tazi",
    emplacement: "Magasin B",
    dateAffectation: "2024-03-10",
    nombreMateriels: 55,
    statut: "active",
    materiels: [
      { nom: "Chaussures - T42", quantite: 5 },
      { nom: "Masques anti-poussière - Standard", quantite: 50 },
    ],
  },
  {
    id: 3,
    affecteur: "Ahmed Benali",
    magasinier: "Zineb Alaoui",
    emplacement: "Magasin C",
    dateAffectation: "2024-03-20",
    nombreMateriels: 23,
    statut: "active",
    materiels: [
      { nom: "Gilet - Taille L", quantite: 8 },
      { nom: "Lunettes - Standard", quantite: 15 },
    ],
  },
  {
    id: 4,
    affecteur: "Karim Idrissi",
    magasinier: "Fatima Zahra",
    emplacement: "Magasin D",
    dateAffectation: "2024-04-05",
    nombreMateriels: 20,
    statut: "active",
    materiels: [
      { nom: "Casque - Standard", quantite: 8 },
      { nom: "Gants - Taille L", quantite: 12 },
    ],
  },
  {
    id: 5,
    affecteur: "Karim Idrissi",
    magasinier: "Omar Tazi",
    emplacement: "Magasin A",
    dateAffectation: "2024-04-12",
    nombreMateriels: 37,
    statut: "active",
    materiels: [
      { nom: "Bottes - T42", quantite: 7 },
      { nom: "Masques anti-poussière - Standard", quantite: 30 },
    ],
  },
]

// Store principal
interface EPIStore {
  // État
  attributions: Attribution[]
  affectations: Affectation[]
  modificationLogs: ModificationLog[]

  // Actions pour les attributions
  updateAttribution: (attribution: Attribution) => void
  deleteAttribution: (id: number) => void

  // Actions pour les affectations
  updateAffectation: (affectation: Affectation) => void
  deleteAffectation: (id: number) => void

  // Actions pour les logs
  addModificationLog: (log: Omit<ModificationLog, "id" | "date">) => void

  // Utilitaires
  getUniqueMonths: (items: (Attribution | Affectation)[], dateField: string) => Array<{ value: string; label: string }>
  prepareMaterielsForEdit: (materiels: Materiel[]) => Materiel[]
  cleanMaterielsForSave: (materiels: Materiel[]) => Materiel[]
}

export const useEPIStore = create<EPIStore>((set, get) => ({
  // État initial
  attributions: initialAttributions,
  affectations: initialAffectations,
  modificationLogs: [],

  // Actions pour les attributions
  updateAttribution: (attribution) => {
    set((state) => ({
      attributions: state.attributions.map((attr) => (attr.id === attribution.id ? attribution : attr)),
    }))
  },

  deleteAttribution: (id) => {
    set((state) => ({
      attributions: state.attributions.filter((attr) => attr.id !== id),
    }))
  },

  // Actions pour les affectations
  updateAffectation: (affectation) => {
    set((state) => ({
      affectations: state.affectations.map((aff) => (aff.id === affectation.id ? affectation : aff)),
    }))
  },

  deleteAffectation: (id) => {
    set((state) => ({
      affectations: state.affectations.map((aff) => (aff.id === id ? { ...aff, statut: "supprimee" as const } : aff)),
    }))
  },

  // Actions pour les logs
  addModificationLog: (logData) => {
    const newLog: ModificationLog = {
      ...logData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    set((state) => ({
      modificationLogs: [...state.modificationLogs, newLog],
    }))
  },

  // Utilitaires
  getUniqueMonths: (items, dateField) => {
    const months = items.map((item) => {
      const date = new Date((item as any)[dateField])
      return `${date.getFullYear()}-${date.getMonth() + 1}`
    })
    return [...new Set(months)].sort().map((monthKey) => {
      const [year, month] = monthKey.split("-")
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
      return {
        value: monthKey,
        label: date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      }
    })
  },

  prepareMaterielsForEdit: (materiels) => {
    return materiels.map((materiel) => ({
      ...materiel,
      categorie: findCategorieForMateriel(materiel.nom),
      isExisting: true,
    }))
  },

  cleanMaterielsForSave: (materiels) => {
    return materiels.map((materiel) => ({
      nom: materiel.nom,
      quantite: materiel.quantite,
    }))
  },
}))

// Hooks personnalisés pour faciliter l'utilisation
export const useAttributions = () => {
  const attributions = useEPIStore((state) => state.attributions)
  const updateAttribution = useEPIStore((state) => state.updateAttribution)
  const deleteAttribution = useEPIStore((state) => state.deleteAttribution)

  return { attributions, updateAttribution, deleteAttribution }
}

export const useAffectations = () => {
  const affectations = useEPIStore((state) => state.affectations)
  const updateAffectation = useEPIStore((state) => state.updateAffectation)
  const deleteAffectation = useEPIStore((state) => state.deleteAffectation)

  return { affectations, updateAffectation, deleteAffectation }
}

export const useModificationLogs = () => {
  const modificationLogs = useEPIStore((state) => state.modificationLogs)
  const addModificationLog = useEPIStore((state) => state.addModificationLog)

  return { modificationLogs, addModificationLog }
}

export const useEPIUtils = () => {
  const getUniqueMonths = useEPIStore((state) => state.getUniqueMonths)
  const prepareMaterielsForEdit = useEPIStore((state) => state.prepareMaterielsForEdit)
  const cleanMaterielsForSave = useEPIStore((state) => state.cleanMaterielsForSave)

  return { getUniqueMonths, prepareMaterielsForEdit, cleanMaterielsForSave }
}
