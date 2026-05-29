/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BioInfo, CommediaSection, CantoDetail, QuizQuestion, DuotoneOverlayColor } from './types';

export const danteBio: BioInfo = {
  name: "Dante Alighieri",
  title: "Il Sommo Poeta",
  birthDeath: "Firenze 1265 – Ravenna 1321",
  summary: "Dante Alighieri è considerato il padre della lingua italiana. Visse in un'epoca di forti lotte politiche a Firenze, e per le sue idee fu condannato all'esilio per sempre. Durante l'esilio scrisse il suo capolavoro, la Divina Commedia, un viaggio immaginario attraverso i tre regni dell'Aldilà: Inferno, Purgatorio e Paradiso.",
  summaryEn: "Dante Alighieri is considered the father of the Italian language. He lived in Florence during extensive political conflict and was permanently exiled. During his exile, he wrote his masterpiece, the Divine Comedy, an imaginary journey through the three realms of the Afterlife: Inferno, Purgatorio, and Paradiso.",
  keyConcepts: [
    {
      title: "L'esilio politico",
      titleEn: "Political Exile",
      desc: "Lontano da Firenze per 20 anni, scrive la Commedia sognando la giustizia e la pace nel mondo.",
      descEn: "Spent 20 years away from Florence, writing the Divine Comedy while dreaming of world peace and justice.",
      icon: "PlaneTakeoff"
    },
    {
      title: "Beatrice, la Musa",
      titleEn: "Beatrice, the Muse",
      desc: "Incontra Beatrice da giovane. Lei rappresenta la bellezza, l'amore puro e la guida spirituale.",
      descEn: "Met Beatrice in his youth. She represents beauty, pure love, and spiritual guidance.",
      icon: "Heart"
    },
    {
      title: "La lingua del popolo",
      titleEn: "The Vernacular",
      desc: "Sceglie di scrivere in volgare (l'italiano delle persone comuni) invece del latino, per farsi capire da tutti.",
      descEn: "Chose to write in the vernacular (everyday Italian) instead of Latin, so everyone could understand his message.",
      icon: "MessageSquareText"
    }
  ]
};

export const commediaIntro: CommediaSection = {
  title: "La Divina Commedia",
  titleEn: "The Divine Comedy",
  subtitle: "Il viaggio dell'anima dall'oscurità alla luce",
  subtitleEn: "The soul's journey from darkness to light",
  desc: "Un'opera straordinaria formata da 100 canti scritti in terzine (gruppi di 3 versi in rima).\nIl viaggio inizia nella terribile selva oscura e si conclude tra le stelle del Paradiso.\nRappresenta la crescita personale di ogni essere umano che supera le difficoltà per trovare la felicità.",
  descEn: "An extraordinary work consisting of 100 cantos written in tercets (groups of 3 rhyming verses).\nThe journey begins in the terrible dark forest and ends among the stars of Paradise.\nIt represents the personal growth of every human being overcoming hardships to find happiness.",
  structure: [
    {
      part: "Inferno",
      partEn: "Inferno",
      cantos: "34 Canti",
      guide: "Virgilio (La Ragione)",
      guideEn: "Virgil (Reason)",
      theme: "Il male e la sofferenza dell'anima smarrita",
      themeEn: "Evil and the suffering of the lost soul",
      color: "from-red-950 to-red-800"
    },
    {
      part: "Purgatorio",
      partEn: "Purgatorio",
      cantos: "33 Canti",
      guide: "Virgilio (La Ragione)",
      guideEn: "Virgil (Reason)",
      theme: "La purificazione e il cammino verso il bene",
      themeEn: "Purification and the upward climb towards good",
      color: "from-amber-900/60 to-orange-850/60"
    },
    {
      part: "Paradiso",
      partEn: "Paradiso",
      cantos: "33 Canti",
      guide: "Beatrice (La Fede e la Teologia)",
      guideEn: "Beatrice (Faith & Divine Love)",
      theme: "La gioia eterna e l'armonia di Dio e delle Stelle",
      themeEn: "Eternal joy and harmony of God and the Stars",
      color: "from-sky-950 to-blue-900"
    }
  ]
};

export const cantiData: CantoDetail[] = [
  {
    number: 1,
    romanNumeral: "I",
    title: "La Selva oscura",
    titleEn: "The Dark Forest and the Morning Hill",
    summary: "Dante si ritrova smarrito in una spaventosa foresta scura alle prime ore del mattino. Cerca di salire su un colle illuminato dal Sole, ma tre bestie feroci (una lonza, un leone e una lupa) gli sbarrano la strada. Quando perde ogni speranza, gli appare l'ombra del grande poeta Virgilio, che gli offre di fargli da guida attraverso l'Inferno e il Purgatorio per salvarlo.",
    summaryEn: "Dante finds himself lost in a terrifying dark forest in the early morning. He tries to climb a hill illuminated by the sun, but three wild beasts (a leopard, a lion, and a she-wolf) block his path. As he loses all hope, the shadow of the great poet Virgil appears, offering to guide him through Inferno and Purgatorio to save him.",
    focusBes: "La selva rappresenta lo smarrimento e la paura della nostra vita; la guida (Virgilio) rappresenta l'aiuto fondamentale degli altri (insegnanti, compagni, amici). I simboli facilitano la comprensione emotiva del superamento dello sgomento.",
    focusBesEn: "The dark forest represents feeling lost and afraid; the guide (Virgil) represents the support of others (teachers, companions, friends). Symbols help cognitive representation of overcoming fear.",
    tercets: [
      {
        id: 11,
        verses: [
          { text: "Nel mezzo del cammin di nostra vita" },
          { text: "mi ritrovai per una selva oscura," },
          { text: "ché la diritta via era smarrita.", lineNumber: 3 }
        ],
        paraphraseText: "A metà del percorso della vita umana, mi sono ritrovato all'interno di una foresta buia, poiché avevo smarrito la strada corretta.",
        caaSimplifiedText: "A metà della vita, Dante si perde in un bosco scuro. Ha perso la strada del bene ed è spaventato.",
        caaSymbols: [
          { word: "Crescita/Vita", symbol: "🌱", type: "concept" },
          { word: "Dante", symbol: "👤", type: "character" },
          { word: "Perso", symbol: "❓", type: "feeling" },
          { word: "Bosco Buio", symbol: "🌳", type: "setting" },
          { word: "Paura", symbol: "😨", type: "feeling" }
        ]
      },
      {
        id: 12,
        verses: [
          { text: "Ahi quanto a dir qual era è cosa dura" },
          { text: "esta selva selvaggia e aspra e forte" },
          { text: "che nel pensier rinova la paura!", lineNumber: 6 }
        ],
        paraphraseText: "Ah, quanto è difficile descrivere quanto fosse selvaggia, intricata e impenetrabile quella foresta, la cui sola memoria fa tornare la paura!",
        caaSimplifiedText: "Questo bosco è selvaggio e fitto. Solo a pensarci, a Dante torna una grandissima paura nel cuore.",
        caaSymbols: [
          { word: "Bosco Selvaggio", symbol: "🌲", type: "setting" },
          { word: "Dante", symbol: "👤", type: "character" },
          { word: "Triste/Pensiero", symbol: "🧠", type: "concept" },
          { word: "Grande Paura", symbol: "😨", type: "feeling" },
          { word: "Cuore", symbol: "❤️", type: "object" }
        ]
      },
      {
        id: 13,
        verses: [
          { text: "Ond’io, per lo tuo me’ pensando, fido" },
          { text: "che tu mi segui, e io sarò tua guida," },
          { text: "e trarrotti di qui per loco etterno;", lineNumber: 114 }
        ],
        paraphraseText: "Perciò io, pensando a ciò che sia meglio per te, ritengo sia bene che tu mi segua. Io sarò la tua guida e ti porterò via di qui attraverso il regno dell'eterno dolore (l'Inferno).",
        caaSimplifiedText: "Virgilio dice a Dante: ti aiuto io! Seguimi, io sarò la tua guida e ti porterò in viaggio nei regni dell'Aldilà per salvarti.",
        caaSymbols: [
          { word: "Virgilio", symbol: "🧙", type: "character" },
          { word: "Dante", symbol: "👤", type: "character" },
          { word: "Guidare", symbol: "🗺️", type: "action" },
          { word: "Insieme/Amicizia", symbol: "🤝", type: "concept" },
          { word: "Regno Eterno", symbol: "🔥", type: "setting" }
        ]
      }
    ]
  },
  {
    number: 2,
    romanNumeral: "II",
    title: "La Missione di Virgilio e lo Scudo di Beatrice",
    titleEn: "The Mission of Virgil and Beatrice's Shield",
    summary: "Dante si sente insicuro e teme di non essere all'altezza del viaggio. Virgilio lo rassicura svelandogli che Beatrice stessa è scesa dal Paradiso fino al Limbo per chiedergli di soccorrere Dante. Questa bellissima catena d'amore celeste fa svanire la paura del poeta, che si dichiara pronto a partire.",
    summaryEn: "Dante feels insecure and fears he is not worthy of the journey. Virgil reassures him by revealing that Beatrice herself descended from Paradise to Limbo to ask him to rescue Dante. This beautiful chain of heavenly love dissolves Dante's fear, rendering him ready to depart.",
    focusBes: "Affronta l'ansia da prestazione e il senso di inadeguatezza ('Non ce la farò mai'). L'intervento di Beatrice insegna che tutti siamo degni di cura e di aiuto protettivo.",
    focusBesEn: "Addresses performance anxiety and self-doubt ('I won't make it'). Beatrice's intervention teaches that everyone deserves protection and care.",
    tercets: [
      {
        id: 21,
        verses: [
          { text: "Lo giorno se n’andava, e l’aere bruno" },
          { text: "toglieva l’animali che sono in terra" },
          { text: "da le fatiche loro; e io sol uno", lineNumber: 3 }
        ],
        paraphraseText: "Il giorno stava finendo e l'oscurità della sera liberava tutti gli esseri viventi sulla terra dalle loro fatiche; io soltanto mi preparavo a sostenere la battaglia del cammino.",
        caaSimplifiedText: "Arriva la sera. Tutti gli animali vanno a dormire per riposare. Solo Dante è sveglio e si prepara a camminare nella notte.",
        caaSymbols: [
          { word: "Sera/Notte", symbol: "🌙", type: "setting" },
          { word: "Animali", symbol: "🐾", type: "object" },
          { word: "Dormire/Riposo", symbol: "😴", type: "action" },
          { word: "Solo", symbol: "🧍", type: "feeling" },
          { word: "Dante", symbol: "👤", type: "character" }
        ]
      },
      {
        id: 22,
        verses: [
          { text: "«I’ son Beatrice che ti faccio andare;" },
          { text: "vegno del loco ove tornar disio;" },
          { text: "amor mi mosse, che mi fa parlare.»", lineNumber: 72 }
        ],
        paraphraseText: "Io sono Beatrice che ti spinge a muoverti; vengo dal Paradiso, dove desidero ritornare. È stato l'amore puro ad animarmi e farmi parlare.",
        caaSimplifiedText: "Beatrice dice a Virgilio: vai ad aiutare Dante! Vengo dal cielo e mi muove un grande amore per lui.",
        caaSymbols: [
          { word: "Beatrice", symbol: "👼", type: "character" },
          { word: "Virgilio", symbol: "🧙", type: "character" },
          { word: "Aiutare", symbol: "🤝", type: "action" },
          { word: "Cielo/Paradiso", symbol: "⭐", type: "setting" },
          { word: "Amore Puro", symbol: "❤️", type: "feeling" }
        ]
      }
    ]
  },
  {
    number: 3,
    romanNumeral: "III",
    title: "La Porta dell'Inferno e il nocchiero Caronte",
    titleEn: "The Gate of Hell and Charon the Ferryman",
    summary: "Dante e Virgilio arrivano davanti alla terrificante Porta dell'Inferno, su cui sono incise parole spaventose (tra cui 'Lasciate ogne speranza, voi ch'intrate'). Oltrepassata la porta, si trovano davanti al fiume Acheron, dove l'irascibile traghettatore Caronte, dagli occhi di fuoco, imbarca le anime dannate.",
    summaryEn: "Dante and Virgil arrive at the terrifying Gate of Hell, which bears fearful engraved words (including 'Abandon all hope, ye who enter'). Passing through, they reach the River Acheron, where the fierce ferryman Charon, with eyes of fire, boards damnated souls into his boat.",
    focusBes: "Forte contrasto di luci e suoni spaventosi (il fuoco, le urla). Per la disabilità sensoriale, la visualizzazione grafica ad alto contrasto e il lessico semplificato consentono l'immersione senza smarrimento cognitivo.",
    focusBesEn: "Strong sensory contrasts (fire, screams). High contrast screens and simplified vocabularies allow children to experience dante's rich atmosphere without sensor-cognitive overload.",
    tercets: [
      {
        id: 31,
        verses: [
          { text: "«Per me si va ne la città dolente," },
          { text: "per me si va ne l'etterno dolore," },
          { text: "per me si va tra la perduta gente...»" },
          { text: "«Lasciate ogne speranza, voi ch'intrate».", lineNumber: 9 }
        ],
        paraphraseText: "Attraverso me (la porta) si entra nella città del pianto, nell'eterna sofferenza e tra le anime perdute per sempre. Chi entra, abbandoni ogni speranza di salvarsi.",
        caaSimplifiedText: "La porta dell'Inferno dice: da qui si va nella sofferenza eterna. Voi cattivi che entrate qui, perdete ogni speranza di salvezza.",
        caaSymbols: [
          { word: "La Porta", symbol: "🚪", type: "object" },
          { word: "Sofferenza", symbol: "😢", type: "feeling" },
          { word: "Anime Dannate", symbol: "👻", type: "character" },
          { word: "Inferno/Dolore", symbol: "🔥", type: "setting" },
          { word: "No Speranza", symbol: "❌", type: "concept" }
        ]
      },
      {
        id: 32,
        verses: [
          { text: "Ed ecco verso noi venir per nave" },
          { text: "un vecchio, bianco per antico pelo," },
          { text: "gridando: «Guai a voi, anime prave!»", lineNumber: 84 }
        ],
        paraphraseText: "Ed ecco venire verso di noi su una barca un vecchio con la barba bianca per l'età avanzata, urlando: 'Guai a voi, anime d'uomini malvagi!'",
        caaSimplifiedText: "Arriva una grossa barca con Caronte. È un vecchio arrabbiato con la barba bianca e grida forte: guai a voi anime cattive!",
        caaSymbols: [
          { word: "Barca", symbol: "⛵", type: "object" },
          { word: "Caronte Nocchiero", symbol: "👺", type: "character" },
          { word: "Barba Bianca", symbol: "👴", type: "object" },
          { word: "Gridare", symbol: "🗣️", type: "action" },
          { word: "Anime Cattive", symbol: "💀", type: "character" }
        ]
      }
    ]
  },
  {
    number: 4,
    romanNumeral: "IV",
    title: "Il Limbo e i grandi Spiriti della Poesia antica",
    titleEn: "Limbo and the Great Spirits of Ancient Poetry",
    summary: "Dante si sveglia oltre il fiume e si ritrova nel primo cerchio dell'Inferno: il Limbo. Qui risiedono le persone buone nate prima di Cristo o non battezzate, che non soffrono pene fisiche ma provano nostalgia per Dio. Nel Limbo, Dante incontra i più grandi poeti dell'antichità (Omero, Orazio, Ovidio e Lucano) che lo accolgono con onore nel loro gruppo.",
    summaryEn: "Dante wakes up past the river and finds himself in the first circle of Hell: Limbo. Here reside good people born before Christ or unbaptized, who suffer no physical pain but experience deep longing for God. Here, Dante meets the greatest ancient poets (Homer, Horace, Ovid, and Lucan), who welcome him with honor into their circle.",
    focusBes: "Il valore dell'accoglienza e della stima reciproca. I grandi poeti del passato fanno sentire Dante parte del loro gruppo, incoraggiando il senso di appartenenza scolastica e l'inclusione.",
    focusBesEn: "The value of inclusion and mutual honor. The great classical poets welcome Dante, teaching the beauty of belonging and group safety.",
    tercets: [
      {
        id: 41,
        verses: [
          { text: "Ruppemi l’alto sonno ne la testa" },
          { text: "un greve truono, sì ch’io mi riscossi" },
          { text: "come persona ch’è per forza desta;" },
          { text: "e ’ntorno mi mirai per sapere", lineNumber: 4 }
        ],
        paraphraseText: "Un forte tuono spezzò il pesante sonno nella mia testa, così che io mi svegliai improvvisamente, proprio come chi viene svegliato con la forza.",
        caaSimplifiedText: "Un grande rumore di tuono sveglia di colpo Dante, che si era addormentato. Apre subito gli occhi nella nebbia oscura.",
        caaSymbols: [
          { word: "Tuono Forte", symbol: "⚡", type: "setting" },
          { word: "Dante", symbol: "👤", type: "character" },
          { word: "Svegliarsi", symbol: "👀", type: "action" },
          { word: "Nebbia Oscura", symbol: "🌫️", type: "setting" },
          { word: "Stupore", symbol: "😮", type: "feeling" }
        ]
      },
      {
        id: 42,
        verses: [
          { text: "Quelli è Omero poeta sovrano;" },
          { text: "l'altro è Orazio satiro che vene;" },
          { text: "Ovidio è il terzo, e l'ultimo Lucano.", lineNumber: 90 }
        ],
        paraphraseText: "Quello che cammina davanti a tutti è Omero, il re dei poeti; il secondo è Orazio, autore di satire; il terzo è Ovidio e l'ultimo è Lucano.",
        caaSimplifiedText: "Virgilio mostra a Dante i più famosi poeti antichi, guidati dal grande Omero. Lo accolgono e camminano tutti insieme sorridendo.",
        caaSymbols: [
          { word: "Omero Scrittore", symbol: "👑", type: "character" },
          { word: "Poeti Antichi", symbol: "📚", type: "character" },
          { word: "Insieme/Amicizia", symbol: "🤝", type: "concept" },
          { word: "Accoglienza", symbol: "😊", type: "feeling" },
          { word: "Scuola/Studio", symbol: "🏫", type: "setting" }
        ]
      }
    ]
  },
  {
    number: 5,
    romanNumeral: "V",
    title: "Minosse e l'Amore sfortunato di Paolo e Francesca",
    titleEn: "Minos and the Ill-Fated Love of Paolo and Francesca",
    summary: "Nel secondo cerchio, Dante incontra il mostruoso giudice Minosse, che attorciglia la sua coda intorno al corpo per decidere il cerchio in cui mandare le anime. Oltrepassato il giudice, Dante vede la bufera infernale che trascina le anime dei lussuriosi. Qui ascolta la tragica e commovente storia di Paolo e Francesca, morti per un amore segreto nato leggendo un libro cavalleresco.",
    summaryEn: "In the second circle, Dante meets the monstrous judge Minos, who coils his tail around his body to decide which circle each soul goes to. Beyond, Dante sees the infernal storm sweeping the souls of the lustful. Here, he listens to the tragic, moving story of Paolo and Francesca, who died for a secret love sparked by reading a book together.",
    focusBes: "Il potere empatico della lettura condivisa ('Galeotto fu il libro...'). Un eccezionale gancio per parlare di sentimenti con gli adolescenti e superare le barriere linguistiche con l'emozione pura.",
    focusBesEn: "Emotional and relationship empathy. Reading together guides their feelings. Excellent hook to discuss love and emotions with teenagers using pure poetic imagery.",
    tercets: [
      {
        id: 51,
        verses: [
          { text: "La bufera infernal, che mai non resta," },
          { text: "menal li spirti con la sua rapina;" },
          { text: "voltando e percotendo li molesta.", lineNumber: 33 }
        ],
        paraphraseText: "La tempesta dell'Inferno, che non si ferma mai, trascina via con violenza le anime dei dannati, sbattendole in ogni direzione e tormentandole.",
        caaSimplifiedText: "Un vento pazzesco e violento trascina le anime dei lussuriosi per sempre, girandole nell'aria come foglie in autunno.",
        caaSymbols: [
          { word: "Vento Forte", symbol: "🌪️", type: "setting" },
          { word: "Anime Sospinte", symbol: "👥", type: "character" },
          { word: "Girare", symbol: "🔄", type: "action" },
          { word: "Sempre", symbol: "♾️", type: "concept" },
          { word: "Tormento", symbol: "🥺", type: "feeling" }
        ]
      },
      {
        id: 52,
        verses: [
          { text: "«Amor, ch'a nullo amato amar perdona," },
          { text: "mi prese del costui piacer sì forte," },
          { text: "che, come vedi, ancor non m'abbandona.»", lineNumber: 105 }
        ],
        paraphraseText: "L'amore, che obbliga chiunque sia amato a riamare a propria volta, mi accese di una passione così forte per Paolo che, come puoi vedere, non mi ha ancora abbandonato.",
        caaSimplifiedText: "Francesca dice: l'amore vero lega due persone per sempre. Io amo Paolo, e anche nell'Inferno stiamo vicini abbracciati.",
        caaSymbols: [
          { word: "Amore Puro", symbol: "❤️", type: "feeling" },
          { word: "Paolo e Francesca", symbol: "👩‍❤️‍👨", type: "character" },
          { word: "Abbraccio vellutato", symbol: "🫂", type: "action" },
          { word: "Sempre", symbol: "♾️", type: "concept" },
          { word: "Uniti per sempre", symbol: "🔗", type: "concept" }
        ]
      }
    ]
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Che cosa rappresenta la 'Selva Oscura' all'inizio del viaggio di Dante?",
    questionEn: "What does the 'Dark Forest' represent at the beginning of Dante's journey?",
    options: [
      "Una vera foresta in cui Dante andava a caccia da ragazzo.",
      "Un momento difficile e scorretto della vita, in cui ci si sente persi e spaventati.",
      "Il giardino incantato del castello di Beatrice."
    ],
    optionsEn: [
      "A real forest where Dante went hunting as a young boy.",
      "A difficult and lost phase of life, where one feels confused and afraid.",
      "The enchanted garden of Beatrice's castle."
    ],
    correctAnswerIndex: 1,
    feedback: "Esatto! La selva oscura ha un valore simbolico: rappresenta lo smarrimento morale ed emotivo che ognuno di noi può vivere.",
    feedbackEn: "Exactly! The dark forest has a symbolic value: it represents the moral and emotional confusion that anyone can experience."
  },
  {
    id: 2,
    question: "Chi invia il poeta Virgilio in aiuto di Dante nella selva?",
    questionEn: "Who sends the poet Virgil to help Dante in the forest?",
    options: [
      "Beatrice, mossa da un sincero amore puro e preoccupata per la salvezza di Dante.",
      "Il traghettatore Caronte per prenderlo in giro.",
      "I tre mostri feroci che volevano spingerlo via dal colle."
    ],
    optionsEn: [
      "Beatrice, moved by sincere pure love and worried about Dante's safety.",
      "The ferryman Charon to make fun of him.",
      "The three fierce beasts who wanted to scare him away from the hill."
    ],
    correctAnswerIndex: 0,
    feedback: "Bravissimo! Beatrice scende dal Paradiso per salvare Dante attraverso Virgilio, mostrando la forza del prendersi cura degli altri.",
    feedbackEn: "Well done! Beatrice descends from Paradise to save Dante through Virgil, showing the protective strength of caring for others."
  },
  {
    id: 3,
    question: "Cosa è scritto sulla spaventosa Porta dell'Inferno nel Canto III?",
    questionEn: "What is written on the frightening Gate of Hell in Canto III?",
    options: [
      "«Benvenuti nel castello dei cavalieri d'oro»",
      "«Lasciate ogne speranza, voi ch'intrate»",
      "«Solo chi indovina l'enigma può passare»"
    ],
    optionsEn: [
      "«Welcome to the golden knights castle»",
      "«Abandon all hope, ye who enter»",
      "«Only those who guess the riddle may pass»"
    ],
    correctAnswerIndex: 1,
    feedback: "Corretto! Questa durissima frase serve a spaventare i dannati e sottolinea l'irrevocabilità prima dell'approdo all'Acheronte.",
    feedbackEn: "Correct! This harsh phrase scares the damned and emphasizes the finality before arriving at the Acheron."
  },
  {
    id: 4,
    question: "Chi risiede nel primo cerchio dell'Inferno, chiamato Limbo (Canto IV)?",
    questionEn: "Who resides in the first circle of Hell, called Limbo (Canto IV)?",
    options: [
      "Gli spiriti che furono cattivi ed egoisti nella vita.",
      "Le persone giuste e buone che non poterono essere battezzate o vissero prima di Cristo.",
      "Tutti i mostri che difendono l'Inferno dantesco."
    ],
    optionsEn: [
      "Spirits who were evil and selfish during their lives.",
      "Righteous, good people who were unbaptized or lived before Christ.",
      "All the monsters that guard Dante's Inferno."
    ],
    correctAnswerIndex: 1,
    feedback: "Giusto! Nel Limbo non vi sono pene fisiche, ma solo il grande desiderio nostalgico di vedere Dio. Lì studiamo anche i grandi poeti antichi.",
    feedbackEn: "Right! In Limbo there are no physical punishments, only the nostalgic desire to see God. There we find the great ancient poets."
  },
  {
    id: 5,
    question: "Chi sono Paolo e Francesca, incontrati da Dante nel Canto V?",
    questionEn: "Who are Paolo and Francesca, met by Dante in Canto V?",
    options: [
      "Due soldati fiorentini amici d'infanzia di Virgilio.",
      "I custodi della prigione dei lussuriosi.",
      "Due giovani innamorati vissuti a Rimini, uniti da una passione nata leggendo un libro."
    ],
    optionsEn: [
      "Two Florentine soldiers who were childhood friends of Virgil.",
      "The wardens of the prison of the lustful.",
      "Two young lovers from Rimini, bound by a passion born while reading a book together."
    ],
    correctAnswerIndex: 2,
    feedback: "Perfetto! La loro dolce e malinconica storia d'amore commuove profondamente Dante, a tal punto che sviene per la troppa compassione.",
    feedbackEn: "Perfect! Their tender and melancholy love story moves Dante so deeply that he faints out of pure compassion."
  }
];

export const duotoneColors: DuotoneOverlayColor[] = [
  {
    id: "none",
    name: "Nessuno (Dark/Light)",
    nameEn: "None (Dark/Light)",
    bgHex: "",
    textColor: "",
    blendMode: ""
  },
  {
    id: "sepia",
    name: "Seppia Antico (Ipovedenti)",
    nameEn: "Sepia (High Readability)",
    bgHex: "rgba(238, 222, 186, 0.25)",
    textColor: "#3e2723",
    blendMode: "multiply"
  },
  {
    id: "cyan",
    name: "Lettura Turchese (Dislessia)",
    nameEn: "Dyslexia Cyan Filter",
    bgHex: "rgba(0, 240, 255, 0.14)",
    textColor: "#0f172a",
    blendMode: ""
  },
  {
    id: "amber",
    name: "Filtro Giallo (Contrasto)",
    nameEn: "Amber High Contrast",
    bgHex: "rgba(245, 158, 11, 0.12)",
    textColor: "#1e1b4b",
    blendMode: "screen"
  },
  {
    id: "crimson",
    name: "Fuoco Infernale (Teatrale)",
    nameEn: "Infernal Crimson Blend",
    bgHex: "rgba(220, 38, 38, 0.1)",
    textColor: "#d91b1b",
    blendMode: "multiply"
  }
];
