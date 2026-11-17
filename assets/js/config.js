/* =========================================================
   CONFIGURATION DE L'ENTREPRISE
   Modifiez uniquement ce fichier pour adapter le site à un client.
   Les valeurs vides ("") s'affichent comme « à compléter ».
   ========================================================= */
window.SITE_CONFIG = {
  /* Mode démonstration : affiche le bandeau « site de démonstration ».
     Passez à false pour un client réel. */
  demoMode: true,

  company: {
    name: "ATLAS CLEAN",
    tagline: "Nettoyage Professionnel",
    city: "Béni Mellal",
    country: "Maroc"
  },

  contact: {
    /* Numéro WhatsApp au format international, chiffres uniquement.
       Exemple de format : "2126XXXXXXXX". Laissez vide tant qu'aucun numéro n'est confirmé :
       le site affichera alors un aperçu du message au lieu d'ouvrir un lien cassé. */
    whatsapp: "",
    /* Téléphone affiché (texte libre), ex. "+212 6 XX XX XX XX" */
    phone: "",
    email: "",
    address: "",
    hours: ""
  },

  /* Message WhatsApp prérempli par défaut */
  whatsappDefaultMessage: "Bonjour, je souhaite obtenir un devis pour vos services de nettoyage.",

  /* Réseaux sociaux : laissez vide tant que le lien n'est pas confirmé (icône affichée, lien inactif) */
  social: {
    facebook: "",
    instagram: "",
    linkedin: ""
  },

  /* Adresse publique du site une fois en ligne, ex. "https://www.exemple.ma".
     Quand elle est renseignée et que le site tourne sur ce domaine,
     les liens « propres » (/services/) sont utilisés tels quels. */
  siteUrl: "",

  /* Langue par défaut (architecture prête pour un futur site multilingue) */
  defaultLang: "fr"
};
