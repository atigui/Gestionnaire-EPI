// Store pour gérer les données de l'application
export interface MaterielAttribution {
  categorie: string
  nom: string
  quantite: number
}

export interface Attribution {
  id: string
  matricule: string
  employe?: string
  materiels: MaterielAttribution[]
  date: string
  mois: number
  annee: number
}

export interface Employe {
  matricule: string
  nom: string
  poste: string
  service: string
  dateEmbauche: string
}

// Interface pour les affectations reçues par le magasinier
export interface AffectationRecue {
  id: string
  date: string
  materiels: Array<{
    nom: string
    taille: string
    quantite: number
    quantiteDisponible?: number // Quantité restante disponible
  }>
}

// Interface pour le suivi des stocks
export interface StockMateriel {
  nom: string
  taille: string
  quantiteInitiale: number
  quantiteAttribuee: number
  quantiteDisponible: number
  categorie: string
}

// Catégories et matériels disponibles
export const categories = {
  Tenue: ["Tenue Taille XL", "Tenue Taille XXL", "Tenue Taille L", "Tenue Taille M", "Tenue Taille S"],
  Casques: ["Casques Standard", "Casques Renforcés", "Casques Électricien"],
  Gants: ["Gants Taille L", "Gants Taille M", "Gants Taille XL", "Gants Anti-coupure", "Gants Chimiques"],
  Chaussures: [
    "Chaussures Taille 39",
    "Chaussures Taille 40",
    "Chaussures Taille 41",
    "Chaussures Taille 42",
    "Chaussures Taille 43",
    "Chaussures Taille 44",
    "Chaussures Taille 45",
  ],
  "Protection Visage": ["Lunettes Standard", "Masque de soudure", "Écran facial"],
  "Protection Corps": [
    "Tablier Taille M",
    "Tablier Taille L",
    "Blouse Taille M",
    "Blouse Taille L",
    "Harnais Standard",
  ],
}

// Données des employés
export const employes: Employe[] = [
  {
    matricule: "EMP001",
    nom: "Ahmed Benali",
    poste: "Technicien Mécanique",
    service: "Atelier Principal",
    dateEmbauche: "2020-03-15",
  },
  {
    matricule: "EMP002",
    nom: "Fatima Zahra",
    poste: "Laborantine",
    service: "Laboratoire",
    dateEmbauche: "2021-06-10",
  },
  {
    matricule: "EMP003",
    nom: "Mohamed Alami",
    poste: "Soudeur",
    service: "Atelier Soudure",
    dateEmbauche: "2019-09-20",
  },
]

// Données initiales des affectations reçues par le magasinier
const affectationsInitiales: AffectationRecue[] = [
  {
    id: "AFF-001",
    date: "2024-01-15",
    materiels: [
      { nom: "Tenue", taille: "XL", quantite: 7 },
      { nom: "Casques", taille: "Standard", quantite: 3 },
      { nom: "Gants", taille: "L", quantite: 5 },
    ],
  },
  {
    id: "AFF-002",
    date: "2024-01-14",
    materiels: [
      { nom: "Masque de soudure", taille: "Standard", quantite: 2 },
      { nom: "Tablier", taille: "M", quantite: 4 },
    ],
  },
  {
    id: "AFF-003",
    date: "2024-01-13",
    materiels: [
      { nom: "Lunettes", taille: "Standard", quantite: 8 },
      { nom: "Blouse", taille: "L", quantite: 6 },
    ],
  },
  {
    id: "AFF-004",
    date: "2024-01-12",
    materiels: [
      { nom: "Chaussures", taille: "42", quantite: 3 },
      { nom: "Casques", taille: "Standard", quantite: 5 },
    ],
  },
  {
    id: "AFF-005",
    date: "2024-01-11",
    materiels: [
      { nom: "Tenue", taille: "M", quantite: 4 },
      { nom: "Gants", taille: "XL", quantite: 8 },
    ],
  },
  {
    id: "AFF-006",
    date: "2024-01-10",
    materiels: [
      { nom: "Harnais", taille: "Standard", quantite: 2 },
      { nom: "Casques", taille: "Standard", quantite: 6 },
    ],
  },
]

// Structure pour organiser les attributions par employé et par mois
export interface FicheEmploye {
  matricule: string
  attributionsParMois: {
    [annee: number]: {
      [mois: number]: {
        materiels: MaterielAttribution[]
        dates: string[]
      }
    }
  }
}

// Fonctions pour gérer le localStorage
export const getHistorique = (): Attribution[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("epi-historique")
  return stored ? JSON.parse(stored) : []
}

export const getFichesEmployes = (): { [matricule: string]: FicheEmploye } => {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem("epi-fiches-employes")
  return stored ? JSON.parse(stored) : {}
}

export const saveFichesEmployes = (fiches: { [matricule: string]: FicheEmploye }) => {
  if (typeof window === "undefined") return
  localStorage.setItem("epi-fiches-employes", JSON.stringify(fiches))
}

// Nouvelle fonction pour gérer les stocks dynamiques
export const getStocksDynamiques = (): { [key: string]: StockMateriel } => {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem("epi-stocks-dynamiques")

  if (!stored) {
    // Initialiser les stocks à partir des affectations initiales
    const stocksInitiaux = initializerStocks()
    saveStocksDynamiques(stocksInitiaux)
    return stocksInitiaux
  }

  return JSON.parse(stored)
}

export const saveStocksDynamiques = (stocks: { [key: string]: StockMateriel }) => {
  if (typeof window === "undefined") return
  localStorage.setItem("epi-stocks-dynamiques", JSON.stringify(stocks))
}

// Initialiser les stocks à partir des affectations
const initializerStocks = (): { [key: string]: StockMateriel } => {
  const stocks: { [key: string]: StockMateriel } = {}

  affectationsInitiales.forEach((affectation) => {
    affectation.materiels.forEach((materiel) => {
      const key = `${materiel.nom}_${materiel.taille}`

      if (!stocks[key]) {
        stocks[key] = {
          nom: materiel.nom,
          taille: materiel.taille,
          quantiteInitiale: 0,
          quantiteAttribuee: 0,
          quantiteDisponible: 0,
          categorie: getCategorieFromMateriel(materiel.nom),
        }
      }

      stocks[key].quantiteInitiale += materiel.quantite
      stocks[key].quantiteDisponible += materiel.quantite
    })
  })

  return stocks
}

// Fonction pour déterminer la catégorie d'un matériel
const getCategorieFromMateriel = (nomMateriel: string): string => {
  if (nomMateriel.toLowerCase().includes("tenue")) return "Tenue"
  if (nomMateriel.toLowerCase().includes("casque")) return "Casques"
  if (nomMateriel.toLowerCase().includes("gant")) return "Gants"
  if (nomMateriel.toLowerCase().includes("chaussure")) return "Chaussures"
  if (nomMateriel.toLowerCase().includes("lunette") || nomMateriel.toLowerCase().includes("masque"))
    return "Protection Visage"
  if (
    nomMateriel.toLowerCase().includes("tablier") ||
    nomMateriel.toLowerCase().includes("blouse") ||
    nomMateriel.toLowerCase().includes("harnais")
  )
    return "Protection Corps"
  return "Autres"
}

// Nouvelle fonction pour obtenir les affectations avec stocks dynamiques
export const getAffectationsRecues = (): AffectationRecue[] => {
  const stocks = getStocksDynamiques()

  return affectationsInitiales.map((affectation) => ({
    ...affectation,
    materiels: affectation.materiels.map((materiel) => {
      const key = `${materiel.nom}_${materiel.taille}`
      const stock = stocks[key]

      return {
        ...materiel,
        quantiteDisponible: stock ? stock.quantiteDisponible : 0,
      }
    }),
  }))
}

// Fonction pour obtenir la quantité disponible d'un matériel spécifique
export const getMaterielDisponible = (nomMateriel: string, taille: string): number => {
  const stocks = getStocksDynamiques()
  const key = `${nomMateriel}_${taille}`
  const stock = stocks[key]

  return stock ? stock.quantiteDisponible : 0
}

// Fonction pour mettre à jour les stocks après attribution
const mettreAJourStocks = (materielsAttribues: MaterielAttribution[]) => {
  const stocks = getStocksDynamiques()

  materielsAttribues.forEach((materiel) => {
    // Trouver le stock correspondant en cherchant par nom (qui peut contenir la taille)
    const stockKey = Object.keys(stocks).find((key) => {
      const stock = stocks[key]
      return (
        materiel.nom.toLowerCase().includes(stock.nom.toLowerCase()) &&
        materiel.nom.toLowerCase().includes(stock.taille.toLowerCase())
      )
    })

    if (stockKey && stocks[stockKey]) {
      stocks[stockKey].quantiteAttribuee += materiel.quantite
      stocks[stockKey].quantiteDisponible = Math.max(0, stocks[stockKey].quantiteDisponible - materiel.quantite)
    }
  })

  saveStocksDynamiques(stocks)
}

export const saveAttribution = (attribution: Attribution) => {
  if (typeof window === "undefined") return

  // Sauvegarder dans l'historique
  const historique = getHistorique()
  historique.push(attribution)
  localStorage.setItem("epi-historique", JSON.stringify(historique))

  // Mettre à jour les stocks dynamiques
  mettreAJourStocks(attribution.materiels)

  // Mettre à jour la fiche employé
  const fiches = getFichesEmployes()
  const matricule = attribution.matricule

  if (!fiches[matricule]) {
    fiches[matricule] = {
      matricule,
      attributionsParMois: {},
    }
  }

  const annee = attribution.annee
  const mois = attribution.mois

  if (!fiches[matricule].attributionsParMois[annee]) {
    fiches[matricule].attributionsParMois[annee] = {}
  }

  if (!fiches[matricule].attributionsParMois[annee][mois]) {
    fiches[matricule].attributionsParMois[annee][mois] = {
      materiels: [],
      dates: [],
    }
  }
  // Ajouter les matériels et la date à ce mois
  fiches[matricule].attributionsParMois[annee][mois].materiels.push(...attribution.materiels)
  fiches[matricule].attributionsParMois[annee][mois].dates.push(attribution.date)

  saveFichesEmployes(fiches)
}

export const getEmployeByMatricule = (matricule: string): Employe | undefined => {
  return employes.find((emp) => emp.matricule === matricule)
}

export const getAttributionsByMatricule = (matricule: string): Attribution[] => {
  return getHistorique().filter((attr) => attr.matricule === matricule)
}

export const getFicheEmploye = (matricule: string): FicheEmploye | null => {
  const fiches = getFichesEmployes()
  return fiches[matricule] || null
}

// Fonction pour obtenir les matériels d'un employé pour une année donnée, organisés par mois
export const getMaterielsParMois = (matricule: string, annee: number) => {
  const fiche = getFicheEmploye(matricule)
  if (!fiche || !fiche.attributionsParMois[annee]) {
    return {}
  }
  return fiche.attributionsParMois[annee]
}

// Fonction pour obtenir tous les stocks avec leurs détails
export const getTousLesStocks = (): StockMateriel[] => {
  const stocks = getStocksDynamiques()
  return Object.values(stocks)
}

// Fonction pour réinitialiser les stocks (utile pour les tests)
export const reinitialiserStocks = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("epi-stocks-dynamiques")
  localStorage.removeItem("epi-historique")
  localStorage.removeItem("epi-fiches-employes")
}

// Fonction pour ajouter des données de test
export const ajouterDonneesTest = () => {
  if (typeof window === "undefined") return

  // Vérifier si des données existent déjà
  const historique = getHistorique()
  if (historique.length > 0) return

  // Initialiser les stocks si nécessaire
  getStocksDynamiques()

  // Année actuelle
  const currentYear = new Date().getFullYear()

  // Données de test pour EMP001
  const attributionsEMP001 = [
    {
      id: `ATT-${Date.now()}-1`,
      matricule: "EMP001",
      employe: "Ahmed Benali",
      materiels: [
        { categorie: "Casques", nom: "Casques Standard", quantite: 1 },
        { categorie: "Gants", nom: "Gants Taille L", quantite: 2 },
      ],
      date: `${currentYear}-01-15`,
      mois: 1,
      annee: currentYear,
    },
    {
      id: `ATT-${Date.now()}-2`,
      matricule: "EMP001",
      employe: "Ahmed Benali",
      materiels: [{ categorie: "Tenue", nom: "Tenue Taille L", quantite: 1 }],
      date: `${currentYear}-03-22`,
      mois: 3,
      annee: currentYear,
    },
  ]

  // Données de test pour EMP002
  const attributionsEMP002 = [
    {
      id: `ATT-${Date.now()}-3`,
      matricule: "EMP002",
      employe: "Fatima Zahra",
      materiels: [
        { categorie: "Protection Visage", nom: "Lunettes Standard", quantite: 1 },
        { categorie: "Tenue", nom: "Tenue Taille M", quantite: 1 },
      ],
      date: `${currentYear}-02-10`,
      mois: 2,
      annee: currentYear,
    },
  ]

  // Ajouter les attributions
  attributionsEMP001.forEach((attr) => saveAttribution(attr))
  attributionsEMP002.forEach((attr) => saveAttribution(attr))
}

// Initialiser les données de test
if (typeof window !== "undefined") {
  setTimeout(() => {
    ajouterDonneesTest()
  }, 500)
}
