// --- Base de connaissances locale de l'assistant ISZ AI ---
// Chaque fiche possede des mots-cles et une reponse courte.
const KB = [
  {k:["ia","intelligence artificielle","c est quoi l ia","definition","definir"], r:"L'intelligence artificielle regroupe les techniques qui permettent à une machine d'accomplir des tâches cognitives : percevoir, raisonner, apprendre et décider.\n\nÀ retenir : toutes les IA actuelles sont « faibles », c'est-à-dire spécialisées dans un domaine précis."},
  {k:["turing","alan turing","test de turing"], r:"Alan Turing (1912-1954) est un mathématicien britannique, pionnier de l'informatique.\n\nEn 1950, il propose un test : si un juge ne peut distinguer une machine d'un humain lors d'un dialogue écrit, on peut la considérer comme « intelligente ». Ce test reste discuté, car imiter ne signifie pas comprendre."},
  {k:["revision","reviser","conseils","methode","apprendre","examen","controle"], r:"Trois conseils de révision pour ce chapitre :\n\n1. Retenez la chronologie : 1950 Turing, 1956 Dartmouth, 1997 Deep Blue, 2012 deep learning, 2022 IA générative.\n2. Distinguez toujours IA faible et IA forte, apprentissage supervisé et non supervisé.\n3. Faites le quiz de la page, puis expliquez à voix haute la différence entre hallucination et biais."},
  {k:["machine learning","apprentissage automatique","ml"], r:"Le machine learning est l'approche où la machine apprend à partir d'exemples au lieu de suivre des règles écrites à la main.\n\nOn distingue trois familles : supervisé (exemples étiquetés), non supervisé (recherche de regroupements) et renforcement (récompense ou pénalité)."},
  {k:["deep learning","apprentissage profond","profond"], r:"Le deep learning est un machine learning utilisant des réseaux de neurones à nombreuses couches.\n\nChaque couche extrait des caractéristiques de plus en plus abstraites : contours, formes, puis objets entiers pour une image."},
  {k:["reseau de neurones","neurone","neurones","perceptron"], r:"Un réseau de neurones artificiel est un assemblage d'unités de calcul reliées entre elles.\n\nChaque connexion possède un poids ajusté pendant l'entraînement. Le réseau ne « pense » pas : il minimise une erreur sur des exemples."},
  {k:["ethique","ethique de l ia","morale","responsabilite"], r:"Les questions éthiques portent sur trois axes : les biais des données, la protection des données personnelles et la responsabilité en cas d'erreur.\n\nUn principe utile : l'humain reste décideur, la machine reste un outil d'aide à la décision."},
  {k:["biais","discrimination","biais algorithmique"], r:"Un biais algorithmique est une déformation systématique du résultat, souvent héritée des données d'entraînement.\n\nSi les données sous-représentent un groupe, le modèle produira des résultats moins fiables pour ce groupe. Le corriger demande d'auditer les données et les résultats."},
  {k:["rgpd","donnees personnelles","vie privee","cnil"], r:"Le RGPD est le règlement européen sur la protection des données personnelles, entré en application en 2018.\n\nIl impose une base légale pour collecter des données, un droit d'accès et de suppression, et une information claire des personnes."},
  {k:["hallucination","invente","faux","erreur"], r:"Une hallucination est une réponse fausse énoncée avec assurance par un modèle génératif.\n\nUn modèle de langage prédit la suite la plus probable, il ne vérifie pas les faits. D'où la règle : toujours recouper une information importante."},
  {k:["prompt","consigne","formuler","requete"], r:"Un prompt est la consigne donnée à un modèle génératif.\n\nUn bon prompt précise le rôle attendu, le contexte, le format de sortie et les contraintes. Plus la demande est explicite, plus la réponse est utilisable."},
  {k:["ia generative","generatif","chatgpt","image","texte genere"], r:"L'IA générative produit du contenu nouveau : texte, image, son ou code.\n\nElle ne copie pas une base de données : elle prédit, étape par étape, l'élément le plus plausible selon la consigne reçue."},
  {k:["dartmouth","1956","naissance"], r:"La conférence de Dartmouth, à l'été 1956, officialise l'expression « intelligence artificielle ».\n\nJohn McCarthy et Marvin Minsky y réunissent des chercheurs convaincus qu'un programme peut simuler l'intelligence."},
  {k:["deep blue","kasparov","echecs","1997"], r:"Deep Blue est le superordinateur d'IBM qui bat Garry Kasparov aux échecs en 1997.\n\nIl combine une exploration massive de coups et une fonction d'évaluation écrite par des experts."},
  {k:["alphago","go","2016","sedol"], r:"AlphaGo, développé par DeepMind, bat Lee Sedol au jeu de go en 2016.\n\nIl associe des réseaux de neurones et une exploration arborescente, ce qui dépasse les méthodes par force brute."},
  {k:["energie","ecologie","environnement","carbone"], r:"L'IA a un coût énergétique : l'entraînement des grands modèles consomme beaucoup d'électricité et d'eau de refroidissement.\n\nÀ l'inverse, l'IA peut optimiser des réseaux électriques ou logistiques. Le bilan dépend donc fortement de l'usage."},
  {k:["emploi","travail","metier","automatisation"], r:"L'IA automatise des tâches, rarement des métiers entiers.\n\nLes postes les plus exposés sont ceux qui combinent des tâches répétitives et des données numériques. Les compétences de contrôle, de vérification et de relation humaine prennent de la valeur."},
  {k:["chatbot","assistant","conversation","isz ai","qui es tu"], r:"Je suis ISZ AI, un assistant local intégré à ce site.\n\nJe fonctionne sans connexion : je compare votre question à des fiches internes et je renvoie la plus proche. Je peux me tromper, vérifiez les points importants dans le cours."},
  {k:["quiz","test","question","exercice"], r:"Le quiz de la page contient huit questions sur les notions clés du cours.\n\nIl indique immédiatement si la réponse est juste et donne une courte explication. Vous pouvez le recommencer autant de fois que vous voulez."},
  {k:["glossaire","vocabulaire","definition mot"], r:"Le glossaire rassemble dix-huit termes techniques, de « algorithme » à « validation croisée ».\n\nIl est utile juste avant une évaluation pour vérifier le vocabulaire."},
  {k:["equipe","qui a fait","auteur","lycee","ouakraf","oukraf"], r:"Ce site est un projet pédagogique du Lycée Oukraf Mohamed, réalisé sous le label ISZ.\n\nIl a été conçu comme un support de cours utilisable hors ligne, sans compte et sans bibliothèque externe."},
  {k:["merci","thanks","chokran","شكرا"], r:"Avec plaisir. Si vous voulez réviser, essayez « Conseils de révision » ou lancez le quiz."},
  {k:["bonjour","salut","salam","مرحبا","السلام"], r:"Bonjour ! Je peux expliquer une notion du cours, détailler une date clé ou proposer une méthode de révision.\n\nQue voulez-vous revoir ?"},
  {k:["ما هو الذكاء الاصطناعي","الذكاء الاصطناعي","تعريف"], r:"الذكاء الاصطناعي هو مجموعة التقنيات التي تسمح للآلة بأداء مهام ذهنية مثل الإدراك والاستدلال والتعلّم.\n\nكل أنظمة الذكاء الاصطناعي الحالية «ضعيفة»، أي متخصصة في مجال محدد."},
  {k:["من هو تورينغ","تورينغ","تورينج"], r:"آلان تورينغ عالم رياضيات بريطاني، رائد في علم الحاسوب.\n\nفي 1950 اقترح اختبارًا: إذا لم يستطع الحكم التمييز بين آلة وإنسان في حوار مكتوب، يمكن اعتبار الآلة «ذكية»."},
  {k:["نصائح للمراجعة","المراجعة","مراجعة"], r:"ثلاث نصائح للمراجعة:\n\n1. احفظ التواريخ الأساسية: 1950، 1956، 1997، 2012، 2022.\n2. ميّز بين الذكاء الضعيف والقوي.\n3. أجب عن الأسئلة في صفحة الاختبار ثم اشرح الفرق بين الهلوسة والتحيّز."}
];

/* ============================================================
   MOTEUR ISZ AI : NORMALISATION, SIMILARITE, SELECTION
   ============================================================ */

// Retire accents, ponctuation et majuscules pour comparer les textes.
function norm(s){
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Mots vides français ignorés lors de la comparaison.
const STOP = new Set(["le","la","les","un","une","des","de","du","au","aux","et","ou","a","en","dans","pour","sur","que","qui","quoi","est","ce","c","il","elle","on","nous","vous","je","tu","se","sa","son","ses","mon","ma","mes","the","of","to","is","what","comment","pourquoi","quand","quel","quelle","s","d","l","j","y"]);

// Découpe un texte en mots significatifs.
function words(s){
  return norm(s).split(" ").filter(w => w.length > 1 && !STOP.has(w));
}

// Distance de Levenshtein, utilisée pour tolérer les fautes de frappe.
function lev(a, b){
  if(a === b) return 0;
  if(!a.length) return b.length;
  if(!b.length) return a.length;
  let prev = Array.from({length: b.length + 1}, (_, i) => i);
  for(let i = 1; i <= a.length; i++){
    const cur = [i];
    for(let j = 1; j <= b.length; j++){
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

// Score de proximité entre la question et une fiche (0 = aucune correspondance).
function score(question, entry){
  const q = words(question);
  const qn = norm(question);
  if(!q.length) return 0;
  let best = 0;

  entry.k.forEach(key => {
    const kn = norm(key);
    // Correspondance directe de l'expression entière
    if(qn.includes(kn)) best = Math.max(best, 4 + kn.length / 12);
    const kw = words(key);
    // Correspondance mot à mot, avec tolérance aux fautes
    kw.forEach(kwWord => {
      q.forEach(qWord => {
        if(qWord === kwWord) best = Math.max(best, 3);
        else if(kwWord.length > 4 && lev(qWord, kwWord) <= 1) best = Math.max(best, 2);
      });
    });
  });
  return best;
}

// Choisit la meilleure fiche pour la question posée.
function answer(question){
  let top = null, topScore = 0;
  KB.forEach(entry => {
    const s = score(question, entry);
    if(s > topScore){ topScore = s; top = entry; }
  });
  if(top && topScore >= 3) return {text: top.r, ok: true};
  return {
    text: "Je n'ai pas trouvé de fiche correspondant à cette question.\n\nEssayez des mots du cours : intelligence artificielle, Turing, machine learning, biais, RGPD, hallucination, quiz, révision.",
    ok: false
  };
}