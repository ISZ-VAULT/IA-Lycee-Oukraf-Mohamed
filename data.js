// --- Encyclopedie : fiches filtrables ---
const FICHES = [
  {t:"Machine learning", th:"Apprentissage", d:"Le modèle apprend à partir d'exemples au lieu de suivre des règles écrites à la main. Plus il voit de données, plus il ajuste ses paramètres.", tag:"Méthode"},
  {t:"Deep learning", th:"Apprentissage", d:"Empilement de nombreuses couches de neurones artificiels. Cette profondeur permet de traiter des images, du son et du texte brut.", tag:"Réseaux"},
  {t:"Réseau de neurones", th:"Apprentissage", d:"Unité de calcul inspirée très librement du neurone biologique. Chaque connexion possède un poids ajusté pendant l'entraînement.", tag:"Modèle"},
  {t:"Apprentissage supervisé", th:"Apprentissage", d:"On donne au modèle des exemples déjà étiquetés. Il apprend à associer une entrée à la bonne réponse.", tag:"Méthode"},
  {t:"Apprentissage non supervisé", th:"Apprentissage", d:"Aucune étiquette n'est fournie : le modèle cherche seul des regroupements. Utile pour segmenter ou détecter des anomalies.", tag:"Méthode"},
  {t:"Renforcement", th:"Apprentissage", d:"Un agent agit, reçoit une récompense ou une pénalité, puis ajuste sa stratégie. C'est l'approche des jeux et de la robotique.", tag:"Méthode"},
  {t:"Test de Turing", th:"Histoire", d:"Imaginé en 1950 pour remplacer la question « une machine peut-elle penser ? ». Un juge dialogue à l'aveugle avec un humain et une machine.", tag:"1950"},
  {t:"Conférence de Dartmouth", th:"Histoire", d:"Été 1956, aux États-Unis : le terme « intelligence artificielle » est officialisé. La discipline devient un champ de recherche.", tag:"1956"},
  {t:"Deep Blue", th:"Histoire", d:"Superordinateur d'IBM qui bat Garry Kasparov aux échecs en 1997. Il combine une force de calcul énorme et des fonctions d'évaluation.", tag:"1997"},
  {t:"AlphaGo", th:"Histoire", d:"Programme de DeepMind victorieux au go en 2016. Il associe réseaux de neurones et exploration arborescente.", tag:"2016"},
  {t:"IA générative", th:"Modèles", d:"Un modèle produit un contenu nouveau : texte, image, musique. Il ne copie pas une base, il prédit une suite plausible.", tag:"Génératif"},
  {t:"Grand modèle de langage", th:"Modèles", d:"Modèle entraîné sur d'immenses corpus textuels pour prédire le mot suivant. Il génère du texte cohérent sans comprendre le monde.", tag:"LLM"},
  {t:"Prompt", th:"Modèles", d:"La consigne donnée au modèle. Une formulation précise, avec le contexte et le format attendu, améliore nettement le résultat.", tag:"Usage"},
  {t:"Hallucination", th:"Limites", d:"Le modèle produit une affirmation fausse avec assurance. La fluidité du texte n'est jamais une preuve de vérité.", tag:"Risque"},
  {t:"Biais algorithmique", th:"Limites", d:"Le système reproduit les déséquilibres présents dans ses données. Un modèle entraîné sur des données partiales reste partial.", tag:"Risque"},
  {t:"Boîte noire", th:"Limites", d:"On observe les entrées et les sorties sans pouvoir expliquer finement la décision interne. Cela complique la responsabilité.", tag:"Risque"},
  {t:"Données personnelles", th:"Société", d:"Toute information permettant d'identifier une personne. Leur collecte est encadrée par le RGPD en Europe.", tag:"Droit"},
  {t:"Empreinte énergétique", th:"Société", d:"L'entraînement et l'usage des grands modèles consomment électricité et eau. Le coût dépend de la taille du modèle.", tag:"Écologie"},
  {t:"Emploi et automatisation", th:"Société", d:"L'IA remplace certaines tâches plus qu'elle ne remplace des métiers entiers. Les compétences demandées se déplacent.", tag:"Économie"},
  {t:"IA faible", th:"Notions", d:"Système performant dans un domaine précis, sans conscience ni intention. C'est le seul type d'IA réellement disponible.", tag:"Notion"},
  {t:"IA forte", th:"Notions", d:"Hypothèse d'une machine polyvalente et consciente d'elle-même. Aucune réalisation actuelle ne correspond à cette définition.", tag:"Notion"},
  {t:"Agent intelligent", th:"Notions", d:"Programme qui perçoit son environnement et agit pour atteindre un objectif. Un thermostat très simple en est une forme minimale.", tag:"Notion"}
];

// --- Bibliotheque / references ---
const REFS = [
  {t:"Alan Turing, « Computing Machinery and Intelligence »", d:"Article fondateur de 1950 où Turing propose son test et répond aux objections classiques.", tag:"Texte original"},
  {t:"Site du CNIL — intelligence artificielle", d:"Fiches pratiques sur les données personnelles et les usages de l'IA en France.", tag:"Droit"},
  {t:"Rapports de l'UNESCO sur l'éthique de l'IA", d:"Recommandations internationales sur les principes éthiques à respecter.", tag:"Éthique"},
  {t:"Cours en ligne d'introduction au machine learning", d:"Parcours gratuits pour manipuler un premier modèle avec Python.", tag:"Pratique"},
  {t:"Documentation de la Commission européenne sur l'IA", d:"Cadre réglementaire européen et niveaux de risque des systèmes d'IA.", tag:"Réglementation"},
  {t:"Manuels scolaires de sciences numériques", d:"Chapitres d'algorithmique et de données du programme de seconde.", tag:"Programme"}
];

// --- Glossaire ---
const GLOSSAIRE = [
  ["Algorithme","Suite finie et ordonnée d'opérations pour résoudre un problème."],
  ["Apprentissage","Processus d'ajustement des paramètres d'un modèle à partir d'exemples."],
  ["Biais","Déformation systématique d'un résultat, souvent héritée des données."],
  ["Chatbot","Programme dialoguant en langage naturel avec un utilisateur."],
  ["Corpus","Ensemble de documents utilisé pour entraîner ou évaluer un modèle."],
  ["Données d'entraînement","Exemples utilisés pendant l'apprentissage du modèle."],
  ["Entraînement","Phase où le modèle ajuste ses paramètres pour réduire ses erreurs."],
  ["Éthique","Réflexion sur ce qui est juste et acceptable dans un usage technique."],
  ["Hallucination","Réponse fausse énoncée avec assurance par un modèle génératif."],
  ["Jeu de test","Données non vues à l'entraînement servant à mesurer la performance."],
  ["LLM","Grand modèle de langage entraîné à prédire le mot suivant."],
  ["Paramètre","Valeur interne ajustable qui définit le comportement du modèle."],
  ["Prompt","Consigne textuelle envoyée à un modèle génératif."],
  ["RGPD","Règlement européen encadrant le traitement des données personnelles."],
  ["Surapprentissage","Modèle trop spécialisé sur ses exemples et moins bon sur du nouveau."],
  ["Token","Fragment de texte (mot ou morceau de mot) traité par un modèle."],
  ["Transparence","Capacité à expliquer et documenter le fonctionnement d'un système."],
  ["Validation croisée","Technique d'évaluation qui alterne plusieurs découpages des données."]
];

// --- Quiz : 8 questions ---
const QUIZ = [
  {q:"Que signifie « IA » ?", o:["Intelligence artificielle","Interface automatique","Information appliquée","Intégration algorithmique"], a:0, e:"IA signifie intelligence artificielle : des techniques imitant des tâches cognitives humaines."},
  {q:"En quelle année le terme « intelligence artificielle » est-il officialisé ?", o:["1943","1956","1997","2012"], a:1, e:"C'est la conférence de Dartmouth, en 1956, qui lance officiellement l'expression."},
  {q:"Qui a proposé le test consistant à dialoguer sans être distingué d'un humain ?", o:["John McCarthy","Alan Turing","Marvin Minsky","Geoffrey Hinton"], a:1, e:"Alan Turing publie ce test en 1950 dans « Computing Machinery and Intelligence »."},
  {q:"Comment appelle-t-on un modèle qui apprend à partir d'exemples étiquetés ?", o:["Apprentissage supervisé","Apprentissage non supervisé","Renforcement","Système expert"], a:0, e:"Supervisé : chaque exemple est accompagné de la réponse attendue."},
  {q:"Qu'est-ce qu'une hallucination en IA générative ?", o:["Une panne matérielle","Une réponse fausse mais affirmée avec assurance","Un biais de données","Un pic de consommation"], a:1, e:"Le modèle génère une information erronée sans marquer d'hésitation."},
  {q:"Que mesure le RGPD ?", o:["La vitesse d'un processeur","La protection des données personnelles","Le nombre de paramètres d'un modèle","La taille d'un écran"], a:1, e:"Le RGPD encadre le traitement des données personnelles dans l'Union européenne."},
  {q:"Quelle IA est réellement disponible aujourd'hui ?", o:["L'IA forte","L'IA faible, spécialisée","L'IA consciente","Aucune des deux"], a:1, e:"Toutes les IA actuelles sont faibles : elles sont spécialisées dans une tâche."},
  {q:"À quoi sert un jeu de test ?", o:["À entraîner le modèle plus vite","À mesurer la performance sur des données inconnues","À stocker les prompts","À compresser les images"], a:1, e:"Il sert à évaluer le modèle sur des exemples qu'il n'a jamais vus."}
];