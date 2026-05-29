/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  User,
  Compass,
  FileQuestion,
  Layers,
  Sparkles,
  Wand2,
  Eye,
  Languages,
  Sun,
  Moon,
  Palette,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  XCircle,
  Activity,
  Award,
  BookMarked,
  Info,
  Trash2,
  Plus,
  X,
  ClipboardList,
  AlertCircle,
  History,
  BarChart2,
  Calendar,
  Upload,
  Image,
  Users,
  Settings,
  Play,
  Pause,
  Square,
  Headphones,
  SkipForward,
  SkipBack,
  Volume1,
  Search,
  Filter,
  Tag,
  Crop,
  GripVertical
} from "lucide-react";

import { danteBio, commediaIntro, cantiData, quizQuestions, duotoneColors } from "./data";
import { libraryItems, LibraryItem } from "./libraryData";
import { CantoDetail, Tercet, QuizQuestion, DuotoneOverlayColor, QuizReport } from "./types";
import { DanteUniverseExplorer } from "./components/DanteUniverseExplorer";

// Dynamic imports of generated images
// @ts-ignore
import heroImg from "./assets/images/hero_inferno_stars_1779704457533.png";
// @ts-ignore
import danteImg from "./assets/images/portrait_dante_1779704478364.png";
// @ts-ignore
import danteTransparentImg from "./assets/images/portrait_dante_transparent.png";
// @ts-ignore
import journeyImg from "./assets/images/journey_virgil_dante_1779704497387.png";

import { TransparentImage } from "./components/TransparentImage";

const openDanteDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("dante_media_db", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveMediaToDB = async (key: string, data: Blob | string): Promise<void> => {
  try {
    const db = await openDanteDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("media", "readwrite");
      const store = transaction.objectStore("media");
      const request = store.put(data, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB save error:", err);
  }
};

const getMediaFromDB = async (key: string): Promise<Blob | string | null> => {
  try {
    const db = await openDanteDB();
    return new Promise<Blob | string | null>((resolve, reject) => {
      const transaction = db.transaction("media", "readonly");
      const store = transaction.objectStore("media");
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB read error:", err);
    return null;
  }
};

const processFileUpload = (
  file: File,
  setUrl: (u: string) => void,
  setType: (t: "image" | "video") => void
): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    const isVideo = file.type.startsWith("video/");
    const mediaKey = `indexeddb://media-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    if (isVideo) {
      await saveMediaToDB(mediaKey, file);
      setUrl(mediaKey);
      setType("video");
      resolve();
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          compressImageToDataUrl(event.target.result as string).then(async (compressedUrl) => {
            await saveMediaToDB(mediaKey, compressedUrl);
            setUrl(mediaKey);
            setType("image");
            resolve();
          });
        } else {
          resolve();
        }
      };
      reader.onerror = () => resolve();
      reader.readAsDataURL(file);
    }
  });
};

const safeLocalStorageSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(`Error saving to localStorage for key ${key}:`, e);
  }
};

const compressImageToDataUrl = (dataUrl: string, maxWidth = 1000, maxHeight = 625, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      resolve(dataUrl);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } catch (e) {
          console.error("Failed to export canvas as compressed JPEG", e);
          resolve(dataUrl);
        }
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
};

const explorerCircleData = [
  {
    id: 0,
    title: "Canto I - La Selva Oscura",
    canto: "Canto I",
    luogo: "La Selva Oscura (luogo dello smarrimento morale)",
    personaggi: "Dante, Virgilio",
    custodi: "Le tre Fiere (Lonza, Leone, Lupa)",
    contrappasso: "Smarrimento morale ed intellettuale primordiale.\nLa selva fitta impedisce il cammino verso la verità ed il colle illuminato dal sole.",
    versi: "Nel mezzo del cammin di nostra via\nmi ritrovai per una selva oscura,\nché la diritta via era smarrita.",
    parafrasi: "A metà del cammino della vita umana, mi ritrovai in una foresta buia e fitta (simbolo del peccato), poiché avevo smarrito la retta via del bene."
  },
  {
    id: 1,
    title: "Canto II - La Selva Oscura",
    canto: "Canto II",
    luogo: "Pendice del colle (piaggia diserta)",
    personaggi: "Dante, Virgilio (evocate Beatrice, Lucia, Santa Maria)",
    custodi: "Nessun custode punitivo (intervento provvidenziale di Beatrice)",
    contrappasso: "Il dubbio morale e la pusillanimità intellettuale prima del duro tragitto salvifico.\nContrappasso: la provvidenziale rassicurazione celeste che sprona a superare la viltà ed a mettersi in cammino.",
    versi: "O donna di virtù, sola per cui\nl'umana spezie eccede ogne contento\ndi quel ciel c'ha minor li cerchi sui...",
    parafrasi: "O donna piena di virtù, grazie alla quale soltanto il genere umano sorpassa ogni elemento racchiuso sotto il cielo della Luna (la Terra)."
  },
  {
    id: 2,
    title: "Canto III - Antinferno e Fiume Acheronte",
    canto: "Canto III",
    luogo: "Antinferno (sponde del fiume Acheronte)",
    personaggi: "Gli Ignavi, Celestino V (identificato come colui che fece il gran rifiuto), Caronte",
    custodi: "Caronte (il nocchiero delle anime perse con gli occhi di fiamme)",
    contrappasso: "Ignavia (chi visse senza infamia e senza lode, incapace di compiere delle scelte).\nContrappasso: non avendo preso alcuna posizione in vita, corrono inutilmente nudi dietro un'insegna mutevole, punti da miriadi di vespe e mosconi.",
    versi: "Lasciate ogne speranza, voi ch'intrate.",
    parafrasi: "Abbandonate ogni speranza di ricevere la salvezza o di rivedere il cielo, voi che state entrando da questa porta."
  },
  {
    id: 3,
    title: "Canto IV - Cerchio I: Limbo",
    canto: "Canto IV",
    luogo: "Cerchio I: Il Limbo (un nobile ed elevato castello cinto da sette alte mura)",
    personaggi: "Grandi Poeti (Omero, Orazio, Ovidio, Lucano), Spiriti Magni (Aristotele, Socrate, Platone, Enea, Cesare)",
    custodi: "Assenti (un'atmosfera protetta di quiete e malinconia filosofica)",
    contrappasso: "Mancanza di battesimo e peccato di nascita prima di Cristo. Pur essendo anime elette ed integerrime, non possiedono la fede divina.\nLa loro pena eterna consiste in un perenne desiderio di vedere Dio, tormentatamente e senza alcuna speranza di ottenerlo.",
    versi: "Quivi, secondo che per ascoltare,\nnon avea pianto mai che di sospiri\nche l'aura etterna facevan tremare...",
    parafrasi: "In quel luogo, a giudicare dalle sensazioni udite, non c'erano pianti di strazio ma unicamente profondi sospiri che facevano tremare l'aria infinita."
  },
  {
    id: 4,
    title: "Canto V - Cerchio II: Lussuriosi",
    canto: "Canto V",
    luogo: "Cerchio II (una cavità d'aria cieca ed urlante)",
    personaggi: "Paolo e Francesca, Semiramide, Didone, Cleopatra, Elena, Achille, Paride",
    custodi: "Minosse (giudice demoniaco che confessa le anime e decreta il cerchio cingendosi con le spire della coda)",
    contrappasso: "Lussuria (sottomissione della ragione al piacere dei sensi).\nContrappasso per analogia diretta: come in vita si fecero guidare e travolgere ciecamente dai moti passionali dell'istinto amoroso, ora sono eternamente sbattuti e strascinati da una tremenda ed inarrestabile bufera di vento scuro.",
    versi: "Amor, ch'a nullo amato amar perdona,\nmi prese del costui piacer sì forte,\nche, come vedi, ancor non m'abbandona.",
    parafrasi: "L'amore, che obbliga irrevocabilmente chi è amato a ricambiare l'amore, mi prese per la bellezza e il fascino di costui con tanta forza che, come vedi, non mi ha ancora lasciato."
  }
];

const simplifiedTexts: Record<string, { it: string; en: string }> = {
  pedagogical_desc: {
    it: "Questa è una scuola digitale per tutti. Aiuta a imparare in tanti modi diversi, con immagini, simboli e testi facili da capire.",
    en: "This is a digital school for everyone. It helps you learn in many different ways with images, symbols, and easy texts."
  },
  dante_summary: {
    it: "Dante Alighieri è uno scrittore famosissimo. Ha scritto il suo libro più bello, la Divina Commedia, mentre era lontano da casa. Questo libro racconta un viaggio speciale nell'Aldilà.",
    en: "Dante Alighieri is a very famous writer. He wrote his best book, the Divine Comedy, while far from home. This book tells a special journey into the Afterlife."
  },
  concept_title_0: {
    it: "L'esilio",
    en: "The Exile"
  },
  concept_desc_0: {
    it: "Dante è dovuto stare lontano dalla sua città per venti anni. Lì ha scritto del suo sogno di pace.",
    en: "Dante had to stay away from his city for twenty years. There, he wrote about his dream of peace."
  },
  concept_title_1: {
    it: "Beatrice, la guida",
    en: "Beatrice, the guide"
  },
  concept_desc_1: {
    it: "Beatrice è una donna che Dante ama moltissimo. Lei lo aiuta e lo guida con tanto amore.",
    en: "Beatrice is a woman Dante loves very much. She helps him and guides him with great love."
  },
  concept_title_2: {
    it: "La lingua semplice",
    en: "Simple language"
  },
  concept_desc_2: {
    it: "Dante scrive con le parole semplici che usano le persone comuni, così tutti possono capire il libro.",
    en: "Dante writes with simple words that common people use, so everyone can understand his book."
  },
  commedia_desc: {
    it: "La Divina Commedia è un libro formato da cento parti chiamate canti. Il viaggio parte da una foresta buia e finisce in cielo tra le stelle. Parla di come superare i momenti difficili.",
    en: "The Divine Comedy is a book made of one hundred parts called cantos. The journey starts in a dark forest and ends in heaven among the stars. It talks about overcoming difficult times."
  },
  theme_inferno: {
    it: "Il posto dei cattivi e la grande tristezza dell'anima.",
    en: "The place of bad actions and the deep sadness of the soul."
  },
  theme_purgatorio: {
    it: "Il cammino per correggere gli errori e fare del bene.",
    en: "The path to correct errors and do good."
  },
  theme_paradiso: {
    it: "La felicità per sempre tra le stelle del cielo.",
    en: "Happiness forever among the stars of heaven."
  },
  journey_desc: {
    it: "L'Inferno è un grande imbuto sotto terra. Ha nove cerchi dove chi si è comportato male riceve una punizione. Dante e Virgilio scendono insieme questi gradini fino a raggiungere il centro della Terra.",
    en: "Inferno is a big underground funnel. It has nine circles where people who did bad things receive a punishment. Dante and Virgil go down these steps together to the center of the Earth."
  },
  didattica_alert: {
    it: "Qui puoi esplorare facilmente tutti i canti. Se attivi i pulsanti in alto, trovi versioni semplici e parole d'aiuto per studiare meglio.",
    en: "Here you can easily explore all the cantos. If you click the buttons at the top, you will find simple versions and helpful words to study better."
  },
  canto_summary_1: {
    it: "Dante si perde in una foresta buia. Cerca di salire una collina al sole, ma tre animali feroci gli chiudono la strada. Arriva poi lo spirito del poeta Virgilio che lo aiuta e diventa la sua guida.",
    en: "Dante gets lost in a dark forest. He tries to climb a sunny hill, but three wild animals block his way. The spirit of the poet Virgil arrives to help him and guide him."
  },
  canto_summary_2: {
    it: "Dante ha paura di non farcela. Virgilio gli dice che Beatrice è scesa dal cielo per chiedere di salvare Dante. Sapendo questo, a Dante torna subito il coraggio e parte felice.",
    en: "Dante is afraid he cannot succeed. Virgil tells him Beatrice came down from heaven to save Dante. Knowing this, Dante gets his courage back and happily starts his journey."
  },
  canto_summary_3: {
    it: "Dante e Virgilio arrivano alla Porta dell'Inferno, una porta con parole molto paurose. Entrano e vedono un grande fiume dove Caronte, un vecchio arrabbiato con occhi infuocati, porta le anime sulla barca.",
    en: "Dante and Virgil arrive at the Gate of Hell, a gate with scary words. They enter and see a big river where Charon, an angry old man with fiery eyes, takes souls on his boat."
  },
  canto_summary_4: {
    it: "Dante si sveglia nel primo cerchio dell'Inferno, chiamato Limbo. Qui ci sono le persone buone vissute prima di Gesù Cristo. I poeti più importanti del passato accolgono Dante con amicizia e onore.",
    en: "Dante wakes up in the first circle of Hell, called Limbo. Good people who lived before Jesus Christ are here. The most important poets of the past welcome Dante with friendship and honor."
  },
  canto_summary_5: {
    it: "Nel secondo cerchio c'è il mostro Minosse che giudica le anime con la sua coda. Poi Dante vede una grande tempesta di vento. Lì incontra Paolo e Francesca, due innamorati che stanno sempre uniti.",
    en: "In the second circle, the monster Minos judges souls with his tail. Then Dante sees a big wind storm. There he meets Paolo and Francesca, two lovers who always stay together."
  },
  canto_focus_1: {
    it: "La foresta buia rappresenta le nostre paure. La guida Virgilio ci insegna l'importanza di chiedere aiuto ai professori, ai compagni di classe o agli amici di sempre.",
    en: "The dark forest represents our fears. Virgil, the guide, teaches us the importance of asking for help from teachers, schoolmates, or friends."
  },
  canto_focus_2: {
    it: "Parla dell'ansia e quando pensiamo di non essere capaci. Beatrice ci ricorda che tutti siamo speciali e meritiamo di essere aiutati e voluti bene.",
    en: "Speaks of anxiety and when we think we're not capable. Beatrice reminds us that we are all special and deserve to be helped and loved."
  },
  canto_focus_3: {
    it: "Insegna a superare la paura dei forti rumori e del fuoco. L'uso di parole chiare e facili permette a tutti di ascoltare la storia senza agitazione.",
    en: "Teaches how to overcome fear of loud noises and fire. Using clear and simple words allows everyone to enjoy the story peacefully."
  },
  canto_focus_4: {
    it: "Incontra l'importanza dell'accoglienza e dell'amicizia a scuola. Sentirsi accolti e inclusi in un gruppo ci rende più forti e felici.",
    en: "Shows the importance of welcome and school friendship. Feeling included and part of a group makes us stronger and happier."
  },
  canto_focus_5: {
    it: "Parla del potere magico della lettura assieme. Leggere un libro con qualcuno ci aiuta a capire meglio le emozioni e a superare ogni distanza.",
    en: "Speaks about the magic power of reading together. Reading a book with someone helps us understand feelings and overcome distances."
  }
};

interface GlossaryTerm {
  word: string;
  definitionIt: string;
  definitionEn: string;
  tercetLabelIt: string;
  tercetLabelEn: string;
  tercetId: number;
  cantoIndex: number;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    word: "cammin",
    definitionIt: "Il percorso o viaggio. Rappresenta la durata media della vita terrena dell'uomo.",
    definitionEn: "The path or journey. It represents the average lifespan of human earthly journey.",
    tercetLabelIt: "Canto I • Terzina 1",
    tercetLabelEn: "Canto I • Tercet 1",
    tercetId: 11,
    cantoIndex: 0
  },
  {
    word: "oscura",
    definitionIt: "Buia e tenebrosa. Simboleggia la cecità spirituale e la perdita della retta via.",
    definitionEn: "Dark and gloomy. Symbolizes spiritual blindness and losing the straight path.",
    tercetLabelIt: "Canto I • Terzina 1",
    tercetLabelEn: "Canto I • Tercet 1",
    tercetId: 11,
    cantoIndex: 0
  },
  {
    word: "smarrita",
    definitionIt: "Perduta, allontanata. Indica lo smarrimento interiore dovuto alle cattive abitudini del peccato.",
    definitionEn: "Lost, gone astray. Indicates the inner disorientation due to bad habits of sin.",
    tercetLabelIt: "Canto I • Terzina 1",
    tercetLabelEn: "Canto I • Tercet 1",
    tercetId: 11,
    cantoIndex: 0
  },
  {
    word: "esta",
    definitionIt: "Arcaico di 'questa'. Usato per indicare immediatezza e coinvolgimento emotivo forte.",
    definitionEn: "Archaic word for 'this'. Used to denote immediacy and strong emotional involvement.",
    tercetLabelIt: "Canto I • Terzina 2",
    tercetLabelEn: "Canto I • Tercet 2",
    tercetId: 12,
    cantoIndex: 0
  },
  {
    word: "forte",
    definitionIt: "Fitta, aggrovigliata e difficile da attraversare, impenetrabile.",
    definitionEn: "Dense, tangled, and extremely hard to cross or escape; impenetrable.",
    tercetLabelIt: "Canto I • Terzina 2",
    tercetLabelEn: "Canto I • Tercet 2",
    tercetId: 12,
    cantoIndex: 0
  },
  {
    word: "me’",
    definitionIt: "Per lo tuo 'me’' significa per il tuo 'bene' o il tuo meglio.",
    definitionEn: "For your 'best' or 'good'. Shortened form derived from 'meglio'.",
    tercetLabelIt: "Canto I • Terzina 3",
    tercetLabelEn: "Canto I • Tercet 3",
    tercetId: 13,
    cantoIndex: 0
  },
  {
    word: "trarrotti",
    definitionIt: "Ti trarrò, ti tirerò fuori. Una antica forma contratta verbale con clitico.",
    definitionEn: "I will draw thee / pull thee out of here. An old contracted verb structure.",
    tercetLabelIt: "Canto I • Terzina 3",
    tercetLabelEn: "Canto I • Tercet 3",
    tercetId: 13,
    cantoIndex: 0
  },
  {
    word: "aere bruno",
    definitionIt: "L'aria scura e oscurata della sera, tipica dell'imbrunire.",
    definitionEn: "The dark, darkened air of evening twilight.",
    tercetLabelIt: "Canto II • Terzina 1",
    tercetLabelEn: "Canto II • Tercet 1",
    tercetId: 21,
    cantoIndex: 1
  },
  {
    word: "dolente",
    definitionIt: "Piena di dolore, pianti e perenne sofferenza.",
    definitionEn: "Wretched, full of ultimate grief, weeping and eternal pain.",
    tercetLabelIt: "Canto III • Terzina 1",
    tercetLabelEn: "Canto III • Tercet 1",
    tercetId: 31,
    cantoIndex: 2
  },
  {
    word: "prave",
    definitionIt: "Malvage, peccatrici, maldisposte verso il bene.",
    definitionEn: "Depraved, wicked, evil, turned away from goodness.",
    tercetLabelIt: "Canto III • Terzina 2",
    tercetLabelEn: "Canto III • Tercet 2",
    tercetId: 32,
    cantoIndex: 2
  },
  {
    word: "greve",
    definitionIt: "Pesante, cupo e rimbombante, che scuote pesantemente.",
    definitionEn: "Heavy, deep and dark, shaking with massive resonance.",
    tercetLabelIt: "Canto IV • Terzina 1",
    tercetLabelEn: "Canto IV • Tercet 1",
    tercetId: 41,
    cantoIndex: 3
  },
  {
    word: "rapina",
    definitionIt: "Furia travolgente, violenza scatenata dal vento eterno.",
    definitionEn: "Surging frenzy, violent dragging sweep of the eternal wind.",
    tercetLabelIt: "Canto V • Terzina 1",
    tercetLabelEn: "Canto V • Tercet 1",
    tercetId: 51,
    cantoIndex: 4
  }
];

const DISCIPLINES_STUDY_DATA: Record<string, any> = {
  "Inglese": {
    bioTitleIt: "Il Bardo dell'Avon",
    bioTitleEn: "The Bard of Avon",
    bio: {
      name: "William Shakespeare",
      birthDeath: "Stratford-upon-Avon 1564 – 1616",
      summary: "William Shakespeare è considerato il più grande drammaturgo inglese. Scrisse capolavori immortali come Amleto, Romeo e Giulietta, e La Tempesta, esplorando l'animo umano con l'uso poetico della lingua inglese.",
      summaryEn: "William Shakespeare is considered the ultimate English playwright. He authored legendary masterworks like Hamlet, Romeo and Juliet, and The Tempest, exploring human nature with peerless linguistic mastery.",
      keyConcepts: [
        {
          title: "Teatro per Tutti",
          titleEn: "Theater for Everyone",
          desc: "Le sue opere parlavano sia ai nobili sia al popolo comune nei teatri all'aperto di Londra.",
          descEn: "His plays spoke both to nobles and commoners in the lively open-air Globe Theatre of London.",
          icon: "Compass"
        },
        {
          title: "La Tempesta",
          titleEn: "The Tempest",
          desc: "Un viaggio fantastico su un'isola magica dove il duca Prospero predilige il perdono alla vendetta.",
          descEn: "A magical island journey where duke Prospero chooses forgiveness over resentment.",
          icon: "Sparkles"
        },
        {
          title: "Il Neologista",
          titleEn: "Word Creator",
          desc: "Ha inventato centinaia di parole ed espressioni inglesi usate ancora oggi.",
          descEn: "Invented hundreds of English words and expressions still in active daily use today.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "La Tempesta (The Tempest)",
      titleEn: "The Tempest",
      subtitle: "La meraviglia del perdono e della giustizia",
      subtitleEn: "The miracle of forgiveness and reconciliation",
      desc: "L'ultima grande opera interamente scritta da Shakespeare. Racconta del mago Prospero e dello spirito Ariel su una remota isola magica, dove la vendetta si trasforma in pacificazione sociale.",
      descEn: "The final major play written entirely by Shakespeare. It follows the wizard Prospero and the airy spirit Ariel on a magical island, where revenge fades into global peace.",
      structure: [
        {
          part: "Atto I: Il Naufragio",
          partEn: "Act I: The Shipwreck",
          cantos: "La burrasca magica",
          guide: "Prospero (La Mente)",
          guideEn: "Prospero (The Mind)",
          theme: "L'esilio forzato e la giustizia restaurata con la magia",
          themeEn: "Forced exile and justice restored through natural magic",
          color: "from-blue-950 to-indigo-900"
        },
        {
          part: "Atto II-IV: L'Isola",
          partEn: "Act II-IV: The Island",
          cantos: "Creature magiche",
          guide: "Ariel (Lo Spirito)",
          guideEn: "Ariel (The Spirit)",
          theme: "L'incontro guidato con Calibano, creatura grezza",
          themeEn: "The guided meeting with Caliban, representing raw earth",
          color: "from-teal-950 to-emerald-900/60"
        },
        {
          part: "Atto V: La Libertà",
          partEn: "Act V: Freedom",
          cantos: "La via della pace",
          guide: "Il Perdono",
          guideEn: "Unconditional Forgiveness",
          theme: "La rinuncia alla vendetta e la liberazione di Ariel",
          themeEn: "Renouncing revenge and letting Ariel fly free at last",
          color: "from-orange-950 to-amber-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "Naufragio e Incantesimo",
        titleEn: "Shipwreck and Spellbound",
        summary: "Prospero scatena una finta tempesta spaventosa per far approdare i suoi vecchi nemici sulla spiaggia del suo regno magico, proteggendoli per non far male a nessuno.",
        summaryEn: "Prospero unleashes a majestic, safe mock storm on the sea, shipwrecking his past betrayers onto his island shore while guaranteeing everyone's safety.",
        focusBes: "Insegna che le bufere temporanee della vita possono essere padroneggiate ed indirizzate verso una soluzione positiva.",
        focusBesEn: "Uplifts the pedagogical insight that temporary storms can be managed under proper guide.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "We are merely cheated of our lives by drunkards!" },
              { text: "This wide-chapp'd rascal!—Would thou mightst lie drowning", lineNumber: 2 }
            ],
            paraphraseText: "Siamo ingannati e privati delle nostre esistenze da degli ubriaconi! Questo imbroglione dalle mascelle larghe! Magari tu finissi annegato sotto l'onda di dieci maree!",
            caaSimplifiedText: "La tempesta scuote la nave. I marinai hanno paura di affogare. Prospero usa una magia buona per proteggerli e salvarli.",
            caaSymbols: [
              { word: "Nave", symbol: "⛵", type: "object" },
              { word: "Tempesta", symbol: "⛈️", type: "setting" },
              { word: "Persona", symbol: "👤", type: "character" },
              { word: "Magia", symbol: "🪄", type: "action" },
              { word: "Salvo", symbol: "💚", type: "feeling" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Chi aiuta Prospero a compiere le magie sull'isola?",
        questionEn: "Who assists Prospero in carrying out magic on the island?",
        options: [
          "Il marinaio ubriaco Stefano",
          "Ariel, lo spirito fatato leggero dell'aria",
          "Il mostro Calibano"
        ],
        optionsEn: [
          "The drunken sailor Stephano",
          "Ariel, the light-hearted airy spirit",
          "The monster Caliban"
        ],
        correctAnswerIndex: 1,
        feedback: "Esatto! Ariel assiste Prospero con fedeltà in cambio della promessa di libertà finale.",
        feedbackEn: "Correct! Ariel serves Prospero loyally in exchange for the promise of ultimate freedom."
      }
    ]
  },
  "Francese": {
    bioTitleIt: "L'Aviatore Scrittore",
    bioTitleEn: "The Pilot Writer",
    bio: {
      name: "Antoine de Saint-Exupéry",
      birthDeath: "Lione 1900 – Mar Mediterraneo 1944",
      summary: "Scrittore e pilota d'aerei francese, famoso in tutto il cosmo per 'Il Piccolo Principe', un racconto poetico che ricorda di coltivare l'essenziale e la purezza.",
      summaryEn: "French writer and iconic pilot, worldwide cherished for 'The Little Prince', which reminds us to cherish the pure essence of life.",
      keyConcepts: [
        {
          title: "Sguardo del Cuore",
          titleEn: "Eyes of the Heart",
          desc: "Il vero significato delle cose importanti è invisibile agli occhi e comprensibile solo con l'affetto.",
          descEn: "The true meaning of essential things is invisible to eyes and captured only with genuine love.",
          icon: "Heart"
        },
        {
          title: "La Rosa e la Cura",
          titleEn: "The Rose and Care",
          desc: "Prendersi cura quotidiana di un legame fa nascere un affetto profondo che rende speciale l'altro.",
          descEn: "Nurturing relationship with patient attention transforms simple ties into deep attachments.",
          icon: "Sparkles"
        },
        {
          title: "Fissazioni dei Grandi",
          titleEn: "Adult habits",
          desc: "Il libro sorride con dolcezza dei difetti e delle insensatezze tipiche degli adulti solitari.",
          descEn: "Gently mocks key adult flaws, from endless greed to dry paperwork obsession.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "Il Piccolo Principe",
      titleEn: "The Little Prince",
      subtitle: "La dolcezza dell'amore e dell'amicizia sincera",
      subtitleEn: "The sweetness of authentic love and friendship",
      desc: "L'incontro poetico nel mezzo del deserto del Sahara tra un pilota e un ragazzino biondo venuto dall'asteroide B-612 per scoprire i valori portanti del vivere insieme.",
      descEn: "A beautiful meeting in the Sahara desert between a pilot and a blonde boy from asteroid B-612, unlocking key values to coexist peacefully.",
      structure: [
        {
          part: "Parte I: L'Incontro",
          partEn: "Part I: Stranded",
          cantos: "Sahara sabbioso",
          guide: "Il Pilota (La Fantasia)",
          guideEn: "The Pilot (Creativity)",
          theme: "La sopravvivenza nel deserto illuminata dalla meraviglia",
          themeEn: "Desert isolation illuminated by child wonder",
          color: "from-amber-900 to-amber-700"
        },
        {
          part: "Parte II: I Pianeti",
          partEn: "Part II: Asteroids",
          cantos: "Bizzarri asteroridi",
          guide: "I vari Adulti",
          guideEn: "Various Adults",
          theme: "La noia e le strane abitudini degli uomini solitari",
          themeEn: "Boredom and dry routine of lonely kings and geographers",
          color: "from-stone-900 to-indigo-950"
        },
        {
          part: "Parte III: La Volpe",
          partEn: "Part III: Connection",
          cantos: "L'addomesticamento",
          guide: "La Volpe saggia",
          guideEn: "The Wise Fox",
          theme: "L'amore prezioso per la propria unica rosa d'origine",
          themeEn: "The beautiful responsibility of caring for your native rose",
          color: "from-teal-950 to-teal-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "Disegnami una Pecora",
        titleEn: "Draw me a Sheep please",
        summary: "Nel deserto sconfinato, un pilota col motore guasto incontra il Piccolo Principe, che gli chiede improvvisamente di disegnargli una pecora per custodire il suo pianeta d'origine.",
        summaryEn: "Stranded in the Sahara desert, a stressed pilot gets surprised by a blonde boy asking him to draw a simple sheep to carry back home.",
        focusBes: "Incoraggia a superare lo stress meccanico riscoprendo l'immaginazione e il disegno come ponti educativi universali.",
        focusBesEn: "Promotes overcoming everyday distress by unlocking fantasy and mutual trust.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Dessine-moi un mouton..." },
              { text: "S'il vous plaît..." }
            ],
            paraphraseText: "Disegnami una pecora... per favore, disegnane una adatta al mio piccolo pianeta.",
            caaSimplifiedText: "Un pilota si trova nel deserto per un guasto. Arriva un bambino biondo gentilissimo e dice: per favore, disegnami una pecora.",
            caaSymbols: [
              { word: "Bambino", symbol: "👦", type: "character" },
              { word: "Deserto", symbol: "🏜️", type: "setting" },
              { word: "Disegno", symbol: "✏️", type: "action" },
              { word: "Pecora", symbol: "🐑", type: "object" },
              { word: "Amicizia", symbol: "🤝", type: "feeling" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Cosa svela la Volpe al Piccolo Principe prima di salutarlo?",
        questionEn: "What secret does the Fox tell the Little Prince before leaving?",
        options: [
          "Che i deserti sono pieni di serpenti velenosi",
          "L'essenziale è invisibile agli occhi, si vede bene solo col cuore",
          "Che gli uomini adulti hanno sempre ragione"
        ],
        optionsEn: [
          "That deserts are full of snakes",
          "The essential is invisible to eyes, we see clearly only with our hearts",
          "That adults are always right"
        ],
        correctAnswerIndex: 1,
        feedback: "Esatto! Ci insegna che la cura e il tempo speso per chi amiamo rendono unico il nostro legame.",
        feedbackEn: "Exactly! Caring and dedicating time to those we love is what makes bonds uniquely valuable."
      }
    ]
  },
  "Storia": {
    bioTitleIt: "I Diritti dell'Uomo",
    bioTitleEn: "Human Rights",
    bio: {
      name: "La Rivoluzione Francese",
      birthDeath: "Parigi, 1789",
      summary: "La Rivoluzione Francese segna la nascita dello stato moderno fondato sui diritti. Il popolo parigino si ribellò contro l'ingiustizia dei privilegi regali dei re assoluti per promuovere i tre pilastri odierni: Libertà, Uguaglianza, Fratellanza.",
      summaryEn: "The French Revolution marks the birthplace of the modern republic. Fed-up citizens rose up against royal privileges to establish modern rights: Liberty, Equality, and Fraternity.",
      keyConcepts: [
        {
          title: "Basta Privilegi",
          titleEn: "No More Privilege",
          desc: "I cittadini rifiutarono che i nobili non pagassero le tasse mentre i contadini morivano di fame.",
          descEn: "Peasants rejected system unfairness, demanding nobles also pay taxation rules.",
          icon: "Compass"
        },
        {
          title: "La Bastiglia",
          titleEn: "The Bastille",
          desc: "L'assalto alla prigione-fortezza il 14 Luglio 1789 divenne il simbolo della fine dell'oppressione.",
          descEn: "Storming the royal prison fortress of Bastile on July 14, 1489 symbolized end of absolutism.",
          icon: "Sparkles"
        },
        {
          title: "Diritti Universali",
          titleEn: "Universal Rights",
          desc: "Nacque la Dichiarazione dei Diritti dell'Uomo, cardine delle costituzioni democratiche.",
          descEn: "Crowned the Declaration of Rights of Man, establishing citizens equal status.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "La Rivoluzione Francese",
      titleEn: "The French Revolution",
      subtitle: "Il popolo spezza le catene dell'assolutismo",
      subtitleEn: "Citizens break the chains of absolute monarchy",
      desc: "Un viaggio storico epico per comprendere come nacquero le nostre democrazie moderne basate sulla parità sociale, sradicando i soprusi dei sovrani e feudatari medievali.",
      descEn: "An epic journey to understand the birth of modern democracy, sweeping away absolute power in favor of inclusive, balanced legal constitutions.",
      structure: [
        {
          part: "La Bastiglia",
          partEn: "The Bastille",
          cantos: "14 Luglio 1789",
          guide: "Il Popolo Arrabbiato",
          guideEn: "The Angry Crowd",
          theme: "L'attacco alla prigione simbolo dell'oppressione reale",
          themeEn: "The siege of the royal prison-symbol of cruel tyranny",
          color: "from-red-950 to-red-800"
        },
        {
          part: "La Repubblica",
          partEn: "The Republic",
          cantos: "La Caduta del Re",
          guide: "La Convenzione Nazionale",
          guideEn: "The Assembly",
          theme: "La fine del trono assoluto e la stesura della democrazia",
          themeEn: "Declaring the end of absolute monarchy for a free nation",
          color: "from-stone-900 to-indigo-950"
        },
        {
          part: "La Dichiarazione",
          partEn: "The Declaration",
          cantos: "Diritti di parità",
          guide: "Uguaglianza Sociale",
          guideEn: "Social Equality",
          theme: "La consacrazione dei diritti inviolabili dell'essere umano",
          themeEn: "Consecrating absolute human rights for everyone",
          color: "from-teal-950 to-teal-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "La Presa della Bastiglia",
        titleEn: "The Storming of Bastille",
        summary: "Il 14 Luglio 1789, migliaia di parigini esauriti dalla miseria assaltano la fortezza reale della Bastiglia per raccogliere armi e abbattere il simbolo di re Luigi XVI.",
        summaryEn: "On July 14, 1489, Parisian crowds tired of poverty attack the Bastille fortress to gather weapons and tear down Louis XVI's tyranny.",
        focusBes: "Valorizza la forza dell'unione pacifica e civile per protestare lealmente di fronte a disuguaglianze inaccettabili.",
        focusBesEn: "Uplifts the importance of citizen civic action in the face of deep systemic injustice.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Liberté, Égalité, Fraternité!" },
              { text: "Aux armes, citoyens!" }
            ],
            paraphraseText: "Libertà, Uguaglianza, Fratellanza! Alle armi, cittadini, formate i vostri battaglioni!",
            caaSimplifiedText: "Il 14 Luglio 1789 il popolo di Parigi attacca la prigione Bastiglia. Il popolo vuole uguaglianza e giustizia sociale.",
            caaSymbols: [
              { word: "Popolo", symbol: "👥", type: "character" },
              { word: "Giustizia", symbol: "⚖️", type: "concept" },
              { word: "Prigione", symbol: "🏰", type: "setting" },
              { word: "Rivoluzione", symbol: "🔥", type: "action" },
              { word: "Insieme", symbol: "🤝", type: "feeling" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Cosa si celebra nella data storica del 14 Luglio?",
        questionEn: "What is celebrated on the historical date of July 14?",
        options: [
          "La scoperta dell'America",
          "La Presa della Bastiglia e l'inizio della Rivoluzione Francese",
          "La nascita di Dante Alighieri"
        ],
        optionsEn: [
          "The discovery of America",
          "The Storming of Bastille and beginning of French Revolution",
          "Dante Alighieri's birth"
        ],
        correctAnswerIndex: 1,
        feedback: "Corretto! Questa giornata segna simbolicamente la caduta dell'oppressione e la nascita della cittadinanza moderna.",
        feedbackEn: "Correct! This marks the symbolic end of oppression and the birth of modern active citizenship."
      }
    ]
  },
  "Geografia": {
    bioTitleIt: "Casa Nostra Comune",
    bioTitleEn: "Our Shared Home",
    bio: {
      name: "Il Pianeta Terra ed il Clima",
      birthDeath: "Ecosistema Globale",
      summary: "La Geografia ci fa incontrare i mari, le colline e le nazioni, ma ci insegna soprattutto che la Terra è una casa unica condivisibile. Comprendere l'equilibrio dei climi e l'atmosfera è vitale per arrestare i cambiamenti climatici inquinanti.",
      summaryEn: "Geography details our mountains and boundaries, but above all teaches that Earth is a shared fragile home. Understanding climates and ecosystems is vital to preserve our planet.",
      keyConcepts: [
        {
          title: "Effetto Serra Buono",
          titleEn: "Good Greenhouse",
          desc: "Senza l'effetto serra della nostra atmosfera, il pianeta sarebbe ghiacciato ed invivibile.",
          descEn: "Without our atmosphere's natural greenhouse shield, Earth would be a frozen, dead sphere.",
          icon: "Compass"
        },
        {
          title: "Riscaldamento Globale",
          titleEn: "Global Warming",
          desc: "Le attività umane inquinanti emettono troppi gas tossici, riscaldando troppo la superficie terrestre.",
          descEn: "Industrial emissions trap excess heat, warming the globe and melting arctic glaciers.",
          icon: "Sparkles"
        },
        {
          title: "Sostenibilità",
          titleEn: "Sustainability",
          desc: "Proteggere le foreste, risparmiare l'energia e non sprecare l'acqua potabile sono i compiti di tutti cittadini.",
          descEn: "Conserving water, saving energy, and planting trees is the civic priority of every child.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "I Climi della Terra",
      titleEn: "Earth's Climates",
      subtitle: "Il respiro verde del nostro meraviglioso pianeta",
      subtitleEn: "The green respiration of our beautiful biosphere",
      desc: "Un percorso geografico per osservare le diverse latitudini, dalle cappe polari ai tropici, scoprendo l'importanza dell'aria pura e della biodiversità per il futuro comune.",
      descEn: "A geographical voyage across planetary zones, from frozen poles to rainforests, discovering why preserving air and biodiversity is key.",
      structure: [
        {
          part: "Atmosfera",
          partEn: "The Atmosphere",
          cantos: "La coperta blu",
          guide: "L'Aria Pura",
          guideEn: "Pure Air",
          theme: "L'ozonosfera che filtra i raggi solari nocivi",
          themeEn: "The ozone shield filtering toxic solar radiations",
          color: "from-blue-950 to-indigo-900"
        },
        {
          part: "Ghiacciai",
          partEn: "The Glaciers",
          cantos: "Riserva d'acqua",
          guide: "I Poli Terrestri",
          guideEn: "The Earth Poles",
          theme: "L'albedo dei ghiacciai che raffredda l'intero ecosistema",
          themeEn: "Ice caps albedo reflecting heat to cool the ocean temperatures",
          color: "from-sky-950 to-blue-900"
        },
        {
          part: "Ecosistema",
          partEn: "Sustainable Future",
          cantos: "Prendersi cura",
          guide: "Il Patto Verde",
          guideEn: "The Green Deal",
          theme: "Il passaggio alle energie pulite ed il riciclo virtuoso",
          themeEn: "Transitioning to clean energy and smart circular recycling",
          color: "from-teal-950 to-teal-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "I Climi dell'Atmosfera",
        titleEn: "Climates of the Atmosphere",
        summary: "L'atmosfera difende la Terra permettendo la vita. Purtroppo, l'inquinamento delle auto e delle centrali a carbone intasa l'aria scatenando un surriscaldamento planetario pericoloso.",
        summaryEn: "The atmosphere acts as a protective shield. Excess greenhouse emissions from cars and factories overheat the planet, putting habitats in peril.",
        focusBes: "Fa capire la connessione tra le nostre scelte quotidiane e la salute dell'ecologia generale del pianeta.",
        focusBesEn: "Clarifies how clean local civic behavior directly protects our global forest habitats.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "La Terra si riscalda ad ogni ora," },
              { text: "se l'aria pura si fa scura e greve" }
            ],
            paraphraseText: "Il nostro pianeta si riscalda continuamente, se l'atmosfera si riempie di fumi pesanti e scuri che trattengono troppo calore.",
            caaSimplifiedText: "L'aria pulita protegge la Terra. L'inquinamento fa diventare la Terra troppo calda. Dobbiamo usare energia pulita.",
            caaSymbols: [
              { word: "Terra", symbol: "🌍", type: "setting" },
              { word: "Inquinamento", symbol: "💨", type: "object" },
              { word: "Caldo", symbol: "🔥", type: "feeling" },
              { word: "Proteggere", symbol: "🛡️", type: "action" },
              { word: "Sole", symbol: "☀️", type: "object" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Quale bizzarro effetto naturale mantiene la Terra calda e ospitale per gli umani?",
        questionEn: "What natural effect keeps the Earth warm enough to host human life?",
        options: [
          "Il vento dell'artico",
          "L'Effetto Serra naturale dell'atmosfera",
          "Il magnetismo dei vulcani di ferro"
        ],
        optionsEn: [
          "The arctic winds",
          "The natural Greenhouse Effect created by atmosphere",
          "The magnetism of iron volcanoes"
        ],
        correctAnswerIndex: 1,
        feedback: "Correttissimo! L'effet serra è positivo, ma è l'eccesso antropico di gas che sbilancia il clima globale.",
        feedbackEn: "Correct! The greenhouse effect is natural & positive, but artificial pollution overheats it."
      }
    ]
  },
  "Matematica": {
    bioTitleIt: "La Scuola Geometrica",
    bioTitleEn: "The School of Geometry",
    bio: {
      name: "Pitagora e la Triangolazione",
      birthDeath: "Samo 570 a.C. – Metaponto 495 a.C.",
      summary: "Pitagora è stato un geniale matematico e filosofo greco. Fondò una celebre scuola dove i numeri erano considerati i mattoni spirituali di tutto il cosmo. Scoprì il teorema dei triangoli rettangoli che usiamo oggi in tutta l'ingegneria moderna.",
      summaryEn: "Pythagoras was an ancient Greek philosopher and mathematician. He founded a school where numbers were seen as cosmic bricks, discovering the theorem of right triangles.",
      keyConcepts: [
        {
          title: "L'Angolo Retto",
          titleEn: "The Right Angle",
          desc: "Un angolo perfetto di 90 gradi che definisce i triangoli rettangoli, base delle costruzioni.",
          descEn: "A pristine 90-degree angle defining right triangles, the absolute cornerstone of architecture.",
          icon: "Compass"
        },
        {
          title: "Ipotenusa e Cateti",
          titleEn: "Hypotenuse & Legs",
          desc: "I due lati corti formano l'angolo retto (cateti), il lato lungo opposto inclinato è l'ipotenusa.",
          descEn: "The two shorter sides meeting at 90 deg are legs (cateti), the longest opposite is the hypotenuse.",
          icon: "Sparkles"
        },
        {
          title: "Equilibrio di Aree",
          titleEn: "Balance of Areas",
          desc: "La magica somma delle aree dei quadrati costruiti sui cateti dà perfettamente il quadrato sull'ipotenusa.",
          descEn: "The sum of the areas of squares built on legs perfectly equals the square area of the hypotenuse.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "Il Teorema di Pitagora",
      titleEn: "Pythagorean Theorem",
      subtitle: "La meravigliosa armonia delle proporzioni geometriche",
      subtitleEn: "The marvelous spatial harmony of geometric shapes",
      desc: "Un affascinante viaggio numerico per afferrare l'equilibrio dei poligoni. Tramite schemi tattili e CAA, comprendiamo perché l'area inclinata riassume perfettamente la stabilità del triangolo.",
      descEn: "An engaging journey to capture polygon balance. Using intuitive step blocks and AAC symbols, grasp why leg areas perfectly combine into the hypotenuse.",
      structure: [
        {
          part: "Cateti",
          partEn: "The Legs",
          cantos: "I lati dell'angolo",
          guide: "Il Cateto (La Base)",
          guideEn: "The Leg (The Base)",
          theme: "I due segmenti ortogonali a 90° perpendicolari",
          themeEn: "The two orthogonal segments making up the right angle",
          color: "from-blue-950 to-indigo-900"
        },
        {
          part: "Ipotenusa",
          partEn: "Hypotenuse",
          cantos: "La diagonale",
          guide: "L'Ipotenusa (La Salita)",
          guideEn: "Hypotenuse (The Ascent)",
          theme: "La salita obliqua posta perfettamente di fronte all'angolo retto",
          themeEn: "The long diagonal line connecting the outer points of legs",
          color: "from-purple-950 to-purple-900"
        },
        {
          part: "Teorema",
          partEn: "The Theorem",
          cantos: "La formula",
          guide: "L'Equazione Aurea",
          guideEn: "The Perfect Equation",
          theme: "La celebre somma delle superfici dei quadrati equivalenti",
          themeEn: "The iconic sum of square surfaces demonstrating stability",
          color: "from-teal-950 to-teal-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "L'Angolo di Novanta Gradi",
        titleEn: "The Leg and Hypotenuse",
        summary: "In ogni triangolo rettangolo, l'angolo di 90 gradi unisce fermamente i due cateti. Conoscere le tessere dei cateti ci permette di calcolare infallibilmente la misura dell'ipotenusa saliente.",
        summaryEn: "In every right triangle, the 90-degree angle matches the two legs. Knowing leg squares allows us to precisely compute the hypotenuse length.",
        focusBes: "Utilizza schemi visivi per convertire formule complicate in puzzle geometrici evidenti e toccabili.",
        focusBesEn: "Converts scary algebraic formulas into simple geometric matching puzzles.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Area del quadrato su altezza e base," },
              { text: "si fonde insieme in perfetta intesa." }
            ],
            paraphraseText: "Le aree dei due quadrati costruiti sui lati perpendicolari si sommano trovando l'area piana del quadrato sull'ipotenusa.",
            caaSimplifiedText: "Il triangolo rettangolo ha un angolo retto di 90 gradi. I lati corti si chiamano Cateti. Il lato lungo è l'Ipotenusa.",
            caaSymbols: [
              { word: "Angolo Retto", symbol: "📐", type: "concept" },
              { word: "Lato Corto", symbol: "➖", type: "object" },
              { word: "Lato Lungo", symbol: "📈", type: "object" },
              { word: "Quadrato", symbol: "🔲", type: "object" },
              { word: "Somma", symbol: "➕", type: "action" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Come si chiama il lato obliquo più lungo, opposto all'angolo retto?",
        questionEn: "What is the longest oblique side, opposite the right angle, called?",
        options: [
          "Cateto maggiore",
          "Ipotenusa del triangolo",
          "Altezza ortogonale"
        ],
        optionsEn: [
          "Major leg (Cateto)",
          "Hypotenuse of the triangle",
          "Orthogonal height"
        ],
        correctAnswerIndex: 1,
        feedback: "Magnifico! L'ipotenusa è sempre posta dalla parte opposta all'angolo di 90 gradi.",
        feedbackEn: "Magnificent! The hypotenuse is always situated opposite to the 90-degree angle."
      }
    ]
  },
  "Scienze": {
    bioTitleIt: "I Mattoni della Vita",
    bioTitleEn: "Bricks of Life",
    bio: {
      name: "La Cellula e i suoi Segreti",
      birthDeath: "Biologia Molecolare",
      summary: "La cellula eucariota è la più fantastica e microscopica centrale comandi della natura. Ogni corpo umano esegue miliardi di azioni guidate da queste microscopiche fabbriche capaci di nutrirsi, riprodursi e sprigionare energia respirando.",
      summaryEn: "The cell is nature's smallest living commander. Billions of cells construct our body, operating like complex miniature factories generating energy and safeguarding DNA.",
      keyConcepts: [
        {
          title: "Il Nucleo e il DNA",
          titleEn: "Nucleus & DNA",
          desc: "Il nucleo custodisce il DNA, il libretto di istruzioni genetiche che descrive come siamo fatti.",
          descEn: "The central nucleus safeguards the DNA code, coordinating all cell replication rules.",
          icon: "Compass"
        },
        {
          title: "Mitocondri di Fuoco",
          titleEn: "Mitochondria Power",
          desc: "Piccoli organelli che bruciano il cibo con l'ossigeno per dare forza ed energia immediata.",
          descEn: "Powerhouse organelles that intake sugar and oxygen to output molecular energy.",
          icon: "Sparkles"
        },
        {
          title: "Membrana Filtro",
          titleEn: "Cell Membrane",
          desc: "Una porta intelligente che lascia passare le sostanze nutrienti rigettando l'inquinamento.",
          descEn: "An intelligent barrier letting nutrients sink in while blocking harmful toxins.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "La Cellula Organica",
      titleEn: "The Plant & Animal Cell",
      subtitle: "Il laboratorio segreto di ogni essere vivente",
      subtitleEn: "The secret laboratory of every living organism",
      desc: "L'esplorazione virtuale della cellula per visualizzare i ribosomi e capire l'incredibile armonia molecolare che rende sani l'erba, gli animali e gli uomini.",
      descEn: "Explore cell biology to visualize mitochondria and Ribosomes, capturing the structural harmony of animal cells.",
      structure: [
        {
          part: "Membrana",
          partEn: "The Membrane",
          cantos: "La barriera protettiva",
          guide: "Il Guscio Celere",
          guideEn: "Cell Wall/Membrane",
          theme: "La selezione del flusso dei canali per nutrire la cellula",
          themeEn: "Smart gating determining what goes in and out of the cell",
          color: "from-cyan-950 to-blue-900"
        },
        {
          part: "Nucleo",
          partEn: "The Nucleus",
          cantos: "La stanza dei bottoni",
          guide: "Il DNA Sacro",
          guideEn: "The DNA Code",
          theme: "Le istruzioni chimiche per duplicare la vita senza errori",
          themeEn: "Chemical instruction sheets to coordinate cell functions",
          color: "from-purple-950 to-indigo-900"
        },
        {
          part: "Mitocondri",
          partEn: "Energy Organelles",
          cantos: "I fornelli a gas",
          guide: "L'Energia Vitale",
          guideEn: "Vital Energy",
          theme: "La respirazione cellulare bruciando zuccheri complessi",
          themeEn: "Converting food particles into active cellular stamina",
          color: "from-red-950 to-orange-950"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "Il Nucleo Centrale",
        titleEn: "The Command Nucleus",
        summary: "Nel nucleo cellulare è contenuto il DNA. Esso coordina la crescita cellulare, impartendo le direttive chimiche per la sopravvivenza ordinata della cellula.",
        summaryEn: "Inside the cell nucleus lies the DNA. It coordinates all cell activities, sending chemical guidelines to other organelles.",
        focusBes: "Adotta parallelismi con le fabbriche moderne o la scuola per rendere immediata la comprensione della biologia.",
        focusBesEn: "Draws parallels to schools or control rooms to facilitate cognitive processing.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Dentro ogni cellula batte un segreto," },
              { text: "scrive sul codice l'ordine e il decreto." }
            ],
            paraphraseText: "Nel centro del nucleo cellulare si protegge la formula del DNA che comanda l'equilibrio biologico del corpo umano.",
            caaSimplifiedText: "La cellula è piccolissima e viva. Nel centro c'è il Nucleo col DNA. Il DNA comanda tutta la cellula.",
            caaSymbols: [
              { word: "Cellula", symbol: "🧫", type: "object" },
              { word: "Nucleo", symbol: "🔘", type: "object" },
              { word: "DNA", symbol: "🧬", type: "concept" },
              { word: "Comando", symbol: "👑", type: "action" },
              { word: "Vita", symbol: "🌱", type: "concept" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Quale organello cellulare produce l'energia bruciando il cibo con l'ossigeno?",
        questionEn: "Which cellular organelle generates energy by burning food with oxygen?",
        options: [
          "I ribosomi di gesso",
          "I mitocondri (centrali elettriche)",
          "La membrana impermeabile"
        ],
        optionsEn: [
          "Ribosomes from plaster",
          "Mitochondria (the cell powerhouses)",
          "Cell membrane"
        ],
        correctAnswerIndex: 1,
        feedback: "Perfetto! I mitocondri sono le centrali termoelettriche microscopiche della cellula.",
        feedbackEn: "Perfect! Mitochondria act as the cell's miniature thermal-electric power plants."
      }
    ]
  },
  "Musica": {
    bioTitleIt: "L'Artista del Silenzio",
    bioTitleEn: "Composer of Silence",
    bio: {
      name: "Beethoven e l'Inno alla Gioia",
      birthDeath: "Bonn 1770 – Vienna 1827",
      summary: "Ludwig van Beethoven fu un rivoluzionario compositore tedesco. Nonostante la drammatica perdita dell'udito, continuò a comporre melodie divine ascoltandole dentro lo spazio del proprio intelletto, gridando messaggi di pace universale.",
      summaryEn: "Ludwig van Beethoven was a revolutionary German composer. Despite losing his hearing, he forged divine symphonies by listening to them purely in his mind.",
      keyConcepts: [
        {
          title: "Sordità e Forza",
          titleEn: "Hearing Loss",
          desc: "Compose la favolosa Nona Sinfonia senza sentire alcun suono materiale esterno dell'orchestra.",
          descEn: "Composed his stunning Ninth Symphony without hearing any external sound of the orchestra.",
          icon: "Compass"
        },
        {
          title: "Inno alla Gioia",
          titleEn: "Ode to Joy",
          desc: "Un inno di fratellanza che riunisce l'umanità sul coro, scelto oggi come sigla dell'Unione Europea.",
          descEn: "An anthem of world brotherhood for choir and orchestra, chosen as EU anthem.",
          icon: "Sparkles"
        },
        {
          title: "Le Sette Note",
          titleEn: "The Seven Notes",
          desc: "Rimodulò i ritmi dell'orchestra classica aprendo la strada all'epoca romantica.",
          descEn: "Reshaped classical rhythms, opening the path for the Romantic era of expression.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "La Sinfonia della Gioia",
      titleEn: "Symphony of Joy",
      subtitle: "La potenza del suono spirituale nel silenzio ordinato",
      subtitleEn: "The ultimate power of spiritual music in silent space",
      desc: "Un cammino musicale per sbrogliare il rullo dei timpani ed i violini, capendo l'importance del suono anche per chi non può fisicamente avvertire le note dell'insegnante.",
      descEn: "A musical pathway tracing violins and timpani, displaying how sound touches minds even for hearing-impaired children.",
      structure: [
        {
          part: "Il Silenzio",
          partEn: "Silence",
          cantos: "La sordità",
          guide: "Il Silenzio Creatore",
          guideEn: "The Creative Silence",
          theme: "La capacità di sentire lo spartito nell'anima tormentata",
          themeEn: "Inner auditory mapping which bypasses physical ears",
          color: "from-slate-950 to-slate-900"
        },
        {
          part: "L'Orchestra",
          partEn: "The Orchestra",
          cantos: "Molteplici strumenti",
          guide: "La Sinfonia",
          guideEn: "The Symphony",
          theme: "L'unione armonica dei fiati, archi e percussioni",
          themeEn: "Merging winds, strings, and percussion in perfect sync",
          color: "from-amber-950 to-amber-900"
        },
        {
          part: "Il Coro",
          partEn: "The Choir",
          cantos: "La Fratellanza",
          guide: "L'Inno alla Gioia",
          guideEn: "Ode to Joy",
          theme: "Le voci che acclamano la concordia di tutti gli esseri umani",
          themeEn: "Human voices singing of universal friendship and equality",
          color: "from-blue-950 to-blue-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "Ascoltare col Cuore",
        titleEn: "Composing in Silent Space",
        summary: "Beethoven, sordo a soli trent'anni, continuò a concepire straordinari spartiti, poggiando la testa sul pianoforte per assorbirne passionalmente le vibrazioni del legno.",
        summaryEn: "Beethoven, totally deaf in his thirties, kept writing major compositions, feeling piano wooden vibrations with his hands.",
        focusBes: "Insegna a valorizzare le forme alternative di percezione (tattile, visiva) per comprendere l'universo sonoro.",
        focusBesEn: "Promotes alternative sensory approaches to musical enjoyment, from touch to visual waveforms.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Canta nel petto la melodia d'oro," },
              { text: "tace l'orecchio ma risuona il coro!" }
            ],
            paraphraseText: "La bellissima melodia risuona dentro lo spirito invisibile del compositore; il suo orecchio non sente, ma il coro canta perfetto nella sua testa.",
            caaSimplifiedText: "Beethoven è sordo e non sente i suoni di fuori. Ma sente la musica bellissima dentro la sua testa e la scrive sul foglio.",
            caaSymbols: [
              { word: "Beethoven", symbol: "🧑‍🎨", type: "character" },
              { word: "Silenzio", symbol: "🔇", type: "setting" },
              { word: "Canto", symbol: "🎵", type: "action" },
              { word: "Vibrazione", symbol: "〰️", type: "object" },
              { word: "Felice", symbol: "😊", type: "feeling" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Quale celebre opera corale di Beethoven esorta alla fratellanza dei popoli?",
        questionEn: "Which famous choral work by Beethoven calls for the brotherhood of people?",
        options: [
          "La Quinta Sinfonia del Destino",
          "La Nona Sinfonia (Inno alla Gioia)",
          "La Sonata al Chiaro di Luna"
        ],
        optionsEn: [
          "The Fifth Symphony (Fate)",
          "The Ninth Symphony (Ode to Joy)",
          "The Moonlight Sonata"
        ],
        correctAnswerIndex: 1,
        feedback: "Perfetto! La Nona Sinfonia invita tutti i popoli a darsi la mano come fratelli con gioia.",
        feedbackEn: "Perfect! The Ninth Symphony prompts all cultures to unite in global peace and joy."
      }
    ]
  },
  "Arte e Immagine": {
    bioTitleIt: "L'occhio Rinascimentale",
    bioTitleEn: "The Renaissance Eye",
    bio: {
      name: "Leonardo da Vinci e lo Sfumato",
      birthDeath: "Anchiano 1452 – Amboise 1519",
      summary: "Leonardo da Vinci fu l'archetipo dell'uomo universale del Rinascimento. Fu uno strepitoso pittore, investigatore scientifico della natura, chirurgo ed inventore di macchinari d'avanguardia per volare alti.",
      summaryEn: "Leonardo da Vinci is the ultimate Renaissance polymath. Painter, scientist and inventor of flying machines, he studied nature to create flawless lifelike canvas.",
      keyConcepts: [
        {
          title: "Prospettiva del Fumo",
          titleEn: "Aerial Perspective",
          desc: "Scoprì che l'aria frapposta rende i colli lontani azzurri e sfocati, imitando fedelmente il vero.",
          descEn: "Discovered that distance fades background hills into blueish, blurry shapes due to air haze.",
          icon: "Compass"
        },
        {
          title: "Lo Sfumato",
          titleEn: "The Sfumato",
          desc: "La tecnica pittorica che ammorbidisce i contorni di occhi e labbra con delicate velature.",
          descEn: "The painting skill which softens hard borders around eyes and lips for a living expression.",
          icon: "Sparkles"
        },
        {
          title: "Uomo Vitruvano",
          titleEn: "Vitruvian Man",
          desc: "Il celebre disegno geometrico che descrive le proporzioni perfette del corpo dentro il cerchio.",
          descEn: "The iconic design showing the perfect geometry of the human body centered within circles.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "L'Arte di Leonardo",
      titleEn: "The Art of Leonardo",
      subtitle: "La visione scientifica che si tramuta in dolcezza",
      subtitleEn: "The scientific observation rendered in absolute softness",
      desc: "Un cammino visivo per smascherare le proporzioni e l'armonia cromatica, catturando l'importanza delle linee sfumate contrariamente alle demarcazioni rigide e opprimenti.",
      descEn: "A visual voyage tracing Renaissance colors and proportions, demonstrating how soft shapes convey gentle moods and atmospheric realism.",
      structure: [
        {
          part: "Sfumato",
          partEn: "The Sfumato",
          cantos: "La dolcezza dipinta",
          guide: "La Gioconda (L'Anima)",
          guideEn: "Mona Lisa (The Soul)",
          theme: "L'abolizione delle linee nette per un incarnato che respira",
          themeEn: "Removing strict boundaries for an organic skin tone that breathes",
          color: "from-[#2d1b09] to-[#161a1d]"
        },
        {
          part: "Prospettiva",
          partEn: "Perspective",
          cantos: "La profondità dell'aria",
          guide: "Il Paesaggio Blu",
          guideEn: "The Blue Landscape",
          theme: "La resa della nebbia naturale che copre le distanze geografiche",
          themeEn: "Drawing the light-reflecting haze of distance overlaying hills",
          color: "from-teal-950 to-indigo-950"
        },
        {
          part: "Proporzione",
          partEn: "Proportions",
          cantos: "La Geometria Umana",
          guide: "Uomo Vitruviano",
          guideEn: "Vitruvian Proportions",
          theme: "L'equilibrio aureo che unisce il corpo al quadrato celeste",
          themeEn: "The golden balance connecting our physical bodies with space",
          color: "from-stone-900 to-amber-950"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "I Segreti dello Sfumato",
        titleEn: "The Haze of Sfumato",
        summary: "Leonardo abolì le righe nere marcate nei suoi dipinti. Egli dipingeva strati di colore quasi liquidi, sfumando dolcemente i bordi per infondere l'aria vera sul viso dei soggetti.",
        summaryEn: "Leonardo removed harsh black lines in his portraits. He layered transparent coats on the face to let atmospheric haze seamlessly wrap the eyes and lips.",
        focusBes: "Insegna a modulare le transizioni sfocate, aiutando alunni autistici ad attenuare transizioni brusche anche nel comportamento.",
        focusBesEn: "Uplifts how gradual blends of shading help translate transition barriers into smooth experiences.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Sfuma il pennello morbido e leggero," },
              { text: "senza righe dure svela il mistero!" }
            ],
            paraphraseText: "Il pennellino sfuma dolcemente i colori freschi; eliminando i profili neri e rigidi, appare l'espressione reale della vita.",
            caaSimplifiedText: "Leonardo dipinge i visi senza fare righe nere di contorno. Sfuma i contorni dolcemente come fumo leggero.",
            caaSymbols: [
              { word: "Leonardo", symbol: "👨‍🎨", type: "character" },
              { word: "Pennello", symbol: "🖌️", type: "object" },
              { word: "Morbido/Fumo", symbol: "💨", type: "concept" },
              { word: "Viso", symbol: "👤", type: "object" },
              { word: "Bello", symbol: "✨", type: "feeling" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Come si chiama lo stile di Leonardo che rende i contorni del viso incredibilmente morbidi?",
        questionEn: "What is Leonardo's signature technique for making facial borders look soft?",
        options: [
          "Mosaico di pietra",
          "Lo Sfumato vinciano",
          "La pittura geometrica ad angoli"
        ],
        optionsEn: [
          "Stone mosaic style",
          "The Sfumato vinciano",
          "Sharp geometric angle style"
        ],
        correctAnswerIndex: 1,
        feedback: "Giustissimo! Lo sfumato avvolge la Gioconda in un'atmosfera vaporosa, realistica ed enigmatica.",
        feedbackEn: "Exactly! The sfumato technique wraps Mona Lisa in a smoky, lifelike, and enigmatic tone."
      }
    ]
  },
  "Educazione Fisica": {
    bioTitleIt: "I Valori Sportivi",
    bioTitleEn: "Sports Values",
    bio: {
      name: "Il Fair Play e le Olimpiadi",
      birthDeath: "Atene, 1896",
      summary: "L'Educazione Fisica promuove lo sviluppo fisico equilibrato, ma celebra soprattutto il rispetto interpersonale. Imparare il Fair Play (gioco corretto) nello sport significa costruire una cittadinanza inclusiva e pacifica.",
      summaryEn: "Physical Education shapes our bodies, but above all trains our hearts to respect others. Practicing Fair Play means establishing democratic relationships.",
      keyConcepts: [
        {
          title: "Il Fair Play",
          titleEn: "Fair Play",
          desc: "Rispettare gli arbitri, aiutare gli avversari caduti, rifiutare l'imbroglio per valorizzare l'onestà.",
          descEn: "Helping fallen players, respecting referee decisions, and choosing honesty over easy winning.",
          icon: "Compass"
        },
        {
          title: "I Cinque Anelli",
          titleEn: "The Five Rings",
          desc: "Il simbolo delle Olimpiadi rappresenta i cinque continenti del globo stretti in una sfida fraterna.",
          descEn: "Olympic rings represent five world continents united in peaceful sports competition.",
          icon: "Sparkles"
        },
        {
          title: "Sport per Tutti",
          titleEn: "Inclusive Sports",
          desc: "Le edizioni Paralimpiche dimostrano che lo sport supera ogni sbarra adattando le gare alle abilità.",
          descEn: "Paralympic Games demonstrate that sports transcend physical boundaries through custom adaptations.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "Lo Sport Olimpico",
      titleEn: "Olympic Sportsmanship",
      subtitle: "Il movimento corporeo che genera pace fra le nazioni",
      subtitleEn: "Physical movement generating peace and global community",
      desc: "Un cammino salutare per esaminare lo spirito di squadra e l'inclusione motoria, aiutando ogni bambino, con le proprie specifiche potenzialità, a gareggiare con dignità.",
      descEn: "A healthy pathway highlighting teamwork and motor inclusive adaptations, assisting every child to engage and compete with pride.",
      structure: [
        {
          part: "Fair Play",
          partEn: "Fair Play",
          cantos: "Il gioco onesto",
          guide: "La Lealtà",
          guideEn: "Loyalty",
          theme: "La cooperazione reciproca superando il puro agonismo egoista",
          themeEn: "Cooperating with companion athletes, bypassing pure ego",
          color: "from-emerald-950 to-green-900"
        },
        {
          part: "I Cinque Anelli",
          partEn: "The Five Rings",
          cantos: "I continenti alleati",
          guide: "Il Patto dei Popoli",
          guideEn: "Alliance of Nations",
          theme: "L'abbraccio pacifico che respinge i conflitti bellici sul campo",
          themeEn: "A peaceful embrace displacing military conflict for sports",
          color: "from-blue-950 to-indigo-950"
        },
        {
          part: "Paralimpiadi",
          partEn: "Paralympics",
          cantos: "Nessun escluso",
          guide: "Le Regole Adattate",
          guideEn: "Adaptive Rules",
          theme: "L'adattamento tecnologico per l'inclusione di ogni disabilità",
          themeEn: "Custom rules and technical gears aiding universal sport",
          color: "from-orange-950 to-orange-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "La Lealtà del Gioco",
        titleEn: "The Rule of Fair Play",
        summary: "Praticare sport esige la lealtà. Aiutare un atleta avversario visibilmente stanco o caduto a rialzarsi vale molto più di una medaglia d'oro ottenuta violando le regole.",
        summaryEn: "Sports require total loyalty. Supporting custom athletes or assisting a fallen opponent to rise again counts much more than raw medals.",
        focusBes: "Valorizza le storie di veri eroi olimpici passati per focalizzare l'autostima ed il coraggio civile.",
        focusBesEn: "Leverages legendary real-life Olympic stories of sports solidarity to spur mental resilience.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Dai la mano al compagno che è caduto," },
              { text: "nello sport chi è forte dona aiuto." }
            ],
            paraphraseText: "Offri la mano all'avversario caduto a terra; nella nobile etica sportiva, la forza vera si esprime soccorrendo gli altri.",
            caaSimplifiedText: "Nello sport conta la lealtà. Aiuta l'avversario a rialzarsi. Rispetta le regole d'oro e gioca felice.",
            caaSymbols: [
              { word: "Sport", symbol: "🏃", type: "action" },
              { word: "Aiutare", symbol: "🤝", type: "action" },
              { word: "Amico/Avversario", symbol: "🧍", type: "character" },
              { word: "Sorridente", symbol: "😊", type: "feeling" },
              { word: "Regole", symbol: "📜", type: "concept" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Cosa simboleggia l'abbraccio dei 5 anelli colorati cuciti sulla bandiera delle Olimpiadi?",
        questionEn: "What does the embrace of the five colored rings on the Olympic flag symbolize?",
        options: [
          "I cinque attrezzi della palestra",
          "I cinque continenti della Terra riuniti pacificamente nello sport",
          "I cinque arbitri della gara"
        ],
        optionsEn: [
          "The five gym gears",
          "The five Earth continents peacefully united in sport",
          "The five match referees"
        ],
        correctAnswerIndex: 1,
        feedback: "Esatto! Rappresentano l'amicizia planetaria dei popoli oltre ogni barriera culturale.",
        feedbackEn: "Exactly! They represent the friendship of planetary nations beyond cultural barriers."
      }
    ]
  },
  "Tecnologia": {
    bioTitleIt: "L'Evoluzione Verde",
    bioTitleEn: "The Green Evolution",
    bio: {
      name: "Le Energie Rinnovabili",
      birthDeath: "Ingegneria Sostenibile",
      summary: "La Tecnologia progetta ausili per facilitare la vita dell'essere umano. Oggi, la sfida tecnologica più cruciale è produrre elettricità preservando intatta la natura tramite fonti pulite: il Sole, il Vento e l'Acqua corrente.",
      summaryEn: "Technology designs systems to better human life. Today, our biggest tech breakthrough lies in producing clean electricity using natural flows: Sun, Wind, and Water.",
      keyConcepts: [
        {
          title: "Pannelli Solari",
          titleEn: "Solar Panels",
          desc: "Sfruttano i cristalli di silicio per captare la luce dorata, generando corrente pulita immediata.",
          descEn: "Use silicon crystals to capture solar rays, directly outputting emission-free current.",
          icon: "Compass"
        },
        {
          title: "Generatori Eolici",
          titleEn: "Wind Turbines",
          desc: "Grandi pale bianche spinte dal vento che fanno girare un motore interno di ricarica.",
          descEn: "Giant clean windmills rotated by wind flows, spinning generators for city energy.",
          icon: "Sparkles"
        },
        {
          title: "Sostenibilità",
          titleEn: "Sustainability",
          desc: "Utilizzare le risorse senza consumare il futuro, rigettando carburi climalteranti.",
          descEn: "Utilizing resources responsibly without exhausting the future of next generations.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "Tecnologia Pulita",
      titleEn: "Clean Technology",
      subtitle: "La forza inesauribile delle forze della natura",
      subtitleEn: "The infinite power of clean natural forces",
      desc: "Un itinerario ingegneristico per scoprire i macchinari verdi, capendo l'avvento dell'elettricità verde contro i veleni fossili del passato.",
      descEn: "An engineering pathway tracing eco-compatible machinery, detailing key steps toward green power.",
      structure: [
        {
          part: "Sole",
          partEn: "The Sun",
          cantos: "L'energia della luce",
          guide: "La Cella Silicea",
          guideEn: "Silicon Solar Cells",
          theme: "La trasformazione dei fotoni solari in tensione elettrica",
          themeEn: "Converting radiant sun photons into active electric currents",
          color: "from-amber-950 to-amber-700"
        },
        {
          part: "Vento",
          partEn: "The Wind",
          cantos: "La forza dell'aria",
          guide: "La Pala Eolica",
          guideEn: "The Wind Turbine",
          theme: "La rotazione aerodinamica delle pale accoppiata ai generatori",
          themeEn: "Aerodynamic rotation of white blades coupled to copper generators",
          color: "from-blue-950 to-indigo-900"
        },
        {
          part: "Riciclo",
          partEn: "Circular Life",
          cantos: "I materiali riutilizzati",
          guide: "Il Ciclo Virtuoso",
          guideEn: "Recycled Circles",
          theme: "La rigenerazione di plastica e metalli per abbattere sprechi",
          themeEn: "The restoration and reuse of scrap metals to save natural forests",
          color: "from-teal-950 to-teal-900"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "Elettricità dal Sole",
        titleEn: "Electricity from Sunshine",
        summary: "I pannelli solari intercettano i raggi solari. Sono fatti di silicio, un elemento minerale che rilascia elettroni quando baciato dalla luce del sole, generando corrente pulita.",
        summaryEn: "Solar arrays absorb raw sunbeams. They are built of silicon, a clean mineral releasing electrons when struck by light to yield green power.",
        focusBes: "Adotta grafiche semplificate per tradurre i principi fisici della corrente elettrica in concetti immediati.",
        focusBesEn: "Uses clean cartoon models of electrons to explain direct current dynamics for students.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Cattura il raggio il silicio lucente," },
              { text: "e fa nascere pulita la corrente!" }
            ],
            paraphraseText: "Il silicio lucido e pulito cattura istantaneamente i fotoni solari; sblocca in silenzio la corrente elettrica per accendere la classe.",
            caaSimplifiedText: "Il pannello solare prende la luce gialla del Sole. Trasforma il sole in corrente elettrica per accendere le luci di casa inquinando zero.",
            caaSymbols: [
              { word: "Pannello", symbol: "☀️", type: "object" },
              { word: "Silicio", symbol: "🟦", type: "object" },
              { word: "Elettricità", symbol: "⚡", type: "concept" },
              { word: "Sole", symbol: "🟡", type: "setting" },
              { word: "Nuovo", symbol: "✨", type: "feeling" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Quale prezioso elemento minerale compone i pannelli solari fotovoltaici?",
        questionEn: "Which physical mineral is the main ingredient of photovolatic solar panels?",
        options: [
          "Il piombo pesante di miniera",
          "Il silicio (estratto dalla sabbia comune)",
          "La plastica trasparente"
        ],
        optionsEn: [
          "Heavy toxic lead from mines",
          "The silicon (extracted from everyday sand)",
          "The transparent simple plastic"
        ],
        correctAnswerIndex: 1,
        feedback: "Corretto! Il silicio è un eccezionale semiconduttore estratto dalla sabbia, sicuro e abbondante.",
        feedbackEn: "Correct! Silicon is a safe, highly abundant organic semiconductor extracted from common sand."
      }
    ]
  },
  "Educazione Civica": {
    bioTitleIt: "La Legge Fondamentale",
    bioTitleEn: "The Supreme Law",
    bio: {
      name: "La Costituzione e la Pace",
      birthDeath: "Roma, 1 Gennaio 1948",
      summary: "La Costituzione Italiana è la legge più importante del nostro Stato. Contiene i principi fondamentali della civile convivenza, affermando l'uguaglianza sociale di tutti, la libertà ed il solenne ripudio della guerra.",
      summaryEn: "The Italian Constitution is the supreme law of the state. It outlines the core principles of civic life, declaring equal human rights and the strict rejection of war.",
      keyConcepts: [
        {
          title: "Articolo 3: Parità",
          titleEn: "Article 3: Equality",
          desc: "Tutti i cittadini sono perfettamente uguali senza distinzioni di lingua, e religione.",
          descEn: "All citizens are unconditionally equal before the law, with no religious or linguistic barriers.",
          icon: "Compass"
        },
        {
          title: "Articolo 11: Pace",
          titleEn: "Article 11: Peace",
          desc: "L'Italia ripudia solennemente la guerra come strumento di offesa ed aggressione.",
          descEn: "Italy permanently rejects military war as a tool of offense or threat against sovereign nations.",
          icon: "Sparkles"
        },
        {
          title: "Il Lavoro",
          titleEn: "Productive Labor",
          desc: "Fonda lo stato sul lavoro come diritto e dovere per la crescita di tutta la società.",
          descEn: "Establishes daily work as a key pillar and democratic duty for society's welfare.",
          icon: "BookMarked"
        }
      ]
    },
    intro: {
      title: "La Costituzione Italiana",
      titleEn: "The Italian Constitution",
      subtitle: "Il porto sicuro dei diritti e dei doveri civici",
      subtitleEn: "The safe harbor of democratic human rights",
      desc: "Un cammino democratico per comprendere le regole del vivere felici insieme, capendo l'importanza del voto libero, dell'uguaglianza sostanziale e dei doveri di solidarietà.",
      descEn: "A democratic pathway outlining our laws for a safe and cooperative coexistence, understanding free elections, and the duties of active solidarity.",
      structure: [
        {
          part: "Articolo 1",
          partEn: "Article 1",
          cantos: "La democrazia",
          guide: "Il Lavoro Dignitoso",
          guideEn: "Dignified Labor",
          theme: "La repubblica fondata sulla libertà dei lavoratori e dei cittadini",
          themeEn: "Guarantees a democratic nation based on labor force validation",
          color: "from-[#112d09] to-green-900"
        },
        {
          part: "Articolo 3",
          partEn: "Article 3",
          cantos: "Siamo uguali",
          guide: "L'Uguaglianza Piena",
          guideEn: "Full Equality",
          theme: "La dignità sociale assoluta senza alcun pregiudizio o discriminazione",
          themeEn: "Establishing identical digital and civil dignity for all citizens",
          color: "from-blue-950 to-cyan-950"
        },
        {
          part: "Articolo 11",
          partEn: "Article 11",
          cantos: "No alla guerra",
          guide: "La Diplomazia di Pace",
          guideEn: "Diplomatic Peace",
          theme: "Il ripudio dell'odio reciproco e la cooperazione amica tra nazioni",
          themeEn: "Permanent refusal of military conquest, trusting global dialogue",
          color: "from-teal-950 to-[#112d09]"
        }
      ]
    },
    lessons: [
      {
        number: 1,
        romanNumeral: "I",
        title: "Tutti Uguali Davanti alla Legge",
        titleEn: "All Equal and Dignified",
        summary: "L'Articolo 3 difende la dignità sociale. Spetta alla Repubblica abbattere tutti gli ostacoli materiali ed economici che limitano la libertà degli scolari.",
        summaryEn: "Article 3 guarantees identical social respect. The government commits to removing all economic borders that block student inclusion.",
        focusBes: "Fa leva sull'importanza dell'inclusione scolastica e delle regole della democrazia quotidiana d'aula.",
        focusBesEn: "Links general constitutional rights with everyday school inclusion rules and class voting.",
        tercets: [
          {
            id: 11,
            verses: [
              { text: "Nessun confine o lingua ci separa," },
              { text: "la Costituzione di dignità ci schiera." }
            ],
            paraphraseText: "Nessun limite fisico o differenza di lingua può dividerci; la legge fondamentale assicura a tutti noi la medesima dignità.",
            caaSimplifiedText: "Lo Stato dice: tutti i cittadini sono importanti allo stesso modo. Non conta la ricchezza, il sesso o la salute. Siamo della stessa famiglia umana.",
            caaSymbols: [
              { word: "Cittadini", symbol: "👥", type: "character" },
              { word: "Uguaglianza", symbol: "⚖️", type: "concept" },
              { word: "Legge", symbol: "📜", type: "object" },
              { word: "Inclusione", symbol: "🤝", type: "feeling" },
              { word: "Repubblica", symbol: "🏛️", type: "setting" }
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Quale importantissimo principio espone solennemente l'Articolo 11 della Costituzione?",
        questionEn: "What crucial principle does Article 11 of the Constitution declare?",
        options: [
          "L'Italia impone le sue tasse",
          "L'Italia ripudia la guerra come strumento di offesa dei popoli",
          "L'obbligo di compiere gare di corsa veloci"
        ],
        optionsEn: [
          "Italy enforces high taxes",
          "Italy permanently rejects war as a tool of offense against free peoples",
          "The obligation to participate in quick races"
        ],
        correctAnswerIndex: 1,
        feedback: "Splendido! L'Italia promuove l'accordo e la mediazione pacifica, respingendo le armi ed i conflitti bellici.",
        feedbackEn: "Splendid! Italy promotes diplomatic mediation over armed threat and militarism."
      }
    ]
  }
};

const DISCIPLINE_HERO_QUOTES: Record<string, { quoteIt: string; quoteEn: string; imageColor: string; symbol: string }> = {
  "Italiano": {
    quoteIt: "E quindi uscimmo a riveder le stelle.",
    quoteEn: "And thence we came forth to rebehold the stars.",
    imageColor: "from-[#1a0505] to-[#2d0909]",
    symbol: "👑"
  },
  "Inglese": {
    quoteIt: "Siamo fatti della stessa sostanza dei sogni.",
    quoteEn: "We are such stuff as dreams are made on.",
    imageColor: "from-blue-950 to-indigo-900",
    symbol: "🎭"
  },
  "Francese": {
    quoteIt: "L'essenziale è invisibile agli occhi.",
    quoteEn: "What is essential is invisible to the eye.",
    imageColor: "from-amber-950 to-amber-900",
    symbol: "✨"
  },
  "Storia": {
    quoteIt: "Tutti gli esseri umani nascono liberi ed eguali in dignità e diritti.",
    quoteEn: "All human beings are born free and equal in dignity and rights.",
    imageColor: "from-red-950 to-rose-900",
    symbol: "⚖️"
  },
  "Geografia": {
    quoteIt: "La Terra è una casa bellissima e fragile, da proteggere e amare.",
    quoteEn: "The Earth is our wonderful and fragile home, to protect and love.",
    imageColor: "from-emerald-950 to-teal-900",
    symbol: "🌍"
  },
  "Matematica": {
    quoteIt: "La matematica è l'alfabeto in cui Dio ha scritto l'universo.",
    quoteEn: "Mathematics is the alphabet with which God has written the universe.",
    imageColor: "from-[#111827] to-[#1f2937]",
    symbol: "📐"
  },
  "Scienze": {
    quoteIt: "La natura danza con armonia tra molecole e stelle.",
    quoteEn: "Nature dances in harmony through molecules and stars.",
    imageColor: "from-violet-950 to-purple-900",
    symbol: "🔬"
  },
  "Musica": {
    quoteIt: "La musica è una rivelazione più alta di ogni saggezza e filosofia.",
    quoteEn: "Music is a higher revelation than all wisdom and philosophy.",
    imageColor: "from-amber-950 to-amber-900",
    symbol: "🎵"
  },
  "Arte e Immagine": {
    quoteIt: "L'arte non riproduce ciò che è visibile, ma rende visibile.",
    quoteEn: "Art does not reproduce the visible; rather, it makes visible.",
    imageColor: "from-neutral-900 to-amber-950",
    symbol: "🎨"
  },
  "Educazione Fisica": {
    quoteIt: "Un corpo sano è la dimora sicura di una mente libera.",
    quoteEn: "A healthy body is the safe dwelling of a free mind.",
    imageColor: "from-indigo-950 to-blue-900",
    symbol: "🏃"
  },
  "Tecnologia": {
    quoteIt: "La tecnologia è lo strumento dell'ingegno per migliorare il domani.",
    quoteEn: "Technology is the tool of ingenuity to build a better tomorrow.",
    imageColor: "from-slate-900 to-zinc-800",
    symbol: "💻"
  },
  "Educazione Civica": {
    quoteIt: "La legge è uguale per tutti, la dignità è la nostra bussola.",
    quoteEn: "The law is equal for all, human dignity is our compass.",
    imageColor: "from-cyan-950 to-sky-900",
    symbol: "🏛️"
  }
};

const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split(/[?#]/)[0];
    } else if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1]?.split(/[?#]/)[0];
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split(/[?#&]/)[0];
    } else if (url.includes("video_id=")) {
      videoId = url.split("video_id=")[1]?.split(/[?#&]/)[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
  } catch (e) {
    console.error("Error parsing YouTube URL:", e);
  }
  return null;
};

const isVideoContent = (img: any): boolean => {
  if (!img) return false;
  if (img.mediaType === "video") return true;
  if (isYouTubeUrl(img.url)) return true;
  if (img.url?.startsWith("data:video/") || img.url?.startsWith("data:application/octet-stream") && img.url?.includes("video")) return true;
  const urlLower = (img.url || "").toLowerCase();
  return (
    urlLower.endsWith(".mp4") || 
    urlLower.endsWith(".webm") || 
    urlLower.endsWith(".ogg") || 
    urlLower.endsWith(".mov") ||
    urlLower.includes("video")
  );
};

export default function App() {
  // --- STATE MANAGEMENT ---
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>("Italiano");
  const [isDisciplinaDropdownOpen, setIsDisciplinaDropdownOpen] = useState<boolean>(false);

  const disciplines = [
    { id: "Italiano", labelIt: "Italiano (UdA Il Cammino delle stelle)", labelEn: "Italian (UdA The Path of the Stars)", icon: "🇮🇹" },
    { id: "Inglese", labelIt: "Inglese (Shakespeare)", labelEn: "English (Shakespeare)", icon: "🇬🇧" },
    { id: "Francese", labelIt: "Francese (Saint-Exupéry)", labelEn: "French (Saint-Exupéry)", icon: "🇫🇷" },
    { id: "Storia", labelIt: "Storia (Umanesimo e Rinascimento)", labelEn: "History (Humanism and Renaissance)", icon: "⏳" },
    { id: "Geografia", labelIt: "Geografia (Trattati sulla Sostenibilità )", labelEn: "Geography (Sustainability Treaties)", icon: "🌍" },
    { id: "Matematica", labelIt: "Matematica (Pitagora)", labelEn: "Mathematics (Pythagoras)", icon: "📐" },
    { id: "Scienze", labelIt: "Scienze (La Cellula)", labelEn: "Science (The Cell)", icon: "🔬" },
    { id: "Musica", labelIt: "Musica (Beethoven)", labelEn: "Music (Beethoven)", icon: "🎵" },
    { id: "Arte e Immagine", labelIt: "Arte e Immagine (Leonardo)", labelEn: "Art (Leonardo da Vinci)", icon: "🎨" },
    { id: "Educazione Fisica", labelIt: "Educazione Fisica (Olimpiadi)", labelEn: "Physical Ed. (Olympics)", icon: "🏃" },
    { id: "Tecnologia", labelIt: "Tecnologia (Energie rinnovabili)", labelEn: "Technology (Renewable Energy)", icon: "💻" },
    { id: "Educazione Civica", labelIt: "Educazione Civica (Costituzione)", labelEn: "Civics (Constitution)", icon: "⚖️" }
  ];
  // Personal Student Profiles (Personalizzazione Didattica)
  interface PersonalProfile {
    id: string;
    name: string;
    isCaaActive: boolean;
    isParaphraseActive: boolean;
    zoomLevel: number;
    selectedOverlay: string;
    customOverlayColor: string;
    isDarkMode: boolean;
    imageStyle: string; // "default" | "highcontrast" | "minimal" | "hidden" | "custom"
    customDanteImgUrl: string;
    customJourneyImgUrl: string;
    heroBgImgUrl: string;
    commediaBgImgUrl: string;
    explorerBgImgUrl: string;
    customQuestions?: QuizQuestion[];
    quizReports?: QuizReport[];
    carouselImages?: Array<{ 
      id: string; 
      url: string; 
      caption: string; 
      mediaType?: "image" | "video"; 
      scale?: number; 
      x?: number; 
      y?: number; 
      crop?: { top: number; right: number; bottom: number; left: number } 
    }>;
    danteCarouselImages?: Array<{ 
      id: string; 
      url: string; 
      caption: string; 
      mediaType?: "image" | "video"; 
      scale?: number; 
      x?: number; 
      y?: number; 
      crop?: { top: number; right: number; bottom: number; left: number } 
    }>;
    cantiCarousels?: Record<string, Array<{ 
      id: string; 
      url: string; 
      caption: string; 
      mediaType?: "image" | "video"; 
      scale?: number; 
      x?: number; 
      y?: number; 
      crop?: { top: number; right: number; bottom: number; left: number } 
    }>>;
  }

  const DEFAULT_ENGRAVED_STORY = [
    {
      id: "dore-plate-1",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_1_%28The_Dark_Forest%29.jpg",
      caption: "Dante Alighieri si smarrisce in una selva oscura e paurosa. Incontra lo spirito del poeta Virgilio, che lo rassicura e decide di fargli da guida attraverso l'Inferno per salvarlo.",
      scale: 1,
      x: 0,
      y: 0
    },
    {
      id: "dore-plate-2",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_22_%28Charon%29.jpg",
      caption: "Davanti alla porta dell'Inferno, Dante e Virgilio incontrano Caronte, il nocchiero delle anime. Con la sua barca li traghetta oltre il fiume Acheronte, verso il mondo del dolore.",
      scale: 1,
      x: 0,
      y: 0
    },
    {
      id: "dore-plate-3",
      url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_10_%28The_Lustful%29.jpg",
      caption: "Nel cerchio dei lussuriosi, una tempesta trascina le anime delle persone tormentate dall'amore eccessivo. Dante incontra Paolo e Francesca, e piange per la loro triste storia.",
      scale: 1,
      x: 0,
      y: 0
    },
    {
      id: "dore-plate-4",
      url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_11_%28Cerberus%29.jpg",
      caption: "Nel cerchio dei golosi, sotto una pioggia sporca, fredda ed eterna, il mostruoso cane a tre teste Cerbero graffia, graffia e urla, terrorizzando gli spiriti sdraiati nel fango.",
      scale: 1,
      x: 0,
      y: 0
    },
    {
      id: "dore-plate-5",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_75_%28The_Stars%29.jpg",
      caption: "Dopo aver esplorato tutto l'Inferno e incontrato Lucifero, Dante e Virgilio salgono lungo un cammino sotterraneo segreto, per poi finalmente 'uscire a riveder le stelle'.",
      scale: 1,
      x: 0,
      y: 0
    }
  ];

  const migrateCarouselImages = (images: any[] | undefined): any[] => {
    if (!images || images.length === 0) return DEFAULT_ENGRAVED_STORY;
    if (images.some((x: any) => x.id === "default-journey" || x.id === "default-hero")) {
      return DEFAULT_ENGRAVED_STORY;
    }
    return images;
  };

  const activeProfileOnBoot = (() => {
    try {
      const activeId = localStorage.getItem("dante_active_profile_id");
      if (!activeId) return null;
      const saved = localStorage.getItem("dante_personal_student_profiles");
      if (!saved) return null;
      const profiles: PersonalProfile[] = JSON.parse(saved);
      const found = profiles.find((p) => p.id === activeId);
      if (found) {
        if (found.carouselImages) {
          found.carouselImages = migrateCarouselImages(found.carouselImages);
        }
        return found;
      }
      return null;
    } catch (e) {
      return null;
    }
  })();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.isDarkMode;
    return false;
  });
  const [currentLang, setCurrentLang] = useState<"it" | "en">("it");
  const [isParaphraseActive, setIsParaphraseActive] = useState<boolean>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.isParaphraseActive;
    return false;
  });
  const [isCaaActive, setIsCaaActive] = useState<boolean>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.isCaaActive;
    return false;
  });
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.zoomLevel || 1;
    return 1;
  }); // 1 = Normal, 2 = Medium (+20%), 3 = Large (+40%), 4 = Extra Large (+60%)
  const [selectedOverlay, setSelectedOverlay] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.selectedOverlay || "none";
    return "none";
  });
  const [customOverlayColor, setCustomOverlayColor] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.customOverlayColor || "#e0f2fe";
    return "#e0f2fe";
  }); // default pastel sky blue
  const [isOverlayModalOpen, setIsOverlayModalOpen] = useState<boolean>(false);
  const [isUdlModalOpen, setIsUdlModalOpen] = useState<boolean>(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false);
  const [selectedExplorerCircle, setSelectedExplorerCircle] = useState<number | null>(null);
  const [isFullscreenCarouselOpen, setIsFullscreenCarouselOpen] = useState<boolean>(false);
  
  // Dante Explorer Library / Atlas filter states
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [librarySearchText, setLibrarySearchText] = useState<string>("");
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string>("Tutti");
  const [selectedLibraryCantica, setSelectedLibraryCantica] = useState<string>("Tutti");
  const [selectedLibraryTag, setSelectedLibraryTag] = useState<string>("");
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<LibraryItem | null>(null);

  // States for the new dante universe app html integration
  const [universeCantica, setUniverseCantica] = useState<string>("all");
  const [universeSearch, setUniverseSearch] = useState<string>("");
  const [universeCanto, setUniverseCanto] = useState<string>("all");
  const [universePersonaggio, setUniversePersonaggio] = useState<string>("all");
  const [universePeccato, setUniversePeccato] = useState<string>("all");
  const [universeSelectedItem, setUniverseSelectedItem] = useState<any | null>(null);
  
  // Custom Student Color Profiles State
  const [studentProfiles, setStudentProfiles] = useState<{ name: string; color: string }[]>(() => {
    try {
      const saved = localStorage.getItem("dante_student_color_profiles");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [newStudentName, setNewStudentName] = useState<string>("");

  const [personalProfiles, setPersonalProfiles] = useState<PersonalProfile[]>(() => {
    try {
      const saved = localStorage.getItem("dante_personal_student_profiles");
      if (saved) {
        const parsed: PersonalProfile[] = JSON.parse(saved);
        const migrated = parsed.map(profile => ({
          ...profile,
          carouselImages: migrateCarouselImages(profile.carouselImages)
        }));
        try {
          localStorage.setItem("dante_personal_student_profiles", JSON.stringify(migrated));
        } catch (err) {
          console.error(err);
        }
        return migrated;
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  const isSwitchingProfile = useRef<boolean>(false);

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return activeProfileOnBoot ? activeProfileOnBoot.id : null;
  });

  const [imageStyle, setImageStyle] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.imageStyle || "default";
    return localStorage.getItem("dante_image_style") || "default";
  });

  const [customDanteImgUrl, setCustomDanteImgUrl] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.customDanteImgUrl || "";
    return localStorage.getItem("dante_custom_dante_img_url") || "";
  });

  const [customJourneyImgUrl, setCustomJourneyImgUrl] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.customJourneyImgUrl || "";
    return localStorage.getItem("dante_custom_journey_img_url") || "";
  });

  const [carouselImages, setCarouselImages] = useState<Array<{ id: string; url: string; caption: string; mediaType?: "image" | "video"; scale?: number; x?: number; y?: number; crop?: { top: number; right: number; bottom: number; left: number } }>>(() => {
    if (activeProfileOnBoot && activeProfileOnBoot.carouselImages && activeProfileOnBoot.carouselImages.length > 0) {
      return migrateCarouselImages(activeProfileOnBoot.carouselImages);
    }
    try {
      const stored = localStorage.getItem("dante_journey_carousel_images");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0 && parsed.some((x: any) => x.id === "default-journey" || x.id === "default-hero")) {
          // Fall through to upgrade old defaults to the beautiful engraved story
        } else {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "dore-plate-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_1_%28The_Dark_Forest%29.jpg",
        caption: "Dante Alighieri si smarrisce in una selva oscura e paurosa. Incontra lo spirito del poeta Virgilio, che lo rassicura e decide di fargli da guida attraverso l'Inferno per salvarlo.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_22_%28Charon%29.jpg",
        caption: "Davanti alla porta dell'Inferno, Dante e Virgilio incontrano Caronte, il nocchiero delle anime. Con la sua barca li traghetta oltre il fiume Acheronte, verso il mondo del dolore.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_10_%28The_Lustful%29.jpg",
        caption: "Nel cerchio dei lussuriosi, una tempesta trascina le anime delle persone tormentate dall'amore eccessivo. Dante incontra Paolo e Francesca, e piange per la loro triste storia.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-4",
        url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_11_%28Cerberus%29.jpg",
        caption: "Nel cerchio dei golosi, sotto una pioggia sporca, fredda ed eterna, il mostruoso cane a tre teste Cerbero graffia, graffia e urla, terrorizzando gli spiriti sdraiati nel fango.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-5",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_75_%28The_Stars%29.jpg",
        caption: "Dopo aver esplorato tutto l'Inferno e incontrato Lucifero, Dante e Virgilio salgono lungo un cammino sotterraneo segreto, per poi finalmente 'uscire a riveder le stelle'.",
        scale: 1,
        x: 0,
        y: 0
      }
    ];
  });

  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newImageCaption, setNewImageCaption] = useState<string>("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [isAddingImage, setIsAddingImage] = useState<boolean>(false);

  // Dante Portrait Carousel Specific States
  const [danteCarouselImages, setDanteCarouselImages] = useState<Array<{ id: string; url: string; caption: string; mediaType?: "image" | "video"; scale?: number; x?: number; y?: number; crop?: { top: number; right: number; bottom: number; left: number } }>>(() => {
    if (activeProfileOnBoot && activeProfileOnBoot.danteCarouselImages && activeProfileOnBoot.danteCarouselImages.length > 0) {
      return activeProfileOnBoot.danteCarouselImages;
    }
    try {
      const stored = localStorage.getItem("dante_portrait_carousel_images");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "default-dante-portrait-1",
        url: danteImg,
        caption: "Ritratto classico di Dante Alighieri",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "default-dante-portrait-2",
        url: danteTransparentImg,
        caption: "Dante Alighieri - Profilo Sfumato ed Inciso",
        scale: 1,
        x: 0,
        y: 0
      }
    ];
  });
  const [danteCarouselIndex, setDanteCarouselIndex] = useState<number>(0);
  const [isDanteCarouselEditorMode, setIsDanteCarouselEditorMode] = useState<boolean>(false);
  const [isDanteAddingImage, setIsDanteAddingImage] = useState<boolean>(false);
  const [isDanteDragOver, setIsDanteDragOver] = useState<boolean>(false);
  const [newDanteImageUrl, setNewDanteImageUrl] = useState<string>("");
  const [newDanteImageCaption, setNewDanteImageCaption] = useState<string>("");
  const [newDanteMediaType, setNewDanteMediaType] = useState<"image" | "video">("image");
  const [danteDraggedThumbIndex, setDanteDraggedThumbIndex] = useState<number | null>(null);
  const [danteDragOverThumbIndex, setDanteDragOverThumbIndex] = useState<number | null>(null);
  const [isFullscreenDanteCarouselOpen, setIsFullscreenDanteCarouselOpen] = useState<boolean>(false);

  // DEFAULT CANTO IMAGES MAP
  const DEFAULT_CANTO_IMAGES: Record<number, Array<{ id: string; url: string; caption: string; mediaType?: "image" | "video"; scale?: number; x?: number; y?: number; crop?: { top: number; right: number; bottom: number; left: number } }>> = {
    1: [
      {
        id: "canto-1-image-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_1_%28The_Dark_Forest%29.jpg",
        caption: "Dante si ritrova smarrito in una foresta buia all'inizio del viaggio terrestre ed ultraterreno.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "canto-1-image-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/William_Blake_-_Dante_running_from_the_Three_Beasts.jpg",
        caption: "Dante fugge spaventato dalle tre fiere (una lonza, un leone e una lupa) che simboleggiano i vizi.",
        scale: 1,
        x: 0,
        y: 0
      }
    ],
    2: [
      {
        id: "canto-2-image-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_3_%28Virgil_explains_to_Dante%29.jpg",
        caption: "Virgilio rassicura e conforta Dante spiegandogli che Beatrice e tre donne benedette vegliano su di lui.",
        scale: 1,
        x: 0,
        y: 0
      }
    ],
    3: [
      {
        id: "canto-3-image-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_22_%28Charon%29.jpg",
        caption: "Caronte traghetta le anime tormentate sull'Acheronte sotto sguardi severi.",
        scale: 1,
        x: 0,
        y: 0
      }
    ],
    4: [
      {
        id: "canto-4-image-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_5_%28Dante_in_Limbo%29.jpg",
        caption: "Dante e Virgilio incontrano i grandi intellettuali ed eroi dell'antichità nel Limbo protetto.",
        scale: 1,
        x: 0,
        y: 0
      }
    ],
    5: [
      {
        id: "canto-5-image-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/38/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_8_%28Minos%29.jpg",
        caption: "Il severo giudice infernale Minosse assegna le anime avvolgendo la coda spaventosa.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "canto-5-image-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_10_%28The_Lustful%29.jpg",
        caption: "Nel turbinio dei lussuriosi, Dante ascolta commosso la tragica storia d'amore di Paolo e Francesca.",
        scale: 1,
        x: 0,
        y: 0
      }
    ]
  };

  // Canti Custom Carousels State
  const [cantiCarousels, setCantiCarousels] = useState<Record<string, Array<{ id: string; url: string; caption: string; mediaType?: "image" | "video"; scale?: number; x?: number; y?: number; crop?: { top: number; right: number; bottom: number; left: number } }>>> (() => {
    if (activeProfileOnBoot && activeProfileOnBoot.cantiCarousels) {
      return activeProfileOnBoot.cantiCarousels;
    }
    try {
      const stored = localStorage.getItem("dante_canti_carousels");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [cantoCarouselIndex, setCantoCarouselIndex] = useState<number>(0);
  const [isCantoCarouselEditorMode, setIsCantoCarouselEditorMode] = useState<boolean>(false);
  const [isCantoAddingImage, setIsCantoAddingImage] = useState<boolean>(false);
  const [isCantoDragOver, setIsCantoDragOver] = useState<boolean>(false);
  const [newCantoImageUrl, setNewCantoImageUrl] = useState<string>("");
  const [newCantoImageCaption, setNewCantoImageCaption] = useState<string>("");
  const [newCantoMediaType, setNewCantoMediaType] = useState<"image" | "video">("image");
  const [cantoDraggedThumbIndex, setCantoDraggedThumbIndex] = useState<number | null>(null);
  const [cantoDragOverThumbIndex, setCantoDragOverThumbIndex] = useState<number | null>(null);
  const [isFullscreenCantoCarouselOpen, setIsFullscreenCantoCarouselOpen] = useState<boolean>(false);

  const [activeEditingCarousel, setActiveEditingCarousel] = useState<"journey" | "dante" | "canti">("journey");

  const [mediaCache, setMediaCache] = useState<Record<string, string>>({});

  const resolveUrl = (url?: string): string => {
    if (!url) return "";
    if (url.startsWith("indexeddb://")) {
      return mediaCache[url] || "";
    }
    return url;
  };

  const [isCarouselEditorMode, setIsCarouselEditorMode] = useState<boolean>(false);
  const [draggedThumbIndex, setDraggedThumbIndex] = useState<number | null>(null);
  const [dragOverThumbIndex, setDragOverThumbIndex] = useState<number | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState<boolean>(false);
  const [isResizingImage, setIsResizingImage] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageStartOffsets, setImageStartOffsets] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageStartScale, setImageStartScale] = useState<number>(1);
  const [imageStartCrop, setImageStartCrop] = useState<{ top: number; right: number; bottom: number; left: number }>({ top: 0, right: 0, bottom: 0, left: 0 });
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const [heroBgImgUrl, setHeroBgImgUrl] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.heroBgImgUrl || "";
    return localStorage.getItem("dante_hero_bg_img_url") || "";
  });

  const [commediaBgImgUrl, setCommediaBgImgUrl] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.commediaBgImgUrl || "";
    return localStorage.getItem("dante_commedia_bg_img_url") || "";
  });

  const [explorerBgImgUrl, setExplorerBgImgUrl] = useState<string>(() => {
    if (activeProfileOnBoot) return activeProfileOnBoot.explorerBgImgUrl || "";
    return localStorage.getItem("dante_explorer_bg_img_url") || "";
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [newPersonalProfileName, setNewPersonalProfileName] = useState<string>("");

  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>(() => {
    if (activeProfileOnBoot && activeProfileOnBoot.customQuestions) return activeProfileOnBoot.customQuestions;
    return [];
  });
  const [isQuizEditorOpen, setIsQuizEditorOpen] = useState<boolean>(false);
  const [editingQuestions, setEditingQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number>(0);

  const [quizReports, setQuizReports] = useState<QuizReport[]>(() => {
    if (activeProfileOnBoot && activeProfileOnBoot.quizReports) return activeProfileOnBoot.quizReports;
    return [];
  });
  const [isReportsOpen, setIsReportsOpen] = useState<boolean>(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Save changes to non-profile independent values securely
  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_image_style", imageStyle);
    }
  }, [imageStyle, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_custom_dante_img_url", customDanteImgUrl);
    }
  }, [customDanteImgUrl, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_custom_journey_img_url", customJourneyImgUrl);
    }
  }, [customJourneyImgUrl, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_journey_carousel_images", JSON.stringify(carouselImages));
    }
  }, [carouselImages, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_portrait_carousel_images", JSON.stringify(danteCarouselImages));
    }
  }, [danteCarouselImages, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_canti_carousels", JSON.stringify(cantiCarousels));
    }
  }, [cantiCarousels, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_hero_bg_img_url", heroBgImgUrl);
    }
  }, [heroBgImgUrl, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_commedia_bg_img_url", commediaBgImgUrl);
    }
  }, [commediaBgImgUrl, activeProfileId]);

  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId === null) {
      safeLocalStorageSetItem("dante_explorer_bg_img_url", explorerBgImgUrl);
    }
  }, [explorerBgImgUrl, activeProfileId]);

  // Exit Carousel Editor Mode on Double Click Outside
  useEffect(() => {
    if (!isCarouselEditorMode) return;
    const handleGlobalDblClick = (e: MouseEvent) => {
      const carouselBox = document.getElementById("journey-carousel-box");
      const editorControlsBox = document.getElementById("carousel-editor-controls-box");
      if (carouselBox && !carouselBox.contains(e.target as Node) && 
          editorControlsBox && !editorControlsBox.contains(e.target as Node)) {
        setIsCarouselEditorMode(false);
      }
    };
    window.addEventListener("dblclick", handleGlobalDblClick);
    return () => {
      window.removeEventListener("dblclick", handleGlobalDblClick);
    };
  }, [isCarouselEditorMode]);

  // Exit Dante Carousel Editor Mode on Double Click Outside
  useEffect(() => {
    if (!isDanteCarouselEditorMode) return;
    const handleGlobalDblClick = (e: MouseEvent) => {
      const danteBox = document.getElementById("dante-carousel-box");
      const editorControlsBox = document.getElementById("dante-carousel-editor-controls-box");
      if (danteBox && !danteBox.contains(e.target as Node) && 
          editorControlsBox && !editorControlsBox.contains(e.target as Node)) {
        setIsDanteCarouselEditorMode(false);
      }
    };
    window.addEventListener("dblclick", handleGlobalDblClick);
    return () => {
      window.removeEventListener("dblclick", handleGlobalDblClick);
    };
  }, [isDanteCarouselEditorMode]);

  // Keyboard navigation for Fullscreen Carousel Mode (Arrow Left, Arrow Right and Escape)
  useEffect(() => {
    if (!isFullscreenCarouselOpen || carouselImages.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in generic inputs or textareas (just in case)
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsFullscreenCarouselOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenCarouselOpen, carouselImages.length]);

  // Keyboard navigation for Fullscreen Dante Carousel Mode (Arrow Left, Arrow Right and Escape)
  useEffect(() => {
    if (!isFullscreenDanteCarouselOpen || danteCarouselImages.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in generic inputs or textareas (just in case)
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setDanteCarouselIndex((prev) => (prev - 1 + danteCarouselImages.length) % danteCarouselImages.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setDanteCarouselIndex((prev) => (prev + 1) % danteCarouselImages.length);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsFullscreenDanteCarouselOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenDanteCarouselOpen, danteCarouselImages.length]);

  // Sync state modifications to active profile in real time for automatic saving
  useEffect(() => {
    if (isSwitchingProfile.current) return;
    if (activeProfileId) {
      setPersonalProfiles((prev) => {
        const updated = prev.map((p) => {
          if (p.id === activeProfileId) {
            return {
              ...p,
              isCaaActive,
              isParaphraseActive,
              zoomLevel,
              selectedOverlay,
              customOverlayColor,
              isDarkMode,
              imageStyle,
              customDanteImgUrl,
              customJourneyImgUrl,
              heroBgImgUrl,
              commediaBgImgUrl,
              explorerBgImgUrl,
              customQuestions,
              quizReports,
              carouselImages,
              danteCarouselImages,
              cantiCarousels,
            };
          }
          return p;
        });
        safeLocalStorageSetItem("dante_personal_student_profiles", JSON.stringify(updated));
        return updated;
      });
    }
  }, [
    activeProfileId,
    isCaaActive,
    isParaphraseActive,
    zoomLevel,
    selectedOverlay,
    customOverlayColor,
    isDarkMode,
    imageStyle,
    customDanteImgUrl,
    customJourneyImgUrl,
    heroBgImgUrl,
    commediaBgImgUrl,
    explorerBgImgUrl,
    customQuestions,
    quizReports,
    carouselImages,
    danteCarouselImages,
    cantiCarousels,
  ]);

  // Reset the transition flag after a small delay to ensure all React state batching and cascading renders have fully completed
  useEffect(() => {
    if (isSwitchingProfile.current) {
      const timer = setTimeout(() => {
        isSwitchingProfile.current = false;
      }, 400);
      return () => clearTimeout(timer);
    }
  });

  const handleLoadProfile = (profile: PersonalProfile) => {
    isSwitchingProfile.current = true;
    setActiveProfileId(profile.id);
    safeLocalStorageSetItem("dante_active_profile_id", profile.id);
    setIsCaaActive(profile.isCaaActive);
    setIsParaphraseActive(profile.isParaphraseActive);
    setZoomLevel(profile.zoomLevel);
    setSelectedOverlay(profile.selectedOverlay);
    setCustomOverlayColor(profile.customOverlayColor);
    setIsDarkMode(profile.isDarkMode);
    setImageStyle(profile.imageStyle || "default");
    setCustomDanteImgUrl(profile.customDanteImgUrl || "");
    setCustomJourneyImgUrl(profile.customJourneyImgUrl || "");
    setHeroBgImgUrl(profile.heroBgImgUrl || "");
    setCommediaBgImgUrl(profile.commediaBgImgUrl || "");
    setExplorerBgImgUrl(profile.explorerBgImgUrl || "");
    setCustomQuestions(profile.customQuestions || []);
    setQuizReports(profile.quizReports || []);
    
    if (profile.carouselImages && profile.carouselImages.length > 0) {
      setCarouselImages(profile.carouselImages);
    } else {
      setCarouselImages([
        {
          id: "dore-plate-1",
          url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_1_%28The_Dark_Forest%29.jpg",
          caption: "Dante Alighieri si smarrisce in una selva oscura e paurosa. Incontra lo spirito del poeta Virgilio, che lo rassicura e decide di fargli da guida attraverso l'Inferno per salvarlo.",
          scale: 1,
          x: 0,
          y: 0
        },
        {
          id: "dore-plate-2",
          url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_22_%28Charon%29.jpg",
          caption: "Davanti alla porta dell'Inferno, Dante e Virgilio incontrano Caronte, il nocchiero delle anime. Con la sua barca li traghetta oltre il fiume Acheronte, verso il mondo del dolore.",
          scale: 1,
          x: 0,
          y: 0
        },
        {
          id: "dore-plate-3",
          url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_10_%28The_Lustful%29.jpg",
          caption: "Nel cerchio dei lussuriosi, una tempesta trascina le anime delle persone tormentate dall'amore eccessivo. Dante incontra Paolo e Francesca, e piange per la loro triste storia.",
          scale: 1,
          x: 0,
          y: 0
        },
        {
          id: "dore-plate-4",
          url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_11_%28Cerberus%29.jpg",
          caption: "Nel cerchio dei golosi, sotto una pioggia sporca, fredda ed eterna, il mostruoso cane a tre teste Cerbero graffia, graffia e urla, terrorizzando gli spiriti sdraiati nel fango.",
          scale: 1,
          x: 0,
          y: 0
        },
        {
          id: "dore-plate-5",
          url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_75_%28The_Stars%29.jpg",
          caption: "Dopo aver esplorato tutto l'Inferno e incontrato Lucifero, Dante e Virgilio salgono lungo un cammino sotterraneo segreto, per poi finalmente 'uscire a riveder le stelle'.",
          scale: 1,
          x: 0,
          y: 0
        }
      ]);
    }

    if (profile.danteCarouselImages && profile.danteCarouselImages.length > 0) {
      setDanteCarouselImages(profile.danteCarouselImages);
    } else {
      setDanteCarouselImages([
        {
          id: "default-dante-portrait-1",
          url: danteImg,
          caption: "Ritratto classico di Dante Alighieri",
          scale: 1,
          x: 0,
          y: 0
        },
        {
          id: "default-dante-portrait-2",
          url: danteTransparentImg,
          caption: "Dante Alighieri - Profilo Sfumato ed Inciso",
          scale: 1,
          x: 0,
          y: 0
        }
      ]);
    }

    if (profile.cantiCarousels) {
      setCantiCarousels(profile.cantiCarousels);
    } else {
      setCantiCarousels({});
    }
  };

  const handleResetProfile = () => {
    isSwitchingProfile.current = true;
    setActiveProfileId(null);
    localStorage.removeItem("dante_active_profile_id");
    setIsCaaActive(false);
    setIsParaphraseActive(false);
    setZoomLevel(1);
    setSelectedOverlay("none");
    setCustomOverlayColor("#e0f2fe");
    setIsDarkMode(false);

    // Re-load default profile settings from localStorage if customized, otherwise default values
    const defaultImageStyle = localStorage.getItem("dante_image_style") ?? "default";
    const defaultCustomDanteImgUrl = localStorage.getItem("dante_custom_dante_img_url") ?? "";
    const defaultCustomJourneyImgUrl = localStorage.getItem("dante_custom_journey_img_url") ?? "";
    const defaultHeroBgImgUrl = localStorage.getItem("dante_hero_bg_img_url") ?? "";
    const defaultCommediaBgImgUrl = localStorage.getItem("dante_commedia_bg_img_url") ?? "";
    const defaultExplorerBgImgUrl = localStorage.getItem("dante_explorer_bg_img_url") ?? "";

    setImageStyle(defaultImageStyle);
    setCustomDanteImgUrl(defaultCustomDanteImgUrl);
    setCustomJourneyImgUrl(defaultCustomJourneyImgUrl);
    setHeroBgImgUrl(defaultHeroBgImgUrl);
    setCommediaBgImgUrl(defaultCommediaBgImgUrl);
    setExplorerBgImgUrl(defaultExplorerBgImgUrl);
    setCustomQuestions([]);
    setQuizReports([]);

    let defaultJourneyImages = [
      {
        id: "dore-plate-1",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_1_%28The_Dark_Forest%29.jpg",
        caption: "Dante Alighieri si smarrisce in una selva oscura e paurosa. Incontra lo spirito del poeta Virgilio, che lo rassicura e decide di fargli da guida attraverso l'Inferno per salvarlo.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-2",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_22_%28Charon%29.jpg",
        caption: "Davanti alla porta dell'Inferno, Dante e Virgilio incontrano Caronte, il nocchiero delle anime. Con la sua barca li traghetta oltre il fiume Acheronte, verso il mondo del dolore.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-3",
        url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_10_%28The_Lustful%29.jpg",
        caption: "Nel cerchio dei lussuriosi, una tempesta trascina le anime delle persone tormentate dall'amore eccessivo. Dante incontra Paolo e Francesca, e piange per la loro triste storia.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-4",
        url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_11_%28Cerberus%29.jpg",
        caption: "Nel cerchio dei golosi, sotto una pioggia sporca, fredda ed eterna, il mostruoso cane a tre teste Cerbero graffia, graffia e urla, terrorizzando gli spiriti sdraiati nel fango.",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "dore-plate-5",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Gustave_Dor%C3%A9_-_Dante_Alighieri_-_Inferno_-_Plate_75_%28The_Stars%29.jpg",
        caption: "Dopo aver esplorato tutto l'Inferno e incontrato Lucifero, Dante e Virgilio salgono lungo un cammino sotterraneo segreto, per poi finalmente 'uscire a riveder le stelle'.",
        scale: 1,
        x: 0,
        y: 0
      }
    ];
    try {
      const stored = localStorage.getItem("dante_journey_carousel_images");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0 && !parsed.some((x: any) => x.id === "default-journey" || x.id === "default-hero")) {
          defaultJourneyImages = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setCarouselImages(defaultJourneyImages);

    let defaultDanteImages = [
      {
        id: "default-dante-portrait-1",
        url: danteImg,
        caption: "Ritratto classico di Dante Alighieri",
        scale: 1,
        x: 0,
        y: 0
      },
      {
        id: "default-dante-portrait-2",
        url: danteTransparentImg,
        caption: "Dante Alighieri - Profilo Sfumato ed Inciso",
        scale: 1,
        x: 0,
        y: 0
      }
    ];
    try {
      const stored = localStorage.getItem("dante_portrait_carousel_images");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          defaultDanteImages = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setDanteCarouselImages(defaultDanteImages);

    let defaultCantiCarousels = {};
    try {
      const stored = localStorage.getItem("dante_canti_carousels");
      if (stored) {
        defaultCantiCarousels = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    setCantiCarousels(defaultCantiCarousels);
  };

  const handleSaveProfile = () => {
    if (!newPersonalProfileName.trim()) return;
    const profileName = newPersonalProfileName.trim();
    const existing = personalProfiles.find((p) => p.name.toLowerCase() === profileName.toLowerCase());
    const profileId = existing ? existing.id : Date.now().toString();

    isSwitchingProfile.current = true;

    const newProfile: PersonalProfile = {
      id: profileId,
      name: profileName,
      isCaaActive,
      isParaphraseActive,
      zoomLevel,
      selectedOverlay,
      customOverlayColor,
      isDarkMode,
      imageStyle,
      customDanteImgUrl,
      customJourneyImgUrl,
      heroBgImgUrl,
      commediaBgImgUrl,
      explorerBgImgUrl,
      customQuestions,
      quizReports: existing ? (existing.quizReports || quizReports) : quizReports,
      carouselImages,
      danteCarouselImages,
      cantiCarousels,
    };

    let updated: PersonalProfile[];
    if (existing) {
      updated = personalProfiles.map((p) => (p.id === existing.id ? newProfile : p));
    } else {
      updated = [...personalProfiles, newProfile];
    }

    setPersonalProfiles(updated);
    safeLocalStorageSetItem("dante_personal_student_profiles", JSON.stringify(updated));
    setActiveProfileId(profileId);
    safeLocalStorageSetItem("dante_active_profile_id", profileId);
    setNewPersonalProfileName("");
  };
  
  // Quiz states
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState<number>(0);
  const [selectedCantoIndex, setSelectedCantoIndex] = useState<number>(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // --- DEDICATED AUDIO PLAYER STATE (UDL AUDIO SUPPORT PANEL) ---
  const [audioCantoIndex, setAudioCantoIndex] = useState<number>(0);
  const [audioTrackType, setAudioTrackType] = useState<"original" | "paraphrase">("original");
  const [audioIsPlaying, setAudioIsPlaying] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const [audioCurrentTercetIdx, setAudioCurrentTercetIdx] = useState<number>(0);
  const [audioElapsedSeconds, setAudioElapsedSeconds] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  // Synchronous utterance queue for Canto playback
  const playCantoTercetAudio = (tercetIdx: number, speedVal?: number) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    const canto = cantiData[audioCantoIndex];
    if (tercetIdx >= canto.tercets.length || tercetIdx < 0) {
      stopAudioCanto();
      return;
    }
    
    setAudioCurrentTercetIdx(tercetIdx);
    setAudioElapsedSeconds(tercetIdx * 8);
    
    // Determine the text to speak based on track type inside the active language context
    const tercet = canto.tercets[tercetIdx];
    let textToSpeak = "";
    if (audioTrackType === "original") {
      textToSpeak = "Canto " + canto.romanNumeral + ", terzina " + (tercetIdx + 1) + ". " + tercet.verses.map(v => v.text).join(", ");
    } else {
      textToSpeak = currentLang === "it" ? tercet.paraphraseText : (tercet.caaSimplifiedText || tercet.paraphraseText);
    }
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = currentLang === "it" ? "it-IT" : "en-US";
    utterance.rate = speedVal !== undefined ? speedVal : audioSpeed;
    utterance.volume = audioVolume;
    
    utterance.onend = () => {
      setAudioCurrentTercetIdx((prev) => {
        const nextIdx = prev + 1;
        if (nextIdx < canto.tercets.length) {
          // Play next in sequence
          setTimeout(() => {
            playCantoTercetAudio(nextIdx);
          }, 300);
        } else {
          stopAudioCanto();
        }
        return prev;
      });
    };
    
    utterance.onerror = () => {
      // safe fallback
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const startAudioCanto = () => {
    setAudioIsPlaying(true);
    // cancel existing Global TTS first to avoid mixing
    window.speechSynthesis?.cancel();
    playCantoTercetAudio(audioCurrentTercetIdx);
  };

  const pauseAudioCanto = () => {
    setAudioIsPlaying(false);
    window.speechSynthesis?.cancel();
  };

  const stopAudioCanto = () => {
    setAudioIsPlaying(false);
    setAudioCurrentTercetIdx(0);
    setAudioElapsedSeconds(0);
    setAudioProgress(0);
    window.speechSynthesis?.cancel();
  };

  const seekAudioTercet = (idx: number) => {
    setAudioCurrentTercetIdx(idx);
    setAudioElapsedSeconds(idx * 8);
    if (audioIsPlaying) {
      playCantoTercetAudio(idx);
    }
  };

  const changeAudioSpeed = (newSpeed: number) => {
    setAudioSpeed(newSpeed);
    if (audioIsPlaying) {
      playCantoTercetAudio(audioCurrentTercetIdx, newSpeed);
    }
  };

  // Manage audio progress timer
  useEffect(() => {
    let interval: any = null;
    if (audioIsPlaying) {
      interval = setInterval(() => {
        setAudioElapsedSeconds((prev) => {
          const totalDur = cantiData[audioCantoIndex].tercets.length * 8;
          const nextVal = prev + 1;
          if (nextVal >= totalDur) {
            clearInterval(interval);
            return totalDur;
          }
          return nextVal;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [audioIsPlaying, audioCantoIndex]);

  // Sync progress value with elapsed seconds & total duration
  useEffect(() => {
    const totalDur = cantiData[audioCantoIndex].tercets.length * 8;
    setAudioProgress(totalDur > 0 ? (audioElapsedSeconds / totalDur) * 100 : 0);
  }, [audioElapsedSeconds, audioCantoIndex]);

  // Automatically reset audio player when selected canto or track type changes
  useEffect(() => {
    stopAudioCanto();
  }, [audioCantoIndex, audioTrackType, currentLang]);

  // Auto-scroll active tercet card into view for assisted reading
  useEffect(() => {
    if (audioIsPlaying) {
      const activeEl = document.getElementById(`tercet-box-${audioCurrentTercetIdx}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [audioCurrentTercetIdx, audioIsPlaying]);

  // Audio Assist State (Speech Synthesis Web API for Reading accessibility)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentlyPlayingTercet, setCurrentlyPlayingTercet] = useState<number | null>(null);

  // Glossary states
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [activeHoveredTerm, setActiveHoveredTerm] = useState<GlossaryTerm | null>(null);
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number | null>(null);

  // --- AUDIO SYNTHESIS ACCESSIBILITY SUPPORT ---
  const speakText = (text: string, id: number) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking && currentlyPlayingTercet === id) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentlyPlayingTercet(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === "it" ? "it-IT" : "en-US";
      utterance.rate = 0.85; // slightly slower for better comprehensibility
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingTercet(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingTercet(null);
      };

      setCurrentlyPlayingTercet(id);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(currentLang === "it" ? "Sintesi vocale non supportata in questo browser." : "Speech synthesis not supported in this browser.");
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentlyPlayingTercet(null);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // --- ZOOM CONFIGURATION ---
  const getZoomClass = () => {
    switch (zoomLevel) {
      case 2:
        return {
          body: "text-lg",
          titleSec: "text-3xl sm:text-4xl",
          titleHero: "text-5xl sm:text-7xl",
          verses: "text-base sm:text-lg md:text-xl leading-relaxed",
          paraphrase: "text-sm sm:text-base md:text-lg leading-relaxed",
          caaText: "text-base sm:text-lg"
        };
      case 3:
        return {
          body: "text-xl",
          titleSec: "text-4xl sm:text-5xl",
          titleHero: "text-6xl sm:text-8xl",
          verses: "text-lg sm:text-xl md:text-2xl leading-loose",
          paraphrase: "text-base sm:text-lg md:text-xl leading-loose",
          caaText: "text-lg sm:text-xl"
        };
      case 4:
        return {
          body: "text-2xl font-medium",
          titleSec: "text-5xl sm:text-6xl font-bold",
          titleHero: "text-7xl sm:text-9xl font-bold",
          verses: "text-xl sm:text-2xl md:text-3xl leading-loose font-medium",
          paraphrase: "text-lg sm:text-xl md:text-2xl leading-loose font-medium",
          caaText: "text-xl sm:text-2xl font-bold"
        };
      default:
        return {
          body: "text-base",
          titleSec: "text-2xl sm:text-3xl",
          titleHero: "text-4xl sm:text-6xl",
          verses: "text-sm sm:text-base md:text-lg leading-relaxed",
          paraphrase: "text-xs sm:text-sm md:text-base leading-relaxed",
          caaText: "text-sm sm:text-base"
        };
    }
  };

  const zoomStyles = getZoomClass();

  const curImgDante = danteCarouselImages.length > 0 ? danteCarouselImages[danteCarouselIndex % danteCarouselImages.length] : null;
  const isCurrentDanteImgCustomOrUploaded = !!(curImgDante && (
    (curImgDante.id && !["default-dante-portrait-1", "default-dante-portrait-2"].includes(curImgDante.id)) || 
    (curImgDante.id === "default-dante-portrait-1" && imageStyle === "custom" && customDanteImgUrl)
  ));

  // --- DUOTONE FILTERS AND CUSTOM PALETTES ---
  const activeOverlay = duotoneColors.find((c) => c.id === selectedOverlay);
  
  // Compute dynamic styles for duotone overlay
  const getOverlayStyle = (): React.CSSProperties => {
    if (selectedOverlay === "none") return {};
    if (selectedOverlay === "custom") {
      // Append a comfortable reading opacity (15% i.e. "26" in hex) if customOverlayColor is a standard hex
      const bg = customOverlayColor.startsWith("#") && customOverlayColor.length === 7
        ? `${customOverlayColor}26`
        : customOverlayColor;
      return {
        backgroundColor: bg,
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999
      };
    }
    if (!activeOverlay) return {};
    return {
      backgroundColor: activeOverlay.bgHex,
      mixBlendMode: activeOverlay.blendMode as any,
      pointerEvents: "none",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999
    };
  };

  // Active filter color representation for mini indicators
  const getActiveFilterColor = (): string => {
    if (selectedOverlay === "none") return "";
    if (selectedOverlay === "custom") return customOverlayColor;
    return activeOverlay?.bgHex || "";
  };

  // Vivid opaque border color matching the chosen reading filter
  const getActiveFilterBorderColor = (): string => {
    if (selectedOverlay === "none") return "";
    if (selectedOverlay === "custom") return customOverlayColor;
    if (selectedOverlay === "sepia") return "#b19c6a";
    if (selectedOverlay === "cyan") return "#06b6d4"; // Vibrant turquoise (cyan-500)
    if (selectedOverlay === "amber") return "#d97706"; // Amber-600
    if (selectedOverlay === "crimson") return "#dc2626"; // Crimson
    return "";
  };

  // --- SMOOTH SCROLL ACCESSIBILITY ASSIST ---
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentBio = selectedDisciplina === "Italiano"
    ? danteBio
    : (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.bio || danteBio);

  const currentCommedia = selectedDisciplina === "Italiano"
    ? commediaIntro
    : (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.intro || commediaIntro);

  const currentCanti = selectedDisciplina === "Italiano"
    ? cantiData
    : (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.lessons || cantiData);

  const activeCanto: CantoDetail = currentCanti[selectedCantoIndex] || currentCanti[0] || cantiData[0];

  // Synchronize and load IndexedDB media into object URLs
  useEffect(() => {
    let mounted = true;
    const urlsToLoad: string[] = [];
    
    // Gather all media keys in active carousels
    const currentCantoImages = (() => {
      const key = `${selectedDisciplina}_${activeCanto.number}`;
      if (cantiCarousels && cantiCarousels[key] && cantiCarousels[key].length > 0) return cantiCarousels[key];
      if (selectedDisciplina === "Italiano") {
        const defaults = DEFAULT_CANTO_IMAGES[activeCanto.number];
        if (defaults) return defaults;
      }
      return [];
    })();

    carouselImages.forEach(img => {
      if (img?.url && img.url.startsWith("indexeddb://") && !mediaCache[img.url]) {
        urlsToLoad.push(img.url);
      }
    });

    danteCarouselImages.forEach(img => {
      if (img?.url && img.url.startsWith("indexeddb://") && !mediaCache[img.url]) {
        urlsToLoad.push(img.url);
      }
    });

    currentCantoImages.forEach(img => {
      if (img?.url && img.url.startsWith("indexeddb://") && !mediaCache[img.url]) {
        urlsToLoad.push(img.url);
      }
    });

    // Also get newImageUrl if it is in IndexedDB
    if (newImageUrl && newImageUrl.startsWith("indexeddb://") && !mediaCache[newImageUrl]) {
      urlsToLoad.push(newImageUrl);
    }
    if (newDanteImageUrl && newDanteImageUrl.startsWith("indexeddb://") && !mediaCache[newDanteImageUrl]) {
      urlsToLoad.push(newDanteImageUrl);
    }
    if (newCantoImageUrl && newCantoImageUrl.startsWith("indexeddb://") && !mediaCache[newCantoImageUrl]) {
      urlsToLoad.push(newCantoImageUrl);
    }

    if (urlsToLoad.length === 0) return;

    async function loadUrls() {
      const newCacheEntries: Record<string, string> = {};
      for (const url of urlsToLoad) {
        try {
          const data = await getMediaFromDB(url);
          if (data && mounted) {
            if (data instanceof Blob) {
              newCacheEntries[url] = URL.createObjectURL(data);
            } else {
              newCacheEntries[url] = data;
            }
          }
        } catch (e) {
          console.error("Error loading image from DB:", e);
        }
      }

      if (Object.keys(newCacheEntries).length > 0 && mounted) {
        setMediaCache(prev => ({
          ...prev,
          ...newCacheEntries
        }));
      }
    }

    loadUrls();

    return () => {
      mounted = false;
    };
  }, [carouselImages, danteCarouselImages, cantiCarousels, newImageUrl, newDanteImageUrl, newCantoImageUrl, mediaCache, selectedDisciplina, activeCanto]);

  useEffect(() => {
    setCantoCarouselIndex(0);
    setIsCantoCarouselEditorMode(false);
    setAudioCantoIndex(selectedCantoIndex);
  }, [selectedCantoIndex]);

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string, carouselType: "journey" | "dante" | "canti" = "journey") => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingImage(true);
    setResizeDirection(direction);
    setActiveEditingCarousel(carouselType);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    
    const currentCantoImages = (() => {
      const key = `${selectedDisciplina}_${activeCanto.number}`;
      if (cantiCarousels && cantiCarousels[key] && cantiCarousels[key].length > 0) return cantiCarousels[key];
      if (selectedDisciplina === "Italiano") {
        const defaults = DEFAULT_CANTO_IMAGES[activeCanto.number];
        if (defaults) return defaults;
      }
      return [
        {
          id: `default-canto-fallback-${activeCanto.number}`,
          url: activeCanto.number === 1 
            ? "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200"
            : activeCanto.number === 2
            ? "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200"
            : activeCanto.number === 3
            ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
            : activeCanto.number === 4
            ? "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"
            : "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200",
          caption: `Illustration for ${activeCanto.title}.`,
          scale: 1,
          x: 0,
          y: 0
        }
      ];
    })();

    const imgList = carouselType === "dante" 
      ? danteCarouselImages 
      : carouselType === "canti"
      ? currentCantoImages
      : carouselImages;
    const curIndex = carouselType === "dante" 
      ? danteCarouselIndex 
      : carouselType === "canti"
      ? cantoCarouselIndex
      : carouselIndex;
    const curImg = imgList[curIndex % imgList.length];
    setImageStartScale(curImg?.scale || 1.0);
    setImageStartCrop({
      top: curImg?.crop?.top || 0,
      right: curImg?.crop?.right || 0,
      bottom: curImg?.crop?.bottom || 0,
      left: curImg?.crop?.left || 0,
    });
  };

  // Window-level mouse interaction handler for draggable/resizable image cropping
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingImage) {
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;
        
        const setter = activeEditingCarousel === "dante"
          ? setDanteCarouselImages
          : activeEditingCarousel === "canti"
          ? (updater: any) => {
              const key = `${selectedDisciplina}_${activeCanto.number}`;
              setCantiCarousels(prev => {
                const currentImages = (() => {
                  if (prev[key] && prev[key].length > 0) return prev[key];
                  if (selectedDisciplina === "Italiano") {
                    const defaults = DEFAULT_CANTO_IMAGES[activeCanto.number];
                    if (defaults) return defaults;
                  }
                  return [
                    {
                      id: `default-canto-fallback-${activeCanto.number}`,
                      url: activeCanto.number === 1 
                        ? "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200"
                        : activeCanto.number === 2
                        ? "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200"
                        : activeCanto.number === 3
                        ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
                        : activeCanto.number === 4
                        ? "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"
                        : "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200",
                      caption: `Illustration for ${activeCanto.title}.`,
                      scale: 1,
                      x: 0,
                      y: 0
                    }
                  ];
                })();
                const resolvedImages = typeof updater === "function" ? updater(currentImages) : updater;
                return {
                  ...prev,
                  [key]: resolvedImages
                };
              });
            }
          : setCarouselImages;
          
        const curIdx = activeEditingCarousel === "dante"
          ? danteCarouselIndex
          : activeEditingCarousel === "canti"
          ? cantoCarouselIndex
          : carouselIndex;
        
        setter((prev: any) => {
          const updated = [...prev];
          const idx = curIdx % updated.length;
          if (updated[idx]) {
            updated[idx] = {
              ...updated[idx],
              x: imageStartOffsets.x + dx,
              y: imageStartOffsets.y + dy
            };
          }
          return updated;
        });
      } else if (isResizingImage) {
        const dx = e.clientX - dragStartPos.x;
        const dy = e.clientY - dragStartPos.y;
        
        const setter = activeEditingCarousel === "dante"
          ? setDanteCarouselImages
          : activeEditingCarousel === "canti"
          ? (updater: any) => {
              const key = `${selectedDisciplina}_${activeCanto.number}`;
              setCantiCarousels(prev => {
                const currentImages = (() => {
                  if (prev[key] && prev[key].length > 0) return prev[key];
                  if (selectedDisciplina === "Italiano") {
                    const defaults = DEFAULT_CANTO_IMAGES[activeCanto.number];
                    if (defaults) return defaults;
                  }
                  return [
                    {
                      id: `default-canto-fallback-${activeCanto.number}`,
                      url: activeCanto.number === 1 
                        ? "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200"
                        : activeCanto.number === 2
                        ? "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200"
                        : activeCanto.number === 3
                        ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
                        : activeCanto.number === 4
                        ? "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"
                        : "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200",
                      caption: `Illustration for ${activeCanto.title}.`,
                      scale: 1,
                      x: 0,
                      y: 0
                    }
                  ];
                })();
                const resolvedImages = typeof updater === "function" ? updater(currentImages) : updater;
                return {
                  ...prev,
                  [key]: resolvedImages
                };
              });
            }
          : setCarouselImages;
          
        const curIdx = activeEditingCarousel === "dante"
          ? danteCarouselIndex
          : activeEditingCarousel === "canti"
          ? cantoCarouselIndex
          : carouselIndex;
        
        if (["top-left", "top-right", "bottom-left", "bottom-right"].includes(resizeDirection)) {
          // Corner handles: Zoom in / zoom out
          let change = 0;
          if (resizeDirection.includes("right")) {
            change = dx;
          } else if (resizeDirection.includes("left")) {
            change = -dx;
          } else if (resizeDirection.includes("bottom")) {
            change = dy;
          } else if (resizeDirection.includes("top")) {
            change = -dy;
          } else {
            change = Math.abs(dx) > Math.abs(dy) ? dx : dy;
          }
          
          const scaleSpeedMultiplier = 0.006;
          const newScale = Math.max(0.5, Math.min(6.0, imageStartScale + (change * scaleSpeedMultiplier)));
          
          setter((prev: any) => {
            const updated = [...prev];
            const idx = curIdx % updated.length;
            if (updated[idx]) {
              updated[idx] = {
                ...updated[idx],
                scale: parseFloat(newScale.toFixed(3))
              };
            }
            return updated;
          });
        } else {
          // Edge handles: Crop (top, bottom, left, right)
          const deltaPercent = 0.25;
          setter((prev: any) => {
            const updated = [...prev];
            const idx = curIdx % updated.length;
            if (updated[idx]) {
              const currentCrop = updated[idx].crop || { top: 0, right: 0, bottom: 0, left: 0 };
              let top = currentCrop.top;
              let right = currentCrop.right;
              let bottom = currentCrop.bottom;
              let left = currentCrop.left;
              
              if (resizeDirection === "top") {
                top = Math.max(0, Math.min(80, imageStartCrop.top + (dy * deltaPercent)));
              } else if (resizeDirection === "bottom") {
                bottom = Math.max(0, Math.min(80, imageStartCrop.bottom - (dy * deltaPercent)));
              } else if (resizeDirection === "left") {
                left = Math.max(0, Math.min(80, imageStartCrop.left + (dx * deltaPercent)));
              } else if (resizeDirection === "right") {
                right = Math.max(0, Math.min(80, imageStartCrop.right - (dx * deltaPercent)));
              }
              
              updated[idx] = {
                ...updated[idx],
                crop: {
                  top: parseFloat(top.toFixed(1)),
                  right: parseFloat(right.toFixed(1)),
                  bottom: parseFloat(bottom.toFixed(1)),
                  left: parseFloat(left.toFixed(1))
                }
              };
            }
            return updated;
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingImage(false);
      setIsResizingImage(false);
    };

    if (isDraggingImage || isResizingImage) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingImage, isResizingImage, dragStartPos, imageStartOffsets, imageStartScale, imageStartCrop, resizeDirection, carouselIndex, danteCarouselIndex, cantoCarouselIndex, activeEditingCarousel, selectedDisciplina, activeCanto]);

  const currentQuizQuestions = customQuestions && customQuestions.length > 0
    ? customQuestions
    : (selectedDisciplina === "Italiano"
        ? quizQuestions
        : (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.quiz || quizQuestions));

  const activeExplorerCircleData = selectedDisciplina === "Italiano"
    ? explorerCircleData
    : (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.explorerCircles || [
        {
          id: 0,
          title: "Lezione 1",
          canto: "Lezione 1",
          luogo: "Introduzione",
          personaggi: "Insegnante",
          custodi: "Curiosità",
          contrappasso: "Studio",
          versi: "Definizione base",
          parafrasi: "Spiegazione approfondita"
        }
      ]);

  // Auto-reset index if changing subject causes index overflow
  useEffect(() => {
    setSelectedCantoIndex(0);
    setSelectedExplorerCircle(null);
  }, [selectedDisciplina]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isDisciplinaDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const btn = document.getElementById("discipline-select-btn");
      if (btn && btn.contains(e.target as Node)) return;
      setIsDisciplinaDropdownOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isDisciplinaDropdownOpen]);

  // --- QUIZ GAME LOGIC ---
  const handleAnswerSelect = (qId: number, index: number) => {
    if (Object.keys(submittedQuestions).length === currentQuizQuestions.length) return;
    setUserAnswers({ ...userAnswers, [qId]: index });
  };

  const submitQuestion = (qId: number, correctIdx: number) => {
    if (submittedQuestions[qId] || userAnswers[qId] === undefined) return;
    
    const isCorrect = userAnswers[qId] === correctIdx;
    let finalScore = score;
    if (isCorrect) {
      finalScore = score + 1;
      setScore((prev) => prev + 1);
    }
    const nextSubmitted = { ...submittedQuestions, [qId]: true };
    setSubmittedQuestions(nextSubmitted);

    // If an active profile is loaded and this completes the quiz, generate and append a QuizReport
    if (Object.keys(nextSubmitted).length === currentQuizQuestions.length && activeProfileId) {
      const answersRecord = currentQuizQuestions.map(q => {
        const selectedIdx = q.id === qId ? userAnswers[qId] : userAnswers[q.id];
        const correct = q.correctAnswerIndex;
        return {
          question: q.question,
          questionEn: q.questionEn,
          selectedOption: q.options[selectedIdx] ?? "",
          selectedOptionEn: q.optionsEn[selectedIdx] ?? "",
          correctOption: q.options[correct] ?? "",
          correctOptionEn: q.optionsEn[correct] ?? "",
          isCorrect: selectedIdx === correct
        };
      });

      const newReport: QuizReport = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }),
        score: finalScore,
        totalQuestions: currentQuizQuestions.length,
        answers: answersRecord
      };

      setQuizReports(prev => [newReport, ...prev]);
    }
  };

  const submitAllQuiz = () => {
    if (Object.keys(submittedQuestions).length === currentQuizQuestions.length) return;
    
    let finalScore = 0;
    const nextSubmitted: { [key: number]: boolean } = {};
    
    currentQuizQuestions.forEach((q) => {
      const selectedIdx = userAnswers[q.id];
      if (selectedIdx !== undefined && selectedIdx === q.correctAnswerIndex) {
        finalScore += 1;
      }
      nextSubmitted[q.id] = true;
    });
    
    setScore(finalScore);
    setSubmittedQuestions(nextSubmitted);

    // If an active profile is loaded, generate and append a QuizReport
    if (activeProfileId) {
      const answersRecord = currentQuizQuestions.map(q => {
        const selectedIdx = userAnswers[q.id];
        const correct = q.correctAnswerIndex;
        return {
          question: q.question,
          questionEn: q.questionEn,
          selectedOption: selectedIdx !== undefined ? (q.options[selectedIdx] ?? "") : "",
          selectedOptionEn: selectedIdx !== undefined ? (q.optionsEn[selectedIdx] ?? "") : "",
          correctOption: q.options[correct] ?? "",
          correctOptionEn: q.optionsEn[correct] ?? "",
          isCorrect: selectedIdx === correct
        };
      });

      const newReport: QuizReport = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }),
        score: finalScore,
        totalQuestions: currentQuizQuestions.length,
        answers: answersRecord
      };

      setQuizReports(prev => [newReport, ...prev]);
    }
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
    setScore(0);
    setActiveQuestionIndex(0);
  };

  // Translation Helper
  const t = (itStr: string, enStr: string) => {
    return currentLang === "it" ? itStr : enStr;
  };

  // Simplification and Translation Helper for other sections
  const getTxt = (key: keyof typeof simplifiedTexts, originalIt: string, originalEn: string) => {
    if (selectedDisciplina === "Italiano" && isCaaActive && simplifiedTexts[key]) {
      return currentLang === "it" ? simplifiedTexts[key].it : simplifiedTexts[key].en;
    }
    return currentLang === "it" ? originalIt : originalEn;
  };

  // Render individual verse line parsed with terms from the glossary
  const renderVerseWithGlossary = (text: string, tercetId: number) => {
    // Find glossary terms for this tercetId
    const terms = glossaryTerms.filter(t => t.tercetId === tercetId);
    if (terms.length === 0) return text;

    // Sort terms by word length descending so we don't match subwords first
    const sortedTerms = [...terms].sort((a, b) => b.word.length - a.word.length);

    const escapeRegExp = (st: string) => st.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${sortedTerms.map(t => escapeRegExp(t.word)).join("|")})`, "gi");

    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, idx) => {
          const matchedTerm = sortedTerms.find(t => t.word.toLowerCase() === part.toLowerCase());
          if (matchedTerm) {
            return (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGlossaryTerm(matchedTerm);
                }}
                onMouseEnter={() => {
                  setActiveHoveredTerm(matchedTerm);
                }}
                onMouseLeave={() => {
                  setActiveHoveredTerm(null);
                }}
                className={`relative cursor-help font-bold transition-all inline-block hover:scale-[1.03] hover:text-[#e5383b] ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
                title={currentLang === "it" ? matchedTerm.definitionIt : matchedTerm.definitionEn}
                id={`glossary-word-${matchedTerm.word}`}
              >
                {part}
                
                {/* Tooltip on Hover */}
                {activeHoveredTerm === matchedTerm && (
                  <span
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-lg shadow-xl text-xs font-sans border w-64 z-50 animate-fade-in block text-left ${
                      isDarkMode ? "bg-stone-950 border-[#a4161a]/30 text-stone-200" : "bg-white border-gray-300 text-[#161a1d] shadow-stone-400"
                    }`}
                    style={{ pointerEvents: "none" }}
                  >
                    <span className="font-bold text-[#e5383b] block border-b border-[#a4161a]/10 pb-1 mb-1 uppercase font-mono tracking-wider text-[10px]">
                      {currentLang === "it" ? "Parola Arcaica / Difficile" : "Archaic / Difficult Word"}
                    </span>
                    <span className="font-serif italic font-bold text-sm block mb-1 text-red-500">
                      "{matchedTerm.word}"
                    </span>
                    <p className="font-light leading-relaxed mb-1.5 whitespace-normal">
                      {currentLang === "it" ? matchedTerm.definitionIt : matchedTerm.definitionEn}
                    </p>
                    <span className="bg-[#a4161a]/10 text-[#e5383b] px-1.5 py-0.5 rounded font-mono font-bold text-[9px] block w-max uppercase tracking-wide leading-none">
                      {currentLang === "it" ? matchedTerm.tercetLabelIt : matchedTerm.tercetLabelEn}
                    </span>
                  </span>
                )}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <div
      id="main-layout"
      className={`min-h-screen transition-colors duration-300 font-sans tracking-tight relative ${
        isDarkMode ? "bg-[#0b090a] text-[#f5f3f4]" : "bg-[#efefef] text-[#161a1d]"
      } ${zoomStyles.body}`}
    >
      {/* 1. DUOTONE ACCESSIBILITY COLOR FILTER OVERLAY */}
      {selectedOverlay !== "none" && (
        <div style={getOverlayStyle()} aria-hidden="true" />
      )}

      {/* 2. ACCESSIBLE TOP NAVIGATION BAR (STAYS ON ONE LINE AT MOBILE) */}
      <header
        id="accessible-navbar"
        className={`sticky top-0 z-[100] py-3 px-3 sm:px-6 flex items-center justify-between border-b transition-colors duration-300 pointer-events-auto ${
          isDarkMode
            ? "bg-[#0b090affa] border-[#2d0909]/40 backdrop-blur-md"
            : "bg-[#efefeffa] border-gray-300 shadow-sm backdrop-blur-md"
        }`}
      >
        <div className="flex flex-col items-center space-y-1 w-[214px]">
          {/* Dropdown for selecting discipline in lower secondary school */}
          <div className="relative w-full">
            <button
              id="discipline-select-btn"
              onClick={() => setIsDisciplinaDropdownOpen(!isDisciplinaDropdownOpen)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded text-xs transition-all flex items-center justify-between w-full font-medium border select-none shadow-none ${
                isDarkMode
                  ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800"
                  : "bg-white border-gray-300 text-stone-800 hover:bg-gray-100"
              }`}
              title={t("Seleziona la materia didattica", "Select educational subject")}
            >
              <span className="tracking-wide truncate pr-1 flex items-baseline gap-1 w-full overflow-hidden text-left">
                {(() => {
                  const label = currentLang === "it"
                    ? (disciplines.find(d => d.id === selectedDisciplina)?.labelIt || selectedDisciplina)
                    : (disciplines.find(d => d.id === selectedDisciplina)?.labelEn || selectedDisciplina);
                  const parenIdx = label.indexOf(" (");
                  if (parenIdx === -1) return <span className="font-bold">{label}</span>;
                  return (
                    <span className="flex items-baseline gap-1 truncate w-full">
                      <span className="font-bold shrink-0">{label.substring(0, parenIdx)}</span>
                      <span className="text-[10px] opacity-75 truncate">{label.substring(parenIdx)}</span>
                    </span>
                  );
                })()}
              </span>
              <ChevronRight
                size={13}
                className={`transform transition-transform duration-300 shrink-0 ${isDisciplinaDropdownOpen ? "rotate-90 text-[#a4161a]" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            {isDisciplinaDropdownOpen && (
              <div
                className={`absolute left-0 mt-2 w-72 sm:w-80 rounded-lg shadow-2xl border z-50 animate-fade-in overflow-hidden ${
                  isDarkMode
                    ? "bg-[#0b090a] border-stone-800 text-stone-300 shadow-black/80"
                    : "bg-white border-gray-200 text-stone-850 shadow-stone-300/60"
                }`}
              >
                <div className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b ${
                  isDarkMode ? "bg-stone-900/60 border-stone-800 text-stone-400" : "bg-stone-50 border-gray-100 text-stone-500"
                }`}>
                  {t("Seleziona Disciplina d'Insegnamento", "Select Teaching Discipline")}
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-100/10 dark:divide-stone-800/40">
                  {disciplines.map((d) => {
                    const isActive = d.id === selectedDisciplina;
                    return (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSelectedDisciplina(d.id);
                          setIsDisciplinaDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-all hover:pl-6 ${
                          isActive
                            ? "bg-[#a4161a] text-white font-bold"
                            : isDarkMode
                            ? "hover:bg-stone-900 hover:text-white"
                            : "hover:bg-stone-100 hover:text-stone-900"
                        }`}
                      >
                        <div className="flex items-center overflow-hidden">
                          <span className="text-xs sm:text-sm font-sans tracking-tight inline-flex items-baseline gap-1 flex-wrap sm:flex-nowrap">
                            {(() => {
                              const label = currentLang === "it" ? d.labelIt : d.labelEn;
                              const parenIdx = label.indexOf(" (");
                              if (parenIdx === -1) return <span className="font-semibold">{label}</span>;
                              return (
                                <>
                                  <span className="font-semibold shrink-0">{label.substring(0, parenIdx)}</span>
                                  <span className={`text-[10px] sm:text-[11px] font-normal whitespace-nowrap opacity-85 ${isActive ? "text-white" : "text-stone-500 dark:text-stone-400"}`}>
                                    {label.substring(parenIdx)}
                                  </span>
                                </>
                              );
                            })()}
                          </span>
                        </div>
                        {isActive && (
                          <span className="text-xs font-mono uppercase bg-white/20 px-1.5 py-0.5 rounded shrink-0 ml-2">
                            {t("Attiva", "Active")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <span className="text-[11px] font-sans tracking-[0.012em] text-stone-600 dark:text-stone-400 uppercase block w-full leading-none font-medium text-center whitespace-nowrap">
            {t("Scuola Secondaria di I Grado", "Lower Secondary School")}
          </span>
        </div>

        {/* CONTROLS AREA - PERFECTLY ALIGNED AND COMPACT */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* T1. Language Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={() => {
              setCurrentLang(currentLang === "it" ? "en" : "it");
            }}
            title={t("Cambia lingua", "Change language")}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded text-xs sm:text-sm font-mono transition-all flex items-center gap-1 leading-none ${
              isDarkMode ? "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Languages size={13} />
            <span className="font-bold">{currentLang === "it" ? "IT" : "EN"}</span>
          </button>

          {/* T2. Paraphrase Toggle */}
          <button
            id="paraphrase-toggle-btn"
            onClick={() => {
              setIsParaphraseActive(!isParaphraseActive);
            }}
            title={t("Attiva/Disattiva Parafrasi a fronte", "Toggle Facing Paraphrase")}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded text-xs transition-all flex items-center gap-1 font-medium ${
              isParaphraseActive
                ? "bg-[#a4161a] text-white shadow-inner"
                : isDarkMode
                ? "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BookOpen size={13} />
            <span className="hidden md:inline text-[11px]">{t("Parafrasi", "Paraphrase")}</span>
            <span className="md:hidden text-[10px]">{t("Paraf", "Paraf")}</span>
          </button>

          {/* T3. CAA (Symbol Text) Toggle */}
          <button
            id="caa-toggle-btn"
            onClick={() => {
              setIsCaaActive(!isCaaActive);
            }}
            title={t("Attiva Comunicazione Aumentativa con Simboli", "Toggle Augmentative Communication Symbols")}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded text-xs transition-all flex items-center gap-1 font-medium ${
              isCaaActive
                ? "bg-[#a4161a] text-white"
                : isDarkMode
                ? "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Wand2 size={13} className={isCaaActive ? "animate-pulse" : ""} />
            <span className="hidden md:inline text-[11px]">{t("Semplifica CAA", "Simplify AAC")}</span>
            <span className="md:hidden text-[10px]">{t("CAA", "AAC")}</span>
          </button>

          {/* T4. Text Zoom Eye Selector */}
          <button
            id="zoom-toggle-btn"
            onClick={() => {
              setZoomLevel((prev) => (prev === 4 ? 1 : prev + 1));
            }}
            title={t(`Modifica zoom testo (Livello ${zoomLevel})`, `Edit text zoom (Level ${zoomLevel})`)}
            className={`p-1.5 sm:p-2 rounded transition-all relative flex items-center gap-1 ${
              isDarkMode ? "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Eye size={13} />
            <span className="text-xs sm:text-sm font-mono font-bold leading-none">{zoomLevel}x</span>
          </button>

          {/* T5. Color Overlay Button */}
          <button
            id="overlay-palette-btn"
            onClick={() => {
              setIsOverlayModalOpen(true);
            }}
            title={t("Imposta filtro lettura per Dyslexia", "Set reading filter for Dyslexia")}
            className={`p-1.5 sm:p-2 rounded transition-all flex items-center gap-1 border ${
              selectedOverlay !== "none"
                ? "bg-teal-750 text-emerald-950 animate-pulse"
                : isDarkMode
                ? "border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
            style={
              selectedOverlay !== "none" && getActiveFilterBorderColor()
                ? { borderColor: getActiveFilterBorderColor() }
                : {}
            }
          >
            <Palette size={13} />
            <span className="text-xs sm:text-sm font-mono leading-none">
              {selectedOverlay !== "none" ? "•" : ""}
            </span>
          </button>

          {/* T6. Light/Dark Mode Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={() => {
              setIsDarkMode(!isDarkMode);
            }}
            title={t("Inverti colori di sfondo", "Invert background colors")}
            className={`p-1.5 sm:p-2 rounded transition-all ${
              isDarkMode
                ? "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* T7. Profilo Alunno Personalizzazione */}
          <button
            id="student-profile-btn"
            onClick={() => {
              setIsProfileModalOpen(true);
            }}
            title={t("profilo alunno", "student profile")}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded text-xs transition-all flex items-center gap-1 font-medium ${
              activeProfileId
                ? "bg-[#a4161a] text-white shadow-md animate-pulse"
                : isDarkMode
                ? "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User size={13} />
            <span className="hidden md:inline text-[11px]">
              {activeProfileId 
                ? personalProfiles.find(p => p.id === activeProfileId)?.name || t("Profilo", "Profile")
                : t("Profilo Alunno", "Student Profile")}
            </span>
            <span className="md:hidden text-[10px]">
              {activeProfileId 
                ? personalProfiles.find(p => p.id === activeProfileId)?.name || t("Alun.", "Stud.")
                : t("Profilo", "Profile")}
            </span>
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION WITH MINIMAL PRESENTATION */}
      <section
        id="hero-section"
        className={`relative overflow-hidden border-b border-[#a4161a]/25 transition-colors duration-300 ${
          isDarkMode ? "bg-stone-950/40" : "bg-white"
        }`}
        style={heroBgImgUrl ? { backgroundImage: `url(${heroBgImgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {heroBgImgUrl && (
          <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${isDarkMode ? "bg-stone-950/85" : "bg-white/85"}`} />
        )}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex flex-col justify-center items-center">
          <h1
            className={`font-display tracking-tight mb-6 uppercase leading-none ${
              isDarkMode ? "text-white" : "text-[#161a1d]"
            } ${zoomStyles.titleHero}`}
          >
            {t("Il Cammino", "The Journey")} <br />
            <span className={`${isDarkMode ? "text-white" : "text-[#a4161a]"}`}>{t("delle Stelle", "of the Stars")}</span>
          </h1>
          <div className="max-w-2xl mt-4 space-y-1 flex flex-col items-center">
            <p className={`text-sm sm:text-base md:text-lg font-light leading-relaxed italic ${isDarkMode ? "text-white" : "text-stone-600"}`}>
              {(() => {
                const info = DISCIPLINE_HERO_QUOTES[selectedDisciplina] || DISCIPLINE_HERO_QUOTES["Italiano"];
                return currentLang === "it" ? info.quoteIt : info.quoteEn;
              })()}
            </p>
            {selectedDisciplina === "Italiano" && (
              <span className="text-[10px] sm:text-xs font-mono text-stone-400 self-end pr-1 sm:pr-4">
                — Canto XXXIV, v.139
              </span>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            {selectedDisciplina === "Italiano" ? (
              <>
                <button
                  onClick={() => {
                    setIsLibraryOpen(true);
                  }}
                  className="px-6 py-3 rounded bg-[#a4161a] hover:bg-[#e5383b] text-white font-medium transition-all shadow-lg hover:shadow-[#e5383b]/20 text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 text-center"
                >
                  <Compass size={14} />
                  <span>{t("Dante explorer", "Dante Explorer")}</span>
                </button>
                <button
                  onClick={() => {
                    setIsExplorerOpen(true);
                  }}
                  className={`px-6 py-3 rounded border font-medium transition-all text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 ${
                    isDarkMode
                      ? "border-white/20 hover:border-white/50 bg-stone-900/40 text-stone-200 hover:text-white"
                      : "border-gray-300 hover:border-gray-500 bg-stone-150 text-gray-700 hover:text-gray-950"
                  }`}
                >
                  <Compass size={14} />
                  <span>{t("Esplora la Mappa", "Explore the Map")}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection("dante-section")}
                  className="px-6 py-3 rounded bg-[#a4161a] hover:bg-[#e5383b] text-white font-medium transition-all shadow-lg hover:shadow-[#e5383b]/20 text-xs sm:text-sm tracking-wider uppercase"
                >
                  {`${currentLang === "it" ? "Inizia da" : "Start with"} ${currentBio.name}`}
                </button>
                <button
                  onClick={() => {
                    setIsExplorerOpen(true);
                  }}
                  className={`px-6 py-3 rounded border font-medium transition-all text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 ${
                    isDarkMode
                      ? "border-white/20 hover:border-white/50 bg-stone-900/40 text-stone-200 hover:text-white"
                      : "border-gray-300 hover:border-gray-500 bg-stone-150 text-gray-700 hover:text-gray-950"
                  }`}
                >
                  <Compass size={14} />
                  {t("Esplora la Mappa", "Explore the Map")}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PEDAGOGICAL STATEMENT CARD (UDL & SAMR PROFILES) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div
          className={`p-6 rounded-lg border flex flex-col md:flex-row gap-6 items-start justify-between ${
            isDarkMode ? "bg-stone-950/60 border-stone-800" : "bg-transparent border-gray-300 shadow-sm"
          }`}
        >
          <div className="space-y-3 max-w-3xl">
            <h2 className={`text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${isDarkMode ? "text-stone-400" : "text-stone-700"}`}>
              <Info size={12} />
              {t("Riferimenti Normativi e Cornice Didattica", "Regulatory Framework & Didactic Frame")}
            </h2>
            <p className={`text-xs sm:text-sm ${isDarkMode ? "text-stone-400" : "text-stone-700"}`}>
              {getTxt(
                "pedagogical_desc",
                "Piattaforma progetatta secondo la Differenziazione Didattica (D.M. 5669/2011). Implementa i tre principi dell'Universal Design for Learning (UDL: Molteplici mezzi di Rappresentazione, Azione/Espressione, Coinvolgimento) e si colloca al livello di RIDEFINIZIONE nella scala SAMR tramite l'adattabilità visiva immediata e il supporto CAA semantico interattivo.",
                "Platform designed under Italian Special Education Guidelines (D.M. 5669/2011) implementing the three Universal Design for Learning (UDL) principles, operating at the REDEFINITION level of the SAMR scale thanks to interactive symbols and live sensory layouts."
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
            <button
              onClick={() => setIsUdlModalOpen(true)}
              className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded border font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 ${
                isDarkMode 
                  ? "bg-stone-900 border-stone-800 text-amber-500 hover:text-amber-400 hover:bg-stone-850" 
                  : "bg-amber-100/30 border-amber-300 text-[#a4161a] hover:bg-amber-100/60"
              }`}
              title={t("Sviluppo del metamodello didattico 'Il Cammino delle Stelle' - Principi UDL", "Click to explore the UDL & project framework details")}
            >
              <span>UDL</span>
              <span className="text-[8px] opacity-80">★</span>
            </button>
            <span className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded border ${isDarkMode ? "bg-stone-900/20 border-stone-800 text-stone-400" : "bg-stone-100 border-stone-300 text-[#161a1d]"}`}>
              SAMR Redefinition
            </span>
          </div>
        </div>
      </section>

      {/* 4. DANTE SECTION WITH BIOGRAPHICAL INFORMATION */}
      <section id="dante-section" className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-stretch items-center">
          {/* Left Column: Woodcut Inspired Engraved Portrait */}
          <div className="lg:col-span-4 flex justify-center lg:self-stretch">
            <div className={`relative group w-full max-w-[288px] sm:max-w-[320px] lg:max-w-none lg:w-full lg:h-full flex flex-col ${
              activeProfileId && selectedOverlay !== "none" ? "z-[10001]" : ""
            }`}>
              {selectedDisciplina !== "Italiano" && (
                <div className="absolute inset-x-0 -bottom-1 h-full w-full bg-[#a4161a] rounded-lg rotate-2 group-hover:rotate-1 transition-all duration-300 -z-10" />
              )}
              <div
                className={`w-full h-full flex flex-col flex-1 transition-all duration-300 p-3 rounded-lg border ${
                  isDarkMode
                    ? isCurrentDanteImgCustomOrUploaded
                      ? "border-stone-200 bg-white shadow-sm text-stone-900"
                      : "border-stone-800 bg-[#0b090a] shadow-inner"
                    : "border-stone-200 bg-white shadow-sm"
                }`}
              >
                {imageStyle === "hidden" ? (
                  <div className={`w-full h-full lg:min-h-0 min-h-[16rem] rounded border border-dashed flex flex-col flex-1 items-center justify-center p-6 text-center ${
                    isDarkMode ? "bg-stone-900/10 border-stone-800 text-stone-500" : "bg-stone-50 border-gray-300 text-gray-400"
                  }`}>
                    <User size={30} className="mb-2 text-[#a4161a]/60" />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold">{t("Immagine Nascosta", "Image Hidden")}</span>
                    <p className="text-[10px] mt-1 leading-normal italic">
                       {t("Illustrazione disattivata da profilo alunno.", "Illustration disabled by student profile.")}
                    </p>
                  </div>
                ) : selectedDisciplina === "Italiano" ? (
                  <div className="relative group/dantecarousel w-full flex flex-col h-full justify-between flex-1">
                    <div
                       id="dante-carousel-box"
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        setIsDanteCarouselEditorMode(!isDanteCarouselEditorMode);
                        setActiveEditingCarousel("dante");
                      }}
                       className={`relative overflow-hidden rounded shadow-sm aspect-square w-full bg-transparent flex items-center justify-center select-none border transition-all duration-250 min-h-[16rem] flex-1 ${
                        isDanteCarouselEditorMode
                          ? "border-dashed border-[#a4161a] ring-2 ring-[#a4161a]/30"
                          : "border-stone-300 dark:border-stone-850"
                      }`}
                      title={t("Doppio clic per entrare/uscire dalla modalità editor", "Double click to edit")}
                    >
                      {danteCarouselImages.length > 0 ? (
                        (() => {
                          const curImg = danteCarouselImages[danteCarouselIndex % danteCarouselImages.length];
                          const scale = curImg?.scale || 1.0;
                          const x = curImg?.x || 0;
                          const y = curImg?.y || 0;
                          const isCustomOrUploaded = (curImg?.id && !["default-dante-portrait-1", "default-dante-portrait-2"].includes(curImg.id)) || (curImg?.id === "default-dante-portrait-1" && imageStyle === "custom" && customDanteImgUrl);
                          const isVideo = isVideoContent(curImg);

                          return (
                            <>
                              {isVideo ? (
                                isYouTubeUrl(curImg?.url) ? (
                                  <iframe
                                    src={getYouTubeEmbedUrl(curImg?.url) || ""}
                                    className={`w-full h-full select-none transition-all duration-75 object-contain bg-black ${
                                      isDanteCarouselEditorMode ? "pointer-events-none" : ""
                                    }`}
                                    style={{
                                      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                      transformOrigin: "center center",
                                    }}
                                    title={curImg?.caption || "YouTube Video"}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video
                                    src={resolveUrl(curImg?.id === "default-dante-portrait-1" && imageStyle === "custom" && customDanteImgUrl ? customDanteImgUrl : curImg?.url)}
                                    controls={!isDanteCarouselEditorMode}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    onMouseDown={(e) => {
                                      if (!isDanteCarouselEditorMode) return;
                                      e.preventDefault();
                                      setIsDraggingImage(true);
                                      setActiveEditingCarousel("dante");
                                      setDragStartPos({ x: e.clientX, y: e.clientY });
                                      setImageStartOffsets({ x: curImg.x || 0, y: curImg.y || 0 });
                                    }}
                                    className={`w-full h-full select-none transition-all duration-75 ${
                                      isCustomOrUploaded ? "object-contain bg-transparent" : "object-cover"
                                    } ${
                                      isDanteCarouselEditorMode ? "cursor-grab active:cursor-grabbing hover:brightness-110" : ""
                                    }`}
                                    style={{
                                      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                      transformOrigin: "center center",
                                      clipPath: curImg?.crop 
                                        ? `inset(${curImg.crop.top}% ${curImg.crop.right}% ${curImg.crop.bottom}% ${curImg.crop.left}%)` 
                                        : "none"
                                    }}
                                  />
                                )
                              ) : isCustomOrUploaded ? (
                                <img
                                  src={resolveUrl(curImg?.id === "default-dante-portrait-1" && imageStyle === "custom" && customDanteImgUrl ? customDanteImgUrl : curImg?.url)}
                                  alt={curImg?.caption || t("Ritratto di Dante", "Dante Portrait")}
                                  referrerPolicy="no-referrer"
                                  onMouseDown={(e: React.MouseEvent) => {
                                    if (!isDanteCarouselEditorMode) return;
                                    e.preventDefault();
                                    setIsDraggingImage(true);
                                    setActiveEditingCarousel("dante");
                                    setDragStartPos({ x: e.clientX, y: e.clientY });
                                    setImageStartOffsets({ x: curImg.x || 0, y: curImg.y || 0 });
                                  }}
                                  className={`w-full h-full select-none transition-all duration-75 min-h-[16rem] ${
                                    isCustomOrUploaded ? "object-contain bg-transparent" : "object-cover"
                                  } ${
                                    isDanteCarouselEditorMode ? "cursor-grab active:cursor-grabbing hover:brightness-110" : ""
                                  }`}
                                  style={{
                                    transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                    transformOrigin: "center center",
                                    clipPath: curImg?.crop 
                                        ? `inset(${curImg.crop.top}% ${curImg.crop.right}% ${curImg.crop.bottom}% ${curImg.crop.left}%)` 
                                        : "none"
                                  }}
                                />
                              ) : (
                                <TransparentImage
                                  src={resolveUrl(curImg?.id === "default-dante-portrait-1" && imageStyle === "custom" && customDanteImgUrl ? customDanteImgUrl : curImg?.url)}
                                  alt={curImg?.caption || t("Ritratto di Dante", "Dante Portrait")}
                                  onMouseDown={(e: React.MouseEvent) => {
                                    if (!isDanteCarouselEditorMode) return;
                                    e.preventDefault();
                                    setIsDraggingImage(true);
                                    setActiveEditingCarousel("dante");
                                    setDragStartPos({ x: e.clientX, y: e.clientY });
                                    setImageStartOffsets({ x: curImg.x || 0, y: curImg.y || 0 });
                                  }}
                                  className={`w-full h-full select-none transition-all duration-75 min-h-[16rem] object-cover ${
                                    isDanteCarouselEditorMode ? "cursor-grab active:cursor-grabbing hover:brightness-110" : ""
                                  }`}
                                  style={{
                                    transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                    transformOrigin: "center center",
                                    clipPath: curImg?.crop 
                                      ? `inset(${curImg.crop.top}% ${curImg.crop.right}% ${curImg.crop.bottom}% ${curImg.crop.left}%)` 
                                      : "none"
                                  }}
                                />
                              )}

                              {/* Navigation Controls */}
                              {danteCarouselImages.length > 1 && !isDanteCarouselEditorMode && (
                                <>
                                  {(danteCarouselIndex % danteCarouselImages.length) !== 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDanteCarouselIndex((prev) => (prev - 1 + danteCarouselImages.length) % danteCarouselImages.length);
                                      }}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 md:opacity-0 group-hover/dantecarousel:opacity-100 focus:opacity-100 shadow-md"
                                      title={t("Precedente", "Previous")}
                                    >
                                      <ChevronLeft size={16} />
                                    </button>
                                  )}
                                  {(danteCarouselIndex % danteCarouselImages.length) !== danteCarouselImages.length - 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDanteCarouselIndex((prev) => (prev + 1) % danteCarouselImages.length);
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 md:opacity-0 group-hover/dantecarousel:opacity-100 focus:opacity-100 shadow-md"
                                      title={t("Successivo", "Next")}
                                    >
                                      <ChevronRight size={16} />
                                    </button>
                                  )}
                                </>
                              )}

                              {/* Interactive Draggable Resize Handles */}
                              {isDanteCarouselEditorMode && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 z-20">
                                  <div className="absolute inset-0 border-2 border-dashed border-[#a4161a]/60">
                                    <div className="absolute inset-x-0 top-1/3 border-b border-[#a4161a]/40"></div>
                                    <div className="absolute inset-x-0 top-2/3 border-b border-[#a4161a]/40"></div>
                                    <div className="absolute inset-y-0 left-1/3 border-r border-[#a4161a]/40"></div>
                                    <div className="absolute inset-y-0 left-2/3 border-r border-[#a4161a]/40"></div>
                                  </div>
                                  
                                  <div 
                                    className="absolute top-2 left-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "top-left", "dante")}
                                  />
                                  <div 
                                    className="absolute top-2 right-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "top-right", "dante")}
                                  />
                                  <div 
                                    className="absolute bottom-2 left-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left", "dante")}
                                  />
                                  <div 
                                    className="absolute bottom-2 right-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right", "dante")}
                                  />

                                  <div 
                                    className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-[#a4161a] pointer-events-auto cursor-ns-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "top", "dante")}
                                  />
                                  <div 
                                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-[#a4161a] pointer-events-auto cursor-ns-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "bottom", "dante")}
                                  />
                                  <div 
                                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 rounded-full bg-[#a4161a] pointer-events-auto cursor-ew-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "left", "dante")}
                                  />
                                  <div 
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 rounded-full bg-[#a4161a] pointer-events-auto cursor-ew-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "right", "dante")}
                                  />
                                </div>
                              )}

                              {/* Centering axes guidelines in editor mode */}
                              {isDanteCarouselEditorMode && (
                                <div className="absolute inset-0 pointer-events-none z-10 select-none">
                                  {/* Horizontal middle guide line */}
                                  {Math.abs(y) < 3.5 && (
                                    <div 
                                      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t opacity-100 transition-opacity duration-150"
                                      style={{ borderColor: "crimson", borderTopWidth: "1px" }}
                                    />
                                  )}
                                  {/* Vertical middle guide line */}
                                  {Math.abs(x) < 3.5 && (
                                    <div 
                                      className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l opacity-100 transition-opacity duration-150"
                                      style={{ borderColor: "crimson", borderLeftWidth: "1px" }}
                                    />
                                  )}
                                  {/* Position indicator */}
                                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/75 text-[8px] font-mono text-stone-300 flex items-center gap-1 uppercase tracking-wider z-20 rounded shadow">
                                    <span>X: {x.toFixed(0)}px</span>
                                    <span>Y: {y.toFixed(0)}px</span>
                                    {(Math.abs(x) < 3.5) && (
                                      <span className="text-[#a4161a] font-bold font-sans" style={{ color: "crimson" }}>X: ✓</span>
                                    )}
                                    {(Math.abs(y) < 3.5) && (
                                      <span className="text-[#a4161a] font-bold font-sans" style={{ color: "crimson" }}>Y: ✓</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Quick deletion for custom user images - visible only in editor mode */}
                              {isDanteCarouselEditorMode && curImg?.id && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newImages = danteCarouselImages.filter((img) => img.id !== curImg.id);
                                    setDanteCarouselImages(newImages);
                                    setDanteCarouselIndex(0);
                                  }}
                                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-stone-200 hover:text-red-500 hover:bg-black/80 transition-all duration-200 shadow z-30"
                                  title={t("Elimina questa immagine", "Delete this image")}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}

                              {/* Fullscreen Button - visible only in visualizzazione mode */}
                              {danteCarouselImages.length > 0 && !isDanteCarouselEditorMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFullscreenDanteCarouselOpen(true);
                                  }}
                                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-md z-30 pointer-events-auto select-none font-sans"
                                  title={t("Schermo intero", "Fullscreen")}
                                >
                                  <Maximize2 size={13} />
                                </button>
                              )}

                              {/* Rewind/Restart Carousel Button on Last Image */}
                              {danteCarouselImages.length > 1 && (danteCarouselIndex % danteCarouselImages.length) === (danteCarouselImages.length - 1) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDanteCarouselIndex(0);
                                  }}
                                  className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-md z-30 pointer-events-auto select-none"
                                  title={t("Torna alla prima slide", "Back to first slide")}
                                >
                                  <RotateCcw size={13} />
                                </button>
                              )}

                              {/* Info Overlay at the bottom */}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-3 text-white pointer-events-none">
                                <div className="flex items-center justify-end text-[10px] font-mono opacity-80 mb-1">
                                  {!isDanteCarouselEditorMode && (
                                    <span className="text-[8px] uppercase tracking-wider opacity-60 font-mono hidden group-hover/dantecarousel:inline">
                                      {t("Doppio clic per modificare", "Double-click to edit")}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[9px] font-bold uppercase tracking-wider font-mono text-white leading-relaxed line-clamp-2">
                                  {curImg?.caption || ""}
                                </p>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <div className="text-stone-400 text-xs text-center p-4">
                          {t("Nessuna immagine nel carosello.", "No images in the carousel.")}
                        </div>
                      )}
                    </div>

                    {/* Dots indicator */}
                    {danteCarouselImages.length > 1 && !isDanteCarouselEditorMode && (
                      <div className="flex justify-center gap-1.5 mt-2">
                        {danteCarouselImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setDanteCarouselIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              (danteCarouselIndex % danteCarouselImages.length) === idx ? "w-3 bg-[#a4161a]" : "w-1 bg-stone-350 hover:bg-stone-400"
                            }`}
                            title={`${t("Vai all'immagine", "Go to image")} ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Crop & Zoom Editor Mode Box */}
                    {isDanteCarouselEditorMode && (
                      (() => {
                        const curImg = danteCarouselImages[danteCarouselIndex % danteCarouselImages.length];
                        const scale = curImg?.scale || 1.0;
                        return (
                          <div 
                            id="dante-carousel-editor-controls-box"
                            className={`p-4 rounded-lg border space-y-3 font-mono transition-colors text-start ${
                              isDarkMode 
                                ? "bg-stone-900 border-stone-800 text-stone-300" 
                                : "bg-stone-100 border-stone-200 text-stone-700"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                              <span className="text-[#a4161a] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                                <Crop size={12} /> {t("Editor Ritaglio & Zoom", "Crop & Zoom Editor")}
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setDanteCarouselImages(prev => {
                                      const updated = [...prev];
                                      const idx = danteCarouselIndex % updated.length;
                                      if (updated[idx]) {
                                        updated[idx] = { ...updated[idx], scale: Math.max(0.5, scale - 0.2) };
                                      }
                                      return updated;
                                    });
                                  }}
                                  className={`w-5 h-5 flex items-center justify-center rounded border font-bold text-xs bg-transparent transition-colors ${
                                    isDarkMode
                                      ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                      : "border-black text-black hover:bg-black/5"
                                  }`}
                                  title={t("Riduci", "Zoom Out")}
                                >
                                  -
                                </button>
                                <span className="min-w-[40px] text-center font-bold text-xs">{scale.toFixed(1)}x</span>
                                <button
                                  onClick={() => {
                                    setDanteCarouselImages(prev => {
                                      const updated = [...prev];
                                      const idx = danteCarouselIndex % updated.length;
                                      if (updated[idx]) {
                                        updated[idx] = { ...updated[idx], scale: Math.min(6.0, scale + 0.2) };
                                      }
                                      return updated;
                                    });
                                  }}
                                  className={`w-5 h-5 flex items-center justify-center rounded border font-bold text-xs bg-transparent transition-colors ${
                                    isDarkMode
                                      ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                      : "border-black text-black hover:bg-black/5"
                                  }`}
                                  title={t("Ingrandisci", "Zoom In")}
                                >
                                  +
                                </button>

                                <button
                                  onClick={() => {
                                    setDanteCarouselImages(prev => {
                                      const updated = [...prev];
                                      const idx = danteCarouselIndex % updated.length;
                                      if (updated[idx]) {
                                        updated[idx] = { 
                                          ...updated[idx], 
                                          scale: 1.0, 
                                          x: 0, 
                                          y: 0, 
                                          crop: { top: 0, right: 0, bottom: 0, left: 0 } 
                                        };
                                      }
                                      return updated;
                                    });
                                  }}
                                  className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold bg-transparent transition-colors ${
                                    isDarkMode
                                      ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                      : "border-black text-black hover:bg-black/5"
                                  }`}
                                >
                                  {t("Azzera", "Reset")}
                                </button>
                              </div>
                            </div>

                            {/* Info Note: Not italic, exactly 10pt (13.33px) */}
                            <div className="text-[13.33px] text-stone-500 dark:text-stone-400 leading-normal font-sans">
                              {t("* Trascina l'immagine per spostarla. Trascina i quadratini bianchi ai vertici per lo zoom ed i trattini rossi sui lati per fare liberamente crop.", "* Drag the image to pan. Drag the white corner squares for zoom, and the red side handles to freely crop the image.")}
                            </div>

                            {/* Current Caption Editor field */}
                            {curImg && (
                              <div className="space-y-1.5 pt-3 border-t border-stone-200 dark:border-stone-850">
                                <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                                  {t("Modifica Didascalia Corrente:", "Edit Current Caption:")}
                                </label>
                                <input
                                  type="text"
                                  value={curImg.caption || ""}
                                  onChange={(e) => {
                                    const newCaption = e.target.value;
                                    setDanteCarouselImages((prev) => {
                                      const updated = [...prev];
                                      const idx = danteCarouselIndex % updated.length;
                                      if (updated[idx]) {
                                        updated[idx] = { ...updated[idx], caption: newCaption };
                                      }
                                      return updated;
                                    });
                                  }}
                                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-solid border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-[#a4161a] text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-500 transition-colors hover:border-[#a4161a] dark:hover:border-[#a4161a] font-sans"
                                  placeholder={t("Inserisci didascalia...", "Enter caption...")}
                                />
                              </div>
                            )}

                            {/* Image Ordering and Selection Organizer */}
                            {danteCarouselImages.length > 1 && (
                              <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-stone-850">
                                <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                                  {t("Ordina le immagini (Seleziona, sposta o trascina):", "Order Images (Select, move or drag to reorder):")}
                                </label>
                                <div className="flex flex-wrap gap-2 py-1 items-center bg-black/5 dark:bg-black/20 p-2 rounded-md">
                                  {danteCarouselImages.map((img, idx) => {
                                    const isCurrent = (danteCarouselIndex % danteCarouselImages.length) === idx;
                                    return (
                                      <div 
                                        key={img.id || idx}
                                        draggable={true}
                                        onDragStart={(e) => {
                                          setDanteDraggedThumbIndex(idx);
                                          e.dataTransfer.effectAllowed = "move";
                                        }}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                        }}
                                        onDragEnter={() => setDanteDragOverThumbIndex(idx)}
                                        onDragEnd={() => {
                                          setDanteDraggedThumbIndex(null);
                                          setDanteDragOverThumbIndex(null);
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          if (danteDraggedThumbIndex !== null && danteDraggedThumbIndex !== idx) {
                                            setDanteCarouselImages((prev) => {
                                              const next = [...prev];
                                              const [moved] = next.splice(danteDraggedThumbIndex, 1);
                                              next.splice(idx, 0, moved);
                                              return next;
                                            });
                                            setDanteCarouselIndex(idx);
                                          }
                                          setDanteDraggedThumbIndex(null);
                                          setDanteDragOverThumbIndex(null);
                                        }}
                                        className={`relative group/thumb border rounded p-1 flex flex-col items-center gap-1 transition-all select-none cursor-grab active:cursor-grabbing ${
                                          danteDraggedThumbIndex === idx
                                            ? "opacity-40 border-dashed border-[#a4161a] bg-[#a4161a]/5 scale-95"
                                            : danteDragOverThumbIndex === idx
                                            ? "border-dashed border-[#a4161a] bg-[#a4161a]/25 scale-105"
                                            : isCurrent 
                                            ? "border-[#a4161a] bg-[#a4161a]/10 scale-105" 
                                            : "border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 hover:bg-stone-50 dark:hover:bg-stone-900"
                                        }`}
                                        title={t("Trascina per riordinare", "Drag to reorder")}
                                      >
                                        {/* Red insertion segment indicator */}
                                        {danteDraggedThumbIndex !== null && danteDragOverThumbIndex === idx && danteDraggedThumbIndex !== idx && (
                                          <div 
                                            className={`absolute top-0 bottom-0 w-1 bg-[#a4161a] rounded shadow-[0_0_8px_rgba(164,22,26,0.8)] pointer-events-none z-20 ${
                                              idx < danteDraggedThumbIndex ? "-left-1.5" : "-right-1.5"
                                            }`}
                                          >
                                            {/* Accent dots on top & bottom to highlight the vertical line insertion precision */}
                                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#a4161a] rounded-full shadow-[0_0_6px_rgba(164,22,26,0.8)] border border-white dark:border-stone-950" />
                                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#a4161a] rounded-full shadow-[0_0_6px_rgba(164,22,26,0.8)] border border-white dark:border-stone-950" />
                                          </div>
                                        )}

                                        {/* Thumbnail */}
                                        <div 
                                          className="w-12 h-10 rounded overflow-hidden cursor-pointer relative bg-black/10 flex items-center justify-center shrink-0"
                                          onClick={() => setDanteCarouselIndex(idx)}
                                          title={t("Seleziona questa immagine", "Select this image")}
                                        >
                                          {img.mediaType === "video" ? (
                                            <div className="w-full h-full bg-stone-800 flex items-center justify-center text-[8px] text-white font-mono uppercase font-bold">Vid</div>
                                          ) : (
                                            <img src={img.url} className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                                          )}
                                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[9px] text-white font-bold">#{idx + 1}</span>
                                          </div>
                                        </div>

                                        {/* Left/Right Ordering Buttons and Grip Handle */}
                                        <div className="flex items-center gap-1">
                                          <div className="text-stone-400 dark:text-stone-600 cursor-grab active:cursor-grabbing hover:text-[#a4161a]" title={t("Trascina per riordinare", "Drag to reorder")}>
                                            <GripVertical size={11} />
                                          </div>
                                          <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDanteCarouselImages((prev) => {
                                                const next = [...prev];
                                                const temp = next[idx];
                                                next[idx] = next[idx - 1];
                                                next[idx - 1] = temp;
                                                return next;
                                              });
                                              if (isCurrent) {
                                                setDanteCarouselIndex(idx - 1);
                                              } else if ((danteCarouselIndex % danteCarouselImages.length) === idx - 1) {
                                                setDanteCarouselIndex(idx);
                                              }
                                            }}
                                            className={`p-0.5 rounded border flex items-center justify-center transition-colors ${
                                              idx === 0 
                                                ? "opacity-30 cursor-not-allowed" 
                                                : "hover:bg-[#a4161a] hover:text-white dark:hover:bg-[#a4161a] border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                                            }`}
                                            title={t("Sposta a sinistra", "Move/Order Left")}
                                          >
                                            <ChevronLeft size={10} />
                                          </button>
                                          <button
                                            type="button"
                                            disabled={idx === danteCarouselImages.length - 1}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDanteCarouselImages((prev) => {
                                                const next = [...prev];
                                                const temp = next[idx];
                                                next[idx] = next[idx + 1];
                                                next[idx + 1] = temp;
                                                return next;
                                              });
                                              if (isCurrent) {
                                                setDanteCarouselIndex(idx + 1);
                                              } else if ((danteCarouselIndex % danteCarouselImages.length) === idx + 1) {
                                                setDanteCarouselIndex(idx);
                                              }
                                            }}
                                            className={`p-0.5 rounded border flex items-center justify-center transition-colors ${
                                              idx === danteCarouselImages.length - 1 
                                                ? "opacity-30 cursor-not-allowed" 
                                                : "hover:bg-[#a4161a] hover:text-white dark:hover:bg-[#a4161a] border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                                            }`}
                                            title={t("Sposta a destra", "Move/Order Right")}
                                          >
                                            <ChevronRight size={10} />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-200 dark:border-stone-850">
                              {/* Left action tools: Nuova Immagine button */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => setIsDanteAddingImage(!isDanteAddingImage)}
                                  className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shadow transition-all duration-200 flex items-center gap-1 shrink-0 ${
                                    isDanteAddingImage
                                      ? "bg-[#a4161a] text-white hover:bg-[#a4161a]/90"
                                      : isDarkMode
                                      ? "bg-stone-800 hover:bg-stone-750 text-stone-200"
                                      : "bg-stone-200 hover:bg-stone-300 text-stone-800"
                                  }`}
                                  title={t("Aggiungi nuova immagine", "Add new image")}
                                >
                                  <Plus size={10} />
                                  {t("Nuova Immagine", "Add Image")}
                                </button>
                              </div>

                              {/* Right action tools: Fine button */}
                              <button
                                onClick={() => setIsDanteCarouselEditorMode(false)}
                                className="px-3 py-1 bg-[#a4161a] hover:bg-[#a4161a]/90 text-white font-bold rounded-md font-mono text-[10px] uppercase tracking-wider shadow shrink-0"
                              >
                                {t("Fine", "Finish")}
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    )}

                    {/* Inline Controls to add custom images/videos to the Carousel */}
                    {isDanteCarouselEditorMode && isDanteAddingImage && (
                      <div className="mt-2 text-start">
                        <div className={`p-4 rounded-lg border space-y-3 ${
                          isDarkMode ? "bg-stone-900 border-stone-800 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-700"
                        }`}>
                          <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                            <span className="text-xs font-bold uppercase tracking-wider font-mono">
                              {t("Nuovo Elemento Multimediale", "Add Media Element")}
                            </span>
                            <button
                              onClick={() => {
                                setIsDanteAddingImage(false);
                                setNewDanteImageUrl("");
                                setNewDanteImageCaption("");
                                setNewDanteMediaType("image");
                              }}
                              className={`${isDarkMode ? "text-stone-400 hover:text-white" : "text-stone-500 hover:text-black"}`}
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Content Type Selector */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                              {t("Tipo di Contenuto:", "Content Type:")}
                            </label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setNewDanteMediaType("image")}
                                className={`flex-1 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                                  newDanteMediaType === "image"
                                    ? "bg-[#a4161a] border-[#a4161a] text-white shadow"
                                    : "bg-stone-200/50 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-400"
                                }`}
                              >
                                {t("Immagine", "Image")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewDanteMediaType("video")}
                                className={`flex-1 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                                  newDanteMediaType === "video"
                                    ? "bg-[#a4161a] border-[#a4161a] text-white shadow"
                                    : "bg-stone-200/50 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-400"
                                }`}
                              >
                                {t("Video", "Video")}
                              </button>
                            </div>
                          </div>

                          {/* File Drag and Drop / Choose File selector */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold">
                              {t("File / Drag & Drop o Sfoglia:", "File / Drag & Drop or Browse:")}
                            </label>
                            <input
                              type="file"
                              id="dante-carousel-file-input"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files[0]) {
                                  processFileUpload(files[0], setNewDanteImageUrl, setNewDanteMediaType);
                                }
                              }}
                            />
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDanteDragOver(true);
                              }}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDanteDragOver(true);
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDanteDragOver(false);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDanteDragOver(false);
                                const files = e.dataTransfer.files;
                                if (files && files[0]) {
                                  processFileUpload(files[0], setNewDanteImageUrl, setNewDanteMediaType);
                                }
                              }}
                              onClick={() => {
                                const fileInput = document.getElementById("dante-carousel-file-input");
                                if (fileInput) fileInput.click();
                              }}
                              className={`rounded-md p-4 text-center cursor-pointer transition-all md:min-h-0 select-none ${
                                isDanteDragOver 
                                  ? "border-2 border-dashed border-[#a4161a] bg-[#a4161a]/10 scale-[1.01]" 
                                  : newDanteImageUrl 
                                  ? "border border-solid border-black dark:border-stone-750 bg-white dark:bg-stone-950 text-black dark:text-stone-200 whitespace-normal" 
                                  : "border border-solid border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 hover:border-[#a4161a] dark:hover:border-[#a4161a]"
                              }`}
                            >
                              {newDanteImageUrl ? (
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <div className="relative w-16 h-12 rounded overflow-hidden shadow border border-stone-300 dark:border-stone-750 bg-black/5 flex items-center justify-center">
                                    {newDanteMediaType === "video" ? (
                                      isYouTubeUrl(newDanteImageUrl) ? (
                                        <iframe
                                          src={getYouTubeEmbedUrl(newDanteImageUrl) || ""}
                                          className="w-full h-full object-contain pointer-events-none"
                                          title="YouTube Preview"
                                        />
                                      ) : (
                                        <video 
                                          src={resolveUrl(newDanteImageUrl)} 
                                          className="w-full h-full object-contain" 
                                          muted 
                                          playsInline
                                          autoPlay
                                          loop
                                        />
                                      )
                                    ) : (
                                      <img 
                                        src={resolveUrl(newDanteImageUrl)} 
                                        alt="Preview" 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-contain" 
                                      />
                                    )}
                                  </div>
                                  <p className="text-xs font-bold text-[#a4161a] dark:text-[#f25c54] flex items-center gap-1 justify-center">
                                    ✓ {newDanteMediaType === "video" ? t("Video caricato con successo!", "Video loaded successfully!") : t("File caricato con successo!", "File loaded successfully!")}
                                  </p>
                                  <p className="text-[9px] text-stone-700 dark:text-stone-400">
                                    {t("Clicca o trascina ancora per cambiare file.", "Click or drag again to replace file.")}
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Upload size={16} className={`mx-auto mb-1.5 transition-colors ${isDanteDragOver ? "text-[#a4161a] scale-110" : "text-stone-400 group-hover/dropzone:text-[#a4161a]"}`} />
                                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                                    {t("Sfoglia o Trascina file d'immagine o video qui.", "Browse or Drag and drop image or video file here.")}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* URL input fallback */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold">
                              {t("Oppure inserisci URL Link:", "Or paste Link/URL:")}
                            </label>
                            <input
                              type="text"
                              value={newDanteImageUrl.startsWith("data:") || newDanteImageUrl.startsWith("indexeddb://") ? "" : newDanteImageUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewDanteImageUrl(val);
                                const valLower = val.toLowerCase();
                                if (valLower.endsWith(".mp4") || valLower.endsWith(".webm") || valLower.endsWith(".mov") || valLower.endsWith(".ogg") || valLower.includes("video") || isYouTubeUrl(val)) {
                                  setNewDanteMediaType("video");
                                }
                              }}
                              placeholder={newDanteMediaType === "video" ? "https://example.com/movie.mp4" : "https://example.com/illustration.jpg"}
                              className="w-full text-xs px-2.5 py-1.5 rounded-md border border-solid border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 focus:outline-none focus:ring-1 focus:ring-[#a4161a] text-stone-500 placeholder-stone-400 dark:text-stone-400 dark:placeholder-stone-500/80 transition-colors hover:border-[#a4161a] dark:hover:border-[#a4161a]"
                            />
                          </div>

                          {/* Caption text */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold">
                              {t("Didascalia / Titolo:", "Caption / Title:")}
                            </label>
                            <input
                              type="text"
                              value={newDanteImageCaption}
                              onChange={(e) => setNewDanteImageCaption(e.target.value)}
                              placeholder={newDanteMediaType === "video" ? t("Es. Ricostruzione 3D di Dante", "e.g., 3D reconstruction of Dante") : t("Es. Dante smarrito nella selva", "e.g., Dante lost in the dark forest")}
                              className="w-full text-xs px-2.5 py-1.5 rounded-md border border-solid border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 focus:outline-none focus:ring-1 focus:ring-[#a4161a] text-stone-500 placeholder-stone-400 dark:text-stone-400 dark:placeholder-stone-500/80 transition-colors hover:border-[#a4161a] dark:hover:border-[#a4161a]"
                            />
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => {
                                setIsDanteAddingImage(false);
                                setNewDanteImageUrl("");
                                setNewDanteImageCaption("");
                                setNewDanteMediaType("image");
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] border transition-colors ${
                                isDarkMode 
                                  ? "border-stone-700 text-stone-400 hover:bg-stone-800" 
                                  : "border-stone-300 text-stone-600 hover:bg-stone-200"
                              }`}
                            >
                              {t("Annulla", "Cancel")}
                            </button>
                            <button
                              onClick={() => {
                                if (!newDanteImageUrl) return;
                                const newImg = {
                                  id: "dante-custom-" + Date.now(),
                                  url: newDanteImageUrl,
                                  caption: newDanteImageCaption || (newDanteMediaType === "video" ? t("Video di Dante", "Dante Video") : t("Ritratto personalizzato", "Custom portrait")),
                                  mediaType: newDanteMediaType,
                                  scale: 1.0,
                                  x: 0,
                                  y: 0
                                };
                                const updated = [...danteCarouselImages, newImg];
                                setDanteCarouselImages(updated);
                                setDanteCarouselIndex(updated.length - 1); // automatically focus on newly added image
                                setIsDanteAddingImage(false);
                                setNewDanteImageUrl("");
                                setNewDanteImageCaption("");
                                setNewDanteMediaType("image");
                              }}
                              disabled={!newDanteImageUrl}
                              className="px-3 py-1 bg-[#a4161a] hover:bg-[#a4161a]/90 text-white font-bold rounded text-[10px] disabled:opacity-40"
                            >
                              {t("Includi", "Include")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-full h-full lg:min-h-0 min-h-[16rem] rounded flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br border transition-all duration-500 relative overflow-hidden ${
                      isDarkMode 
                        ? "border-stone-800" 
                        : "border-gray-300 shadow-md"
                    } ${(DISCIPLINE_HERO_QUOTES[selectedDisciplina] || DISCIPLINE_HERO_QUOTES["Italiano"]).imageColor}`}
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/30 rounded-full blur-2xl pointer-events-none" />
                    
                    <span className="text-6xl sm:text-7xl mb-4 filter drop-shadow hover:scale-110 transition-transform duration-300 animate-pulse">
                      {(DISCIPLINE_HERO_QUOTES[selectedDisciplina] || DISCIPLINE_HERO_QUOTES["Italiano"]).symbol}
                    </span>
                    
                    <h4 className="text-white text-lg font-serif font-black tracking-tight leading-tight uppercase font-bold sm:px-2 z-10">
                      {currentBio.name}
                    </h4>
                    <span className="text-stone-300 text-[10px] sm:text-xs font-mono tracking-widest uppercase mt-1.5 font-bold z-10">
                      {currentLang === "it"
                        ? (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.bioTitleIt || selectedDisciplina)
                        : (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.bioTitleEn || selectedDisciplina)}
                    </span>
                    
                    <p className="text-stone-400 text-[10px] font-serif leading-normal italic mt-4 max-w-[200px] z-10 line-clamp-2">
                      "{currentLang === "it" ? (DISCIPLINE_HERO_QUOTES[selectedDisciplina] || DISCIPLINE_HERO_QUOTES["Italiano"]).quoteIt : (DISCIPLINE_HERO_QUOTES[selectedDisciplina] || DISCIPLINE_HERO_QUOTES["Italiano"]).quoteEn}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bio details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <h2 className={`font-serif tracking-tight ${zoomStyles.titleSec}`}>
                {currentBio.name}
              </h2>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#a4161a] font-bold block">
                {selectedDisciplina === "Italiano" 
                  ? t("Il Padre della Lingua Italiana", "The Father of Italian Language") 
                  : (currentLang === "it" ? (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.bioTitleIt || "") : (DISCIPLINES_STUDY_DATA[selectedDisciplina]?.bioTitleEn || ""))}
              </span>
              <p className={`text-xs sm:text-sm font-semibold uppercase font-mono tracking-wider ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                {currentBio.birthDeath}
              </p>
            </div>

            <p className={`leading-relaxed font-light text-sm sm:text-base ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
              {getTxt("dante_summary", currentBio.summary, currentBio.summaryEn)}
            </p>

            {/* Key pedagogical conceptual points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {currentBio.keyConcepts.map((item, i) => (
                <div
                  key={i}
                  id={`dante-concept-box-${i}`}
                  onClick={() => setSelectedConceptIndex(i)}
                  className={`p-4 rounded border flex flex-col space-y-2 relative transition-all cursor-pointer select-none group ${
                    isDarkMode
                      ? "bg-stone-900/40 border-stone-850 hover:border-[#a4161a]/40 text-stone-300"
                      : "bg-neutral-50 border-gray-200 hover:border-gray-400 text-stone-800 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-[#e5383b] flex items-center justify-between">
                    <span>0{i + 1}. {getTxt(`concept_title_${i}` as any, item.title, item.titleEn)}</span>
                    <ChevronRight size={12} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <p className={`text-xs leading-normal ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                    {getTxt(`concept_desc_${i}` as any, item.desc, item.descEn)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIVINA COMMEDIA SECTION WITH CARD-STYLE NAVIGATION */}
      <section
        id="commedia-section"
        className={`relative overflow-hidden py-12 sm:py-20 border-y ${
          isDarkMode ? "bg-[#110e0f] border-[#2d0909]/20" : "bg-stone-100 border-gray-200"
        }`}
        style={commediaBgImgUrl ? { backgroundImage: `url(${commediaBgImgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {commediaBgImgUrl && (
          <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${isDarkMode ? "bg-black/85" : "bg-white/85"}`} />
        )}
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className={`font-serif tracking-tight ${zoomStyles.titleSec}`}>
              {t(currentCommedia.title, currentCommedia.titleEn)}
            </h2>
            <p className={`text-xs sm:text-sm font-light whitespace-pre-line ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
              {getTxt("commedia_desc", currentCommedia.desc, currentCommedia.descEn)}
            </p>
          </div>

          {/* Cards for navigation and overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentCommedia.structure.map((part, i) => {
              const isInferno = part.part.includes("Inferno") || selectedDisciplina !== "Italiano" || i === 0;
              return (
                <div
                  key={i}
                  className={`rounded-lg border overflow-hidden flex flex-col h-full relative group transition-all duration-300 ${
                    isInferno
                      ? isDarkMode
                        ? "bg-stone-950 border-stone-800 ring-1 ring-[#a4161a]/30"
                        : "bg-white border-gray-300 shadow-sm ring-1 ring-[#a4161a]/30"
                      : isDarkMode
                        ? "bg-stone-900 border-stone-850 opacity-65"
                        : "bg-stone-100 border-stone-400 opacity-70 shadow-none"
                  }`}
                >
                  <div className={`h-2 bg-gradient-to-r ${isInferno ? part.color : "from-stone-500 to-stone-400"}`} />
                  <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono font-bold ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                          {part.cantos}
                        </span>
                        {isInferno && (
                          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-[#a4161a] text-white border border-[#a4161a] font-semibold">
                            {t("Studiamo questo", "We study this")}
                          </span>
                        )}
                      </div>
                      <h3 className={`text-xl font-serif font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                        {t(part.part, part.partEn)}
                      </h3>
                      <div className={`text-xs space-y-1 ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                        <p>
                          <strong>{t("Guida:", "Guide:")}</strong> {t(part.guide, part.guideEn)}
                        </p>
                        <p className="font-light">
                          {getTxt(
                            i === 0 ? "theme_inferno" : i === 1 ? "theme_purgatorio" : "theme_paradiso",
                            part.theme,
                            part.themeEn
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isInferno) {
                          // If non-Italiano, set active index to lesson i to explore that lesson!
                          if (selectedDisciplina !== "Italiano") {
                            setSelectedCantoIndex(Math.min(i, currentCanti.length - 1));
                          }
                          scrollToSection("canti-explorer-section");
                        }
                      }}
                      className={`w-full py-2.5 rounded text-xs tracking-wider uppercase font-bold border transition-all cursor-pointer ${
                        isInferno
                          ? isDarkMode
                            ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-[#a4161a] hover:border-[#a4161a] hover:text-white"
                            : "bg-stone-200 border-gray-300 text-stone-700 hover:bg-[#a4161a] hover:border-[#a4161a] hover:text-white"
                          : "bg-transparent text-stone-500 border-none select-none cursor-not-allowed text-stone-300"
                      }`}
                    >
                      {isInferno 
                        ? (selectedDisciplina === "Italiano" ? t("Apri i Canti I - V", "Open Cantos I - V") : t("Apri Elemento", "Open Lesson")) 
                        : t("Bloccato", "Locked")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. VIAGGIO NELL'INFERNO DANTESCO WITH ATMOSPHERIC IMAGERY */}
      <section id="journey-intro" className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Grid: Height is strictly determined by Carousel Box, ensuring Didattica is aligned perfectly at bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          <div className="space-y-6 flex flex-col justify-between h-full w-full">
            <div className="space-y-6">
              <h2 className={`font-serif tracking-tight ${zoomStyles.titleSec}`}>
                {t("Viaggio nell'Inferno di Dante", "Journey into Dante's Inferno")}
              </h2>
              <p className={`font-light leading-relaxed text-sm sm:text-base ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                {getTxt(
                  "journey_desc",
                  "L'Inferno è una voragine a forma di imbuto spalancata sotto la città di Gerusalemme. È diviso in nove cerchi in cui le anime soffrono pene adeguate ai peccati commessi (legge del contrappasso). Insieme a Virgilio, Dante ne scende i gradini fino al centro esatto della Terra.",
                  "Inferno is a funnel-shaped abyss opening below the city of Jerusalem. It is divided into nine circles where souls suffer punishments tailored to their committed sins (law of retaliation). Together with Virgil, Dante descends its steps to the exact center of Earth."
                )}
              </p>
            </div>
            <div
              className={`p-6 rounded-lg border flex flex-col gap-3 items-start justify-between w-full self-stretch ${
                isDarkMode ? "bg-stone-950/60 border-stone-800" : "bg-transparent border-gray-300 shadow-sm"
              }`}
            >
              <div className="space-y-3">
                <h2 className={`text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${isDarkMode ? "text-stone-400" : "text-stone-700"}`}>
                  <Info size={12} className="shrink-0" />
                  {t("Didattica facilitata:", "Facilitated didactics:")}
                </h2>
                <p className={`text-xs sm:text-sm ${isDarkMode ? "text-stone-400" : "text-stone-700"}`}>
                  {getTxt(
                    "didattica_alert",
                    "questa piattaforma ti permette di navigare agilmente tra i canti. Usa la barra superiore per attivare la parafrasi o semplificare il testo in simboli per facilitare lo studio.",
                    "this platform allows you to navigate effortlessly through cantos. Use the bar on top to enable paraphrasing or simplify text to symbols for assisted study."
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="h-full flex flex-col justify-start w-full">
            {imageStyle === "hidden" ? (
              <div className={`w-full h-full min-h-[350px] rounded-lg border border-dashed flex flex-col items-center justify-center p-6 text-center ${
                isDarkMode ? "bg-stone-900/10 border-stone-800 text-stone-500" : "bg-stone-50 border-gray-300 text-gray-400"
              }`}>
                <Compass size={30} className="mb-2 text-[#a4161a]/60 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold">{t("Illustrazione Nascosta", "Illustration Hidden")}</span>
                <p className="text-[10px] mt-1 leading-normal italic">
                  {t("Le illustrazioni sono state disattivate dal profilo alunno.", "Illustrations have been disabled by student profile.")}
                </p>
              </div>
            ) : (
              <div className="relative group w-full flex flex-col h-full justify-between">
                {/* Image Display Wrapper ONLY (Aspect preserved) */}
                <div 
                  id="journey-carousel-box"
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    setIsCarouselEditorMode(!isCarouselEditorMode);
                  }}
                  className={`relative overflow-hidden rounded-lg shadow-md aspect-[16/10] w-full bg-stone-900 flex items-center justify-center group/carousel select-none border transition-all duration-250 h-full ${
                    isCarouselEditorMode 
                      ? "border-dashed border-[#a4161a] ring-2 ring-[#a4161a]/30" 
                      : "border-stone-300 dark:border-stone-800"
                  }`}
                  title={t("Doppio clic per entrare/uscire dalla modalità editor", "Double click to edit")}
                >
                  {carouselImages.length > 0 ? (
                    (() => {
                      const curImg = carouselImages[carouselIndex % carouselImages.length];
                      const scale = curImg?.scale || 1.0;
                      const x = curImg?.x || 0;
                      const y = curImg?.y || 0;
                      const isCustomOrUploaded = (curImg?.id && !["default-journey", "default-hero"].includes(curImg.id)) || (curImg?.id === "default-journey" && imageStyle === "custom" && customJourneyImgUrl);
                      const isVideo = isVideoContent(curImg);
                      
                      return (
                        <>
                          {isVideo ? (
                            isYouTubeUrl(curImg?.url) ? (
                              <iframe
                                src={getYouTubeEmbedUrl(curImg?.url) || ""}
                                className={`w-full h-full select-none transition-all duration-75 object-contain bg-black ${
                                  isCarouselEditorMode ? "pointer-events-none" : ""
                                }`}
                                style={{
                                  transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                  transformOrigin: "center center",
                                }}
                                title={curImg?.caption || "YouTube Video"}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                src={resolveUrl(curImg?.id === "default-journey" && imageStyle === "custom" && customJourneyImgUrl ? customJourneyImgUrl : curImg?.url)}
                                controls={!isCarouselEditorMode}
                                autoPlay
                                muted
                                loop
                                playsInline
                                onMouseDown={(e) => {
                                  if (!isCarouselEditorMode) return;
                                  e.preventDefault();
                                  setIsDraggingImage(true);
                                  setDragStartPos({ x: e.clientX, y: e.clientY });
                                  setImageStartOffsets({ x: curImg.x || 0, y: curImg.y || 0 });
                                }}
                                className={`w-full h-full select-none transition-all duration-75 ${
                                  isCustomOrUploaded ? "object-contain bg-transparent" : "object-cover"
                                } ${
                                  isCarouselEditorMode ? "cursor-grab active:cursor-grabbing hover:brightness-110" : ""
                                } ${
                                  isCustomOrUploaded
                                    ? ""
                                    : imageStyle === "highcontrast"
                                    ? "filter grayscale contrast-200 brightness-110"
                                    : imageStyle === "minimal"
                                    ? "filter grayscale contrast-125 saturate-0 opacity-80"
                                    : "brightness-90 saturate-75"
                                }`}
                                style={{
                                  transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                  transformOrigin: "center center",
                                  clipPath: curImg?.crop 
                                    ? `inset(${curImg.crop.top}% ${curImg.crop.right}% ${curImg.crop.bottom}% ${curImg.crop.left}%)` 
                                    : "none"
                                }}
                              />
                            )
                          ) : (
                            <img
                              src={resolveUrl(curImg?.id === "default-journey" && imageStyle === "custom" && customJourneyImgUrl ? customJourneyImgUrl : curImg?.url)}
                              alt={curImg?.caption || t("Illustrazione", "Illustration")}
                              referrerPolicy="no-referrer"
                              onMouseDown={(e) => {
                                if (!isCarouselEditorMode) return;
                                e.preventDefault();
                                setIsDraggingImage(true);
                                setDragStartPos({ x: e.clientX, y: e.clientY });
                                setImageStartOffsets({ x: curImg.x || 0, y: curImg.y || 0 });
                              }}
                              className={`w-full h-full select-none transition-all duration-75 ${
                                isCustomOrUploaded ? "object-contain bg-transparent" : "object-cover"
                              } ${
                                isCarouselEditorMode ? "cursor-grab active:cursor-grabbing hover:brightness-110" : ""
                              } ${
                                isCustomOrUploaded
                                  ? ""
                                  : imageStyle === "highcontrast"
                                  ? "filter grayscale contrast-200 brightness-110"
                                  : imageStyle === "minimal"
                                  ? "filter grayscale contrast-125 saturate-0 opacity-80"
                                  : "brightness-90 saturate-75"
                              }`}
                              style={{
                                transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                transformOrigin: "center center",
                                clipPath: curImg?.crop 
                                  ? `inset(${curImg.crop.top}% ${curImg.crop.right}% ${curImg.crop.bottom}% ${curImg.crop.left}%)` 
                                  : "none"
                              }}
                            />
                          )}
                          
                          {/* Navigation Controls */}
                          {carouselImages.length > 1 && !isCarouselEditorMode && (
                            <>
                              {(carouselIndex % carouselImages.length) !== 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
                                  }}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 md:opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 shadow-md"
                                  title={t("Precedente", "Previous")}
                                >
                                  <ChevronLeft size={18} />
                                </button>
                              )}
                              {(carouselIndex % carouselImages.length) !== carouselImages.length - 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
                                  }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 md:opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 shadow-md"
                                  title={t("Successivo", "Next")}
                                >
                                  <ChevronRight size={18} />
                                </button>
                              )}
                            </>
                          )}

                          {/* Interactive Draggable Resize Handles */}
                          {isCarouselEditorMode && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 z-20">
                              <div className="absolute inset-0 border-2 border-dashed border-[#a4161a]/60">
                                <div className="absolute inset-x-0 top-1/3 border-b border-[#a4161a]/40"></div>
                                <div className="absolute inset-x-0 top-2/3 border-b border-[#a4161a]/40"></div>
                                <div className="absolute inset-y-0 left-1/3 border-r border-[#a4161a]/40"></div>
                                <div className="absolute inset-y-0 left-2/3 border-r border-[#a4161a]/40"></div>
                              </div>
                              
                              <div 
                                className="absolute top-2 left-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
                              />
                              <div 
                                className="absolute top-2 right-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
                              />
                              <div 
                                className="absolute bottom-2 left-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
                              />
                              <div 
                                className="absolute bottom-2 right-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
                              />

                              <div 
                                className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-[#a4161a] pointer-events-auto cursor-ns-resize shadow hover:scale-110 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "top")}
                              />
                              <div 
                                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-[#a4161a] pointer-events-auto cursor-ns-resize shadow hover:scale-110 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
                              />
                              <div 
                                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 rounded-full bg-[#a4161a] pointer-events-auto cursor-ew-resize shadow hover:scale-110 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "left")}
                              />
                              <div 
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 rounded-full bg-[#a4161a] pointer-events-auto cursor-ew-resize shadow hover:scale-110 transition-transform"
                                onMouseDown={(e) => handleResizeMouseDown(e, "right")}
                              />
                            </div>
                          )}

                          {/* Centering axes guidelines in editor mode */}
                          {isCarouselEditorMode && (
                            <div className="absolute inset-0 pointer-events-none z-10 select-none">
                              {/* Horizontal middle guide line (only visible when aligned with y-center) */}
                              {Math.abs(y) < 3.5 && (
                                <div 
                                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t opacity-100 transition-opacity duration-150"
                                  style={{ borderColor: "crimson", borderTopWidth: "1px" }}
                                />
                              )}
                              {/* Vertical middle guide line (only visible when aligned with x-center, i.e., vertical axis alignment) */}
                              {Math.abs(x) < 3.5 && (
                                <div 
                                  className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l opacity-100 transition-opacity duration-150"
                                  style={{ borderColor: "crimson", borderLeftWidth: "1px" }}
                                />
                              )}
                              {/* Position indicator */}
                              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 text-[8.5px] font-mono text-stone-300 flex items-center gap-1.5 uppercase tracking-wider z-20">
                                <span>X: {x.toFixed(0)}px</span>
                                <span>Y: {y.toFixed(0)}px</span>
                                {(Math.abs(x) < 3.5) && (
                                  <span className="text-[#a4161a] font-bold font-sans" style={{ color: "crimson" }}>X: ✓</span>
                                )}
                                {(Math.abs(y) < 3.5) && (
                                  <span className="text-[#a4161a] font-bold font-sans" style={{ color: "crimson" }}>Y: ✓</span>
                                )}
                                {(Math.abs(x) < 3.5 && Math.abs(y) < 3.5) && (
                                  <span className="text-[#a4161a] font-bold font-sans" style={{ color: "crimson" }}>[ {t("CENTRATO", "CENTERED")} ]</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Quick deletion for custom user images - visible only in editor mode */}
                          {isCarouselEditorMode && curImg?.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newImages = carouselImages.filter((img) => img.id !== curImg.id);
                                setCarouselImages(newImages);
                                setCarouselIndex(0);
                              }}
                              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-stone-200 hover:text-red-500 hover:bg-black/80 transition-all duration-200 shadow z-30"
                              title={t("Elimina questa immagine", "Delete this image")}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}

                          {/* Fullscreen Button - visible only in visualizzazione mode */}
                          {carouselImages.length > 0 && !isCarouselEditorMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFullscreenCarouselOpen(true);
                              }}
                              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-md z-30 pointer-events-auto select-none"
                              title={t("Schermo intero", "Fullscreen")}
                            >
                              <Maximize2 size={16} />
                            </button>
                          )}

                          {/* Rewind/Restart Carousel Button on Last Image - Styled matching prev/next indicators */}
                          {carouselImages.length > 1 && (carouselIndex % carouselImages.length) === (carouselImages.length - 1) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCarouselIndex(0);
                              }}
                              className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-md z-30 pointer-events-auto select-none"
                              title={t("Torna alla prima slide", "Back to first slide")}
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}

                          {/* Info Overlay (NO "illustrazione 1/3", and NO "Originale" / "Personalizzata") */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-4 text-white pointer-events-none">
                            <div className="flex items-center justify-end text-[11px] font-mono opacity-80 mb-1">
                              {!isCarouselEditorMode && (
                                <span className="text-[9px] uppercase tracking-wider opacity-60 font-mono hidden group-hover/carousel:inline">
                                  {t("Doppio clic per modificare", "Double-click to edit")}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-white leading-relaxed line-clamp-2">
                              {curImg?.caption || ""}
                            </p>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-stone-400 text-xs text-center p-4">
                      {t("Nessuna immagine nel carosello.", "No images in the carousel.")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action and controls align in a second grid rows underneath. This prevents "Didattica facilitata" box from shifting vertically! */}
        {imageStyle !== "hidden" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 items-start">
            {/* Empty Left Grid Cell to ensure right controls are perfectly matched */}
            <div className="hidden md:block"></div>
            
            {/* Right-aligned column for helpers/control fields */}
            <div className="w-full flex flex-col space-y-4">
              {/* Dots indicator */}
              {carouselImages.length > 1 && !isCarouselEditorMode && (
                <div className="flex justify-center gap-1.5">
                  {carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        carouselIndex === idx ? "w-4 bg-[#a4161a]" : "w-1.5 bg-stone-300 hover:bg-stone-400"
                      }`}
                      title={`${t("Vai all'immagine", "Go to image")} ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Crop & Zoom Editor Mode Box (Matches "Nuova immagine" exact styling appearance) */}
              {isCarouselEditorMode && (
                (() => {
                  const curImg = carouselImages[carouselIndex % carouselImages.length];
                  const scale = curImg?.scale || 1.0;
                  return (
                    <div 
                      id="carousel-editor-controls-box"
                      className={`p-4 rounded-lg border space-y-3 font-mono transition-colors ${
                        isDarkMode 
                          ? "bg-stone-900 border-stone-800 text-stone-300" 
                          : "bg-stone-100 border-stone-200 text-stone-700"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-[#a4161a] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Crop size={12} /> {t("Editor Ritaglio & Zoom", "Crop & Zoom Editor")}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCarouselImages(prev => {
                                const updated = [...prev];
                                const idx = carouselIndex % updated.length;
                                if (updated[idx]) {
                                  updated[idx] = { ...updated[idx], scale: Math.max(0.5, scale - 0.2) };
                                }
                                return updated;
                              });
                            }}
                            className={`w-5 h-5 flex items-center justify-center rounded border font-bold text-xs bg-transparent transition-colors ${
                              isDarkMode
                                ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                : "border-black text-black hover:bg-black/5"
                            }`}
                            title={t("Riduci", "Zoom Out")}
                          >
                            -
                          </button>
                          <span className="min-w-[40px] text-center font-bold text-xs">{scale.toFixed(1)}x</span>
                          <button
                            onClick={() => {
                              setCarouselImages(prev => {
                                const updated = [...prev];
                                const idx = carouselIndex % updated.length;
                                if (updated[idx]) {
                                  updated[idx] = { ...updated[idx], scale: Math.min(6.0, scale + 0.2) };
                                }
                                return updated;
                              });
                            }}
                            className={`w-5 h-5 flex items-center justify-center rounded border font-bold text-xs bg-transparent transition-colors ${
                              isDarkMode
                                ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                : "border-black text-black hover:bg-black/5"
                            }`}
                            title={t("Ingrandisci", "Zoom In")}
                          >
                            +
                          </button>

                          <button
                            onClick={() => {
                              setCarouselImages(prev => {
                                const updated = [...prev];
                                const idx = carouselIndex % updated.length;
                                if (updated[idx]) {
                                  updated[idx] = { 
                                    ...updated[idx], 
                                    scale: 1.0, 
                                    x: 0, 
                                    y: 0, 
                                    crop: { top: 0, right: 0, bottom: 0, left: 0 } 
                                  };
                                }
                                return updated;
                              });
                            }}
                            className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold bg-transparent transition-colors ${
                              isDarkMode
                                ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                : "border-black text-black hover:bg-black/5"
                            }`}
                          >
                            {t("Azzera", "Reset")}
                          </button>
                        </div>
                      </div>

                      {/* Info Note: Not italic, exactly 10pt (13.33px) */}
                      <div className="text-[13.33px] text-stone-500 dark:text-stone-400 leading-normal font-sans">
                        {t("* Trascina l'immagine per spostarla. Trascina i quadratini bianchi ai vertici per lo zoom ed i trattini rossi sui lati per fare liberamente crop.", "* Drag the image to pan. Drag the white corner squares for zoom, and the red side handles to freely crop the image.")}
                      </div>

                      {/* Current Caption Editor field */}
                      {curImg && (
                        <div className="space-y-1.5 pt-3 border-t border-stone-200 dark:border-stone-850">
                          <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                            {t("Modifica Didascalia Corrente:", "Edit Current Caption:")}
                          </label>
                          <input
                            type="text"
                            value={curImg.caption || ""}
                            onChange={(e) => {
                              const newCaption = e.target.value;
                              setCarouselImages((prev) => {
                                const updated = [...prev];
                                const idx = carouselIndex % updated.length;
                                if (updated[idx]) {
                                  updated[idx] = { ...updated[idx], caption: newCaption };
                                }
                                return updated;
                              });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 rounded-md border border-solid border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-[#a4161a] text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-500 transition-colors hover:border-[#a4161a] dark:hover:border-[#a4161a] font-sans"
                            placeholder={t("Inserisci didascalia...", "Enter caption...")}
                          />
                        </div>
                      )}

                      {/* Image Ordering and Selection Organizer */}
                      {carouselImages.length > 1 && (
                        <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-stone-850">
                          <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                            {t("Ordina le immagini (Seleziona, sposta o trascina):", "Order Images (Select, move or drag to reorder):")}
                          </label>
                          <div className="flex flex-wrap gap-2 py-1 items-center bg-black/5 dark:bg-black/20 p-2 rounded-md">
                            {carouselImages.map((img, idx) => {
                              const isCurrent = (carouselIndex % carouselImages.length) === idx;
                              return (
                                <div 
                                  key={img.id || idx}
                                  draggable={true}
                                  onDragStart={(e) => {
                                    setDraggedThumbIndex(idx);
                                    e.dataTransfer.effectAllowed = "move";
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                  }}
                                  onDragEnter={() => setDragOverThumbIndex(idx)}
                                  onDragEnd={() => {
                                    setDraggedThumbIndex(null);
                                    setDragOverThumbIndex(null);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedThumbIndex !== null && draggedThumbIndex !== idx) {
                                      setCarouselImages((prev) => {
                                        const next = [...prev];
                                        const [moved] = next.splice(draggedThumbIndex, 1);
                                        next.splice(idx, 0, moved);
                                        return next;
                                      });
                                      setCarouselIndex(idx);
                                    }
                                    setDraggedThumbIndex(null);
                                    setDragOverThumbIndex(null);
                                  }}
                                  className={`relative group/thumb border rounded p-1 flex flex-col items-center gap-1 transition-all select-none cursor-grab active:cursor-grabbing ${
                                    draggedThumbIndex === idx
                                      ? "opacity-40 border-dashed border-[#a4161a] bg-[#a4161a]/5 scale-95"
                                      : dragOverThumbIndex === idx
                                      ? "border-dashed border-[#a4161a] bg-[#a4161a]/25 scale-105"
                                      : isCurrent 
                                      ? "border-[#a4161a] bg-[#a4161a]/10 scale-105" 
                                      : "border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 hover:bg-stone-50 dark:hover:bg-stone-900"
                                  }`}
                                  title={t("Trascina per riordinare", "Drag to reorder")}
                                >
                                  {/* Red insertion segment indicator */}
                                  {draggedThumbIndex !== null && dragOverThumbIndex === idx && draggedThumbIndex !== idx && (
                                    <div 
                                      className={`absolute top-0 bottom-0 w-1 bg-[#a4161a] rounded shadow-[0_0_8px_rgba(164,22,26,0.8)] pointer-events-none z-20 ${
                                        idx < draggedThumbIndex ? "-left-1.5" : "-right-1.5"
                                      }`}
                                    >
                                      {/* Accent dots on top & bottom to highlight the vertical line insertion precision */}
                                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#a4161a] rounded-full shadow-[0_0_6px_rgba(164,22,26,0.8)] border border-white dark:border-stone-950" />
                                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#a4161a] rounded-full shadow-[0_0_6px_rgba(164,22,26,0.8)] border border-white dark:border-stone-950" />
                                    </div>
                                  )}

                                  {/* Thumbnail */}
                                  <div 
                                    className="w-12 h-10 rounded overflow-hidden cursor-pointer relative bg-black/10 flex items-center justify-center shrink-0"
                                    onClick={() => setCarouselIndex(idx)}
                                    title={t("Seleziona questa immagine", "Select this image")}
                                  >
                                    {img.mediaType === "video" ? (
                                      <div className="w-full h-full bg-stone-800 flex items-center justify-center text-[8px] text-white font-mono uppercase font-bold">Vid</div>
                                    ) : (
                                      <img src={img.url} className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                                    )}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                      <span className="text-[9px] text-white font-bold">#{idx + 1}</span>
                                    </div>
                                  </div>

                                  {/* Left/Right Ordering Buttons and Grip Handle */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-stone-400 dark:text-stone-600 cursor-grab active:cursor-grabbing hover:text-[#a4161a]" title={t("Trascina per riordinare", "Drag to reorder")}>
                                      <GripVertical size={11} />
                                    </div>
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCarouselImages((prev) => {
                                          const next = [...prev];
                                          const temp = next[idx];
                                          next[idx] = next[idx - 1];
                                          next[idx - 1] = temp;
                                          return next;
                                        });
                                        if (isCurrent) {
                                          setCarouselIndex(idx - 1);
                                        } else if ((carouselIndex % carouselImages.length) === idx - 1) {
                                          setCarouselIndex(idx);
                                        }
                                      }}
                                      className={`p-0.5 rounded border flex items-center justify-center transition-colors ${
                                        idx === 0 
                                          ? "opacity-30 cursor-not-allowed" 
                                          : "hover:bg-[#a4161a] hover:text-white dark:hover:bg-[#a4161a] border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                                      }`}
                                      title={t("Sposta a sinistra", "Move/Order Left")}
                                    >
                                      <ChevronLeft size={10} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === carouselImages.length - 1}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCarouselImages((prev) => {
                                          const next = [...prev];
                                          const temp = next[idx];
                                          next[idx] = next[idx + 1];
                                          next[idx + 1] = temp;
                                          return next;
                                        });
                                        if (isCurrent) {
                                          setCarouselIndex(idx + 1);
                                        } else if ((carouselIndex % carouselImages.length) === idx + 1) {
                                          setCarouselIndex(idx);
                                        }
                                      }}
                                      className={`p-0.5 rounded border flex items-center justify-center transition-colors ${
                                        idx === carouselImages.length - 1 
                                          ? "opacity-30 cursor-not-allowed" 
                                          : "hover:bg-[#a4161a] hover:text-white dark:hover:bg-[#a4161a] border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                                      }`}
                                      title={t("Sposta a destra", "Move/Order Right")}
                                    >
                                      <ChevronRight size={10} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-200 dark:border-stone-850">
                        {/* Left action tools: Nuova Immagine button */}
                        <div className="flex items-center gap-3">
                          <button
                            id="carousel-nuova-immagine-btn"
                            onClick={() => setIsAddingImage(!isAddingImage)}
                            className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shadow transition-all duration-200 flex items-center gap-1 shrink-0 ${
                              isAddingImage
                                ? "bg-[#a4161a] text-white hover:bg-[#a4161a]/90"
                                : isDarkMode
                                ? "bg-stone-800 hover:bg-stone-750 text-stone-200"
                                : "bg-stone-200 hover:bg-stone-300 text-stone-800"
                            }`}
                            title={t("Aggiungi nuova immagine", "Add new image")}
                          >
                            <Plus size={10} />
                            {t("Nuova Immagine", "Add Image")}
                          </button>
                        </div>

                        {/* Right action tools: Fine button */}
                        <button
                          onClick={() => setIsCarouselEditorMode(false)}
                          className="px-3 py-1 bg-[#a4161a] hover:bg-[#a4161a]/90 text-white font-bold rounded-md font-mono text-[10px] uppercase tracking-wider shadow shrink-0"
                        >
                          {t("Fine", "Finish")}
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Inline Controls to add custom images/videos to the Carousel */}
              {isCarouselEditorMode && isAddingImage && (
                <div className="mt-2 text-start">
                  <div className={`p-4 rounded-lg border space-y-3 ${
                    isDarkMode ? "bg-stone-900 border-stone-800 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-700"
                  }`}>
                      <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">
                          {t("Nuovo Elemento Multimediale", "Add Media Element")}
                        </span>
                        <button
                          onClick={() => {
                            setIsAddingImage(false);
                            setNewImageUrl("");
                            setNewImageCaption("");
                            setNewMediaType("image");
                          }}
                          className={`${isDarkMode ? "text-stone-400 hover:text-white" : "text-stone-500 hover:text-black"}`}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Content Type Selector */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                          {t("Tipo di Contenuto:", "Content Type:")}
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setNewMediaType("image")}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                              newMediaType === "image"
                                ? "bg-[#a4161a] border-[#a4161a] text-white shadow"
                                : "bg-stone-200/50 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-400"
                            }`}
                          >
                            {t("Immagine", "Image")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewMediaType("video")}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                              newMediaType === "video"
                                ? "bg-[#a4161a] border-[#a4161a] text-white shadow"
                                : "bg-stone-200/50 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-400"
                            }`}
                          >
                            {t("Video", "Video")}
                          </button>
                        </div>
                      </div>

                      {/* File Drag and Drop / Choose File selector */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold">
                          {t("File / Drag & Drop o Sfoglia:", "File / Drag & Drop or Browse:")}
                        </label>
                        <input
                          type="file"
                          id="carousel-file-input"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files[0]) {
                              processFileUpload(files[0], setNewImageUrl, setNewMediaType);
                            }
                          }}
                        />
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragOver(true);
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragOver(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragOver(false);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragOver(false);
                            const files = e.dataTransfer.files;
                            if (files && files[0]) {
                              processFileUpload(files[0], setNewImageUrl, setNewMediaType);
                            }
                          }}
                          onClick={() => {
                            const fileInput = document.getElementById("carousel-file-input");
                            if (fileInput) fileInput.click();
                          }}
                          className={`rounded-md p-4 text-center cursor-pointer transition-all md:min-h-0 select-none ${
                            isDragOver 
                              ? "border-2 border-dashed border-[#a4161a] bg-[#a4161a]/10 scale-[1.01]" 
                              : newImageUrl 
                              ? "border border-solid border-black dark:border-stone-750 bg-white dark:bg-stone-950 text-black dark:text-stone-200 whitespace-normal" 
                              : "border border-solid border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 hover:border-[#a4161a] dark:hover:border-[#a4161a]"
                          }`}
                        >
                          {newImageUrl ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="relative w-16 h-12 rounded overflow-hidden shadow border border-stone-300 dark:border-stone-750 bg-black/5 flex items-center justify-center">
                                {newMediaType === "video" ? (
                                  isYouTubeUrl(newImageUrl) ? (
                                    <iframe
                                      src={getYouTubeEmbedUrl(newImageUrl) || ""}
                                      className="w-full h-full object-contain pointer-events-none"
                                      title="YouTube Preview"
                                    />
                                  ) : (
                                    <video 
                                      src={resolveUrl(newImageUrl)} 
                                      className="w-full h-full object-contain" 
                                      muted 
                                      playsInline
                                      autoPlay
                                      loop
                                    />
                                  )
                                ) : (
                                  <img 
                                    src={resolveUrl(newImageUrl)} 
                                    alt="Preview" 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain" 
                                  />
                                )}
                              </div>
                              <p className="text-xs font-bold text-[#a4161a] dark:text-[#f25c54] flex items-center gap-1 justify-center">
                                ✓ {newMediaType === "video" ? t("Video caricato con successo!", "Video loaded successfully!") : t("File caricato con successo!", "File loaded successfully!")}
                              </p>
                              <p className="text-[9px] text-stone-700 dark:text-stone-400">
                                {t("Clicca o trascina ancora per cambiare file.", "Click or drag again to replace file.")}
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload size={16} className={`mx-auto mb-1.5 transition-colors ${isDragOver ? "text-[#a4161a] scale-110" : "text-stone-400 group-hover/dropzone:text-[#a4161a]"}`} />
                              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                                {t("Sfoglia o Trascina file d'immagine o video qui.", "Browse or Drag and drop image or video file here.")}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* URL input fallback */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold">
                          {t("Oppure inserisci URL Link:", "Or paste Link/URL:")}
                        </label>
                        <input
                          type="text"
                          value={newImageUrl.startsWith("data:") ? "" : newImageUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewImageUrl(val);
                            const valLower = val.toLowerCase();
                            if (valLower.endsWith(".mp4") || valLower.endsWith(".webm") || valLower.endsWith(".mov") || valLower.endsWith(".ogg") || valLower.includes("video") || isYouTubeUrl(val)) {
                              setNewMediaType("video");
                            }
                          }}
                          placeholder={newMediaType === "video" ? "https://example.com/movie.mp4" : "https://example.com/illustration.jpg"}
                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-solid border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 focus:outline-none focus:ring-1 focus:ring-[#a4161a] text-stone-500 placeholder-stone-400 dark:text-stone-400 dark:placeholder-stone-500/80 transition-colors hover:border-[#a4161a] dark:hover:border-[#a4161a]"
                        />
                      </div>

                      {/* Caption text */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold">
                          {t("Didascalia / Titolo:", "Caption / Title:")}
                        </label>
                        <input
                          type="text"
                          value={newImageCaption}
                          onChange={(e) => setNewImageCaption(e.target.value)}
                          placeholder={newMediaType === "video" ? t("Es. Ricostruzione 3D dell'Inferno", "e.g., 3D reconstruction of Hell") : t("Es. Dante smarrito nella selva", "e.g., Dante lost in the dark forest")}
                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-solid border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 focus:outline-none focus:ring-1 focus:ring-[#a4161a] text-stone-500 placeholder-stone-400 dark:text-stone-400 dark:placeholder-stone-500/80 transition-colors hover:border-[#a4161a] dark:hover:border-[#a4161a]"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => {
                            setIsAddingImage(false);
                            setNewImageUrl("");
                            setNewImageCaption("");
                            setNewMediaType("image");
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] border transition-colors ${
                            isDarkMode 
                              ? "border-stone-700 text-stone-400 hover:bg-stone-800" 
                              : "border-stone-300 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {t("Annulla", "Cancel")}
                        </button>
                        <button
                          onClick={() => {
                            if (!newImageUrl) return;
                            const newImg = {
                              id: "custom-" + Date.now(),
                              url: newImageUrl,
                              caption: newImageCaption || (newMediaType === "video" ? t("Video dell'Inferno", "Inferno Video") : t("Illustrazione dell'Inferno", "Inferno illustration")),
                              mediaType: newMediaType,
                              scale: 1.0,
                              x: 0,
                              y: 0
                            };
                            const updated = [...carouselImages, newImg];
                            setCarouselImages(updated);
                            setCarouselIndex(updated.length - 1); // automatically focus on newly added image
                            setIsAddingImage(false);
                            setNewImageUrl("");
                            setNewImageCaption("");
                            setNewMediaType("image");
                          }}
                          disabled={!newImageUrl}
                          className="px-3 py-1 bg-[#a4161a] hover:bg-[#a4161a]/90 text-white font-bold rounded text-[10px] disabled:opacity-40"
                        >
                          {t("Includi", "Include")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </section>

      {/* 7. THE SECTIONS FOR EACH CANTO (I - V) WITH ADAPTIVE VERSES */}
      <section
        id="canti-explorer-section"
        className={`py-12 sm:py-24 border-t ${
          isDarkMode ? "bg-stone-950/40 border-stone-900" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          {/* Main Selector Canto Row */}
          <div className="border-b transition-colors border-[#a4161a]/20 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 block">
                  {selectedDisciplina === "Italiano" 
                    ? t("Seleziona il canto da studiare", "Select the canto to study") 
                    : t("Seleziona la lezione da studiare", "Select the lesson to study")}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentCanti.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCantoIndex(idx);
                    }}
                    className={`w-11 h-11 rounded text-xs font-mono font-bold uppercase transition-all flex flex-col items-center justify-center border ${
                      selectedCantoIndex === idx
                        ? "bg-[#a4161a] text-white border-[#a4161a] shadow-sm"
                        : isDarkMode
                        ? "bg-stone-850 hover:bg-stone-800 text-stone-400 border-stone-800"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-250"
                    }`}
                    title={`${selectedDisciplina === "Italiano" ? "Canto" : t("Lezione", "Lesson")} ${c.romanNumeral || (idx + 1)}`}
                  >
                    <span className="text-[9px] opacity-70">
                      {selectedDisciplina === "Italiano" ? "Canto" : t("Lez.", "Less.")}
                    </span>
                    <span className="font-serif italic text-sm">{c.romanNumeral || (idx + 1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NEW SECTION: VISUAL CANTO STUDY SHOWCASE & CAROUSEL (Identical in layout to Viaggio section) */}
          {(() => {
            const key = `${selectedDisciplina}_${activeCanto.number}`;
            const cantoImages = (() => {
              if (cantiCarousels && cantiCarousels[key] && cantiCarousels[key].length > 0) return cantiCarousels[key];
              if (selectedDisciplina === "Italiano") {
                const defaults = DEFAULT_CANTO_IMAGES[activeCanto.number];
                if (defaults && defaults.length > 0) return defaults;
              }
              return [
                {
                  id: `default-canto-fallback-${activeCanto.number}`,
                  url: activeCanto.number === 1 
                    ? "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200"
                    : activeCanto.number === 2
                    ? "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200"
                    : activeCanto.number === 3
                    ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
                    : activeCanto.number === 4
                    ? "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"
                    : "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200",
                  caption: `${t("Incontro di studio facilitato per", "Facilitated study illustration for")} ${t(activeCanto.title, activeCanto.titleEn)}.`,
                  scale: 1,
                  x: 0,
                  y: 0
                }
              ];
            })();

            const setCantoCarouselImages = (updater: any) => {
              setCantiCarousels(prev => {
                const resolvedImages = typeof updater === "function" ? updater(cantoImages) : updater;
                return {
                  ...prev,
                  [key]: resolvedImages
                };
              });
            };

            const curCantoImg = cantoImages[cantoCarouselIndex % cantoImages.length];
            const scale = curCantoImg?.scale || 1.0;
            const x = curCantoImg?.x || 0;
            const y = curCantoImg?.y || 0;
            const isCustomOrUploaded = curCantoImg?.id && !curCantoImg.id.startsWith("default-canto-fallback-") && !curCantoImg.id.includes("canto-1-image") && !curCantoImg.id.includes("canto-2-image") && !curCantoImg.id.includes("canto-3-image") && !curCantoImg.id.includes("canto-4-image") && !curCantoImg.id.includes("canto-5-image");
            const isVideo = isVideoContent(curCantoImg);

            return (
              <div id="canto-study-visual-showcase" className="space-y-8 animate-fade-in pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                  {/* Left Column: Canto Synthesized Boxes */}
                  <div className="space-y-6 flex flex-col justify-between h-full w-full">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold tracking-widest text-[#a4161a] uppercase">
                          {selectedDisciplina === "Italiano"
                            ? t(`Inferno • Canto ${activeCanto.romanNumeral} • Introduzione`, `Inferno • Canto ${activeCanto.romanNumeral} • Introduction`)
                            : `${t(currentCommedia.title, currentCommedia.titleEn)} • ${t("Lezione", "Lesson")} ${activeCanto.romanNumeral || (selectedCantoIndex + 1)} • ${t("Intro", "Intro")}`}
                        </span>
                        <h3 className={`font-serif tracking-tight font-extrabold ${zoomStyles.titleSec}`}>
                          {t(activeCanto.title, activeCanto.titleEn)}
                        </h3>
                      </div>
                      <p className={`font-light leading-relaxed text-sm sm:text-base ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                        {getTxt(
                          `canto_summary_${activeCanto.number}` as any,
                          activeCanto.summary,
                          activeCanto.summaryEn
                        )}
                      </p>
                    </div>

                    {/* Left Box 2: Facilitated Reading and Meaning */}
                    <div
                      className={`p-6 rounded-lg border flex flex-col gap-3 items-start justify-between w-full self-stretch ${
                        isDarkMode ? "bg-stone-950/60 border-stone-800" : "bg-transparent border-gray-300 shadow-sm"
                      }`}
                    >
                      <div className="space-y-3">
                        <h4 className={`text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${isDarkMode ? "text-stone-400" : "text-stone-700"}`}>
                          <Sparkles size={12} className="shrink-0 text-[#e5383b]" />
                          {t("Didattica facilitata & allegoria:", "Facilitated reading & allegory:")}
                        </h4>
                        <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-700"}`}>
                          {getTxt(
                            `canto_focus_${activeCanto.number}` as any,
                            activeCanto.focusBes,
                            activeCanto.focusBesEn
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Carousel Box */}
                  <div className="h-full flex flex-col justify-start w-full">
                    {imageStyle === "hidden" ? (
                      <div className={`w-full h-full min-h-[350px] rounded-lg border border-dashed flex flex-col items-center justify-center p-6 text-center ${
                        isDarkMode ? "bg-stone-900/10 border-stone-800 text-stone-500" : "bg-stone-50 border-gray-300 text-gray-400"
                      }`}>
                        <Compass size={30} className="mb-2 text-[#a4161a]/60 animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-wider font-bold">{t("Illustrazione Nascosta", "Illustration Hidden")}</span>
                        <p className="text-[10px] mt-1 leading-normal italic">
                          {t("Le illustrazioni sono state disattivate dal profilo alunno.", "Illustrations have been disabled by student profile.")}
                        </p>
                      </div>
                    ) : (
                      <div className="relative group w-full flex flex-col h-full justify-between">
                        <div 
                          id="canti-carousel-box"
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            setIsCantoCarouselEditorMode(!isCantoCarouselEditorMode);
                          }}
                          className={`relative overflow-hidden rounded-lg shadow-md aspect-[16/10] w-full bg-white flex items-center justify-center group/carousel select-none border transition-all duration-250 h-full ${
                            isCantoCarouselEditorMode 
                              ? "border-dashed border-[#a4161a] ring-2 ring-[#a4161a]/30" 
                              : "border-stone-300 dark:border-stone-800"
                          }`}
                          title={t("Doppio clic per entrare/uscire dalla modalità editor", "Double click to edit")}
                        >
                          {cantoImages.length > 0 ? (
                            <>
                              {isVideo ? (
                                isYouTubeUrl(curCantoImg?.url) ? (
                                  <iframe
                                    src={getYouTubeEmbedUrl(curCantoImg?.url) || ""}
                                    className={`w-full h-full select-none transition-all duration-75 object-contain bg-black ${
                                      isCantoCarouselEditorMode ? "pointer-events-none" : ""
                                    }`}
                                    style={{
                                      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                      transformOrigin: "center center",
                                    }}
                                    title={curCantoImg?.caption || "YouTube Video"}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video
                                    src={resolveUrl(curCantoImg?.url)}
                                    controls={!isCantoCarouselEditorMode}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    onMouseDown={(e) => {
                                      if (!isCantoCarouselEditorMode) return;
                                      e.preventDefault();
                                      setIsDraggingImage(true);
                                      setDragStartPos({ x: e.clientX, y: e.clientY });
                                      setImageStartOffsets({ x: curCantoImg.x || 0, y: curCantoImg.y || 0 });
                                      setActiveEditingCarousel("canti");
                                    }}
                                    className={`w-full h-full select-none transition-all duration-75 ${
                                      isCustomOrUploaded ? "object-contain bg-transparent" : "object-cover"
                                    } ${
                                      isCantoCarouselEditorMode ? "cursor-grab active:cursor-grabbing hover:brightness-110" : ""
                                    } ${
                                      isCustomOrUploaded
                                        ? ""
                                        : imageStyle === "highcontrast"
                                        ? "filter grayscale contrast-200 brightness-110"
                                        : imageStyle === "minimal"
                                        ? "filter grayscale contrast-125 saturate-0 opacity-80"
                                        : "brightness-90 saturate-75"
                                    }`}
                                    style={{
                                      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                      transformOrigin: "center center",
                                      clipPath: curCantoImg?.crop 
                                        ? `inset(${curCantoImg.crop.top}% ${curCantoImg.crop.right}% ${curCantoImg.crop.bottom}% ${curCantoImg.crop.left}%)` 
                                        : "none"
                                    }}
                                  />
                                )
                              ) : (
                                <img
                                  src={resolveUrl(curCantoImg?.url)}
                                  alt={curCantoImg?.caption || t("Illustrazione", "Illustration")}
                                  referrerPolicy="no-referrer"
                                  onMouseDown={(e) => {
                                    if (!isCantoCarouselEditorMode) return;
                                    e.preventDefault();
                                    setIsDraggingImage(true);
                                    setDragStartPos({ x: e.clientX, y: e.clientY });
                                    setImageStartOffsets({ x: curCantoImg.x || 0, y: curCantoImg.y || 0 });
                                    setActiveEditingCarousel("canti");
                                  }}
                                  className={`w-full h-full select-none transition-all duration-75 ${
                                    isCustomOrUploaded ? "object-contain bg-transparent" : "object-cover"
                                  } ${
                                    isCantoCarouselEditorMode ? "cursor-grab active:cursor-grabbing hover:brightness-110" : ""
                                  } ${
                                    isCustomOrUploaded
                                      ? ""
                                      : imageStyle === "highcontrast"
                                      ? "filter grayscale contrast-200 brightness-110"
                                      : imageStyle === "minimal"
                                      ? "filter grayscale contrast-125 saturate-0 opacity-80"
                                      : "brightness-90 saturate-75"
                                  }`}
                                  style={{
                                    transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                                    transformOrigin: "center center",
                                    clipPath: curCantoImg?.crop 
                                      ? `inset(${curCantoImg.crop.top}% ${curCantoImg.crop.right}% ${curCantoImg.crop.bottom}% ${curCantoImg.crop.left}%)` 
                                      : "none"
                                  }}
                                />
                              )}

                              {/* Navigation Controls */}
                              {cantoImages.length > 1 && !isCantoCarouselEditorMode && (
                                <>
                                  {(cantoCarouselIndex % cantoImages.length) !== 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCantoCarouselIndex((prev) => (prev - 1 + cantoImages.length) % cantoImages.length);
                                      }}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/85 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-205 md:opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 shadow-md z-30 pointer-events-auto"
                                      title={t("Precedente", "Previous")}
                                    >
                                      <ChevronLeft size={18} />
                                    </button>
                                  )}
                                  {(cantoCarouselIndex % cantoImages.length) !== cantoImages.length - 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCantoCarouselIndex((prev) => (prev + 1) % cantoImages.length);
                                      }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/85 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-205 md:opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 shadow-md z-30 pointer-events-auto"
                                      title={t("Successivo", "Next")}
                                    >
                                      <ChevronRight size={18} />
                                    </button>
                                  )}
                                </>
                              )}

                              {/* Drag/Resize handles inside image display ONLY in editor mode */}
                              {isCantoCarouselEditorMode && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 z-20">
                                  <div className="absolute inset-0 border-2 border-dashed border-[#a4161a]/60">
                                    <div className="absolute inset-x-0 top-1/3 border-b border-[#a4161a]/40"></div>
                                    <div className="absolute inset-x-0 top-2/3 border-b border-[#a4161a]/40"></div>
                                    <div className="absolute inset-y-0 left-1/3 border-r border-[#a4161a]/40"></div>
                                    <div className="absolute inset-y-0 left-2/3 border-r border-[#a4161a]/40"></div>
                                  </div>
                                  
                                  <div 
                                    className="absolute top-2 left-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "top-left", "canti")}
                                  />
                                  <div 
                                    className="absolute top-2 right-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "top-right", "canti")}
                                  />
                                  <div 
                                    className="absolute bottom-2 left-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left", "canti")}
                                  />
                                  <div 
                                    className="absolute bottom-2 right-2 w-4 h-4 rounded bg-white border-2 border-[#a4161a] pointer-events-auto cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right", "canti")}
                                  />

                                  <div 
                                    className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-[#a4161a] pointer-events-auto cursor-ns-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "top", "canti")}
                                  />
                                  <div 
                                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-[#a4161a] pointer-events-auto cursor-ns-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "bottom", "canti")}
                                  />
                                  <div 
                                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 rounded-full bg-[#a4161a] pointer-events-auto cursor-ew-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "left", "canti")}
                                  />
                                  <div 
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 rounded-full bg-[#a4161a] pointer-events-auto cursor-ew-resize shadow hover:scale-110 transition-transform"
                                    onMouseDown={(e) => handleResizeMouseDown(e, "right", "canti")}
                                  />
                                </div>
                              )}

                              {/* Centering axes guidelines in editor mode */}
                              {isCantoCarouselEditorMode && (
                                <div className="absolute inset-0 pointer-events-none z-10 select-none">
                                  {Math.abs(y) < 3.5 && (
                                    <div 
                                      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t opacity-100 transition-opacity duration-150"
                                      style={{ borderColor: "crimson", borderTopWidth: "1px" }}
                                    />
                                  )}
                                  {Math.abs(x) < 3.5 && (
                                    <div 
                                      className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l opacity-100 transition-opacity duration-150"
                                      style={{ borderColor: "crimson", borderLeftWidth: "1px" }}
                                    />
                                  )}
                                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 text-[8.5px] font-mono text-stone-300 flex items-center gap-1.5 uppercase tracking-wider z-20">
                                    <span>X: {x.toFixed(0)}px</span>
                                    <span>Y: {y.toFixed(0)}px</span>
                                    {(Math.abs(x) < 3.5) && <span className="text-red-500 font-bold" style={{ color: "crimson" }}>X: ✓</span>}
                                    {(Math.abs(y) < 3.5) && <span className="text-red-500 font-bold" style={{ color: "crimson" }}>Y: ✓</span>}
                                    {(Math.abs(x) < 3.5 && Math.abs(y) < 3.5) && (
                                      <span className="text-red-500 font-bold" style={{ color: "crimson" }}>[ {t("CENTRATO", "CENTERED")} ]</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Quick deletion for custom user images - visible only in editor mode */}
                              {isCantoCarouselEditorMode && curCantoImg?.id && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newImages = cantoImages.filter((img) => img.id !== curCantoImg.id);
                                    setCantoCarouselImages(newImages);
                                    setCantoCarouselIndex(0);
                                  }}
                                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-stone-200 hover:text-red-500 hover:bg-black/80 transition-all duration-200 shadow z-30"
                                  title={t("Elimina questa immagine", "Delete this image")}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}

                              {/* Fullscreen Button */}
                              {cantoImages.length > 0 && !isCantoCarouselEditorMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFullscreenCantoCarouselOpen(true);
                                  }}
                                  className="absolute top-3 right-3 w-4 h-9 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-md z-30 pointer-events-auto select-none"
                                  title={t("Schermo intero", "Fullscreen")}
                                >
                                  <Maximize2 size={16} />
                                </button>
                              )}

                              {/* Rewind/Restart Carousel Button */}
                              {cantoImages.length > 1 && (cantoCarouselIndex % cantoImages.length) === (cantoImages.length - 1) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCantoCarouselIndex(0);
                                  }}
                                  className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/80 text-white border border-stone-700/50 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-md z-30 pointer-events-auto select-none animate-none"
                                  title={t("Torna alla prima slide", "Back to first slide")}
                                >
                                  <RotateCcw size={15} />
                                </button>
                              )}

                              {/* Info Overlay Caption */}
                              <div className="absolute inset-x-0 bottom-0 p-4 text-white pointer-events-none">
                                <div className="flex items-center justify-end text-[11px] font-mono opacity-80 mb-1">
                                  {!isCantoCarouselEditorMode && (
                                    <span className="text-[9px] uppercase tracking-wider opacity-65 font-mono hidden group-hover/carousel:inline [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
                                      {t("Doppio clic per modificare", "Double-click to edit")}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider font-mono text-white leading-relaxed line-clamp-2 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
                                  {curCantoImg?.caption || ""}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="text-stone-400 text-xs text-center p-4">
                              {t("Nessuna immagine nel carosello del Canto.", "No images in the Canto carousel.")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dots indicator, edit zoom panel & adding custom plates under the columns */}
                {imageStyle !== "hidden" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 items-start pb-4">
                    {/* Empty Left Grid Cell to ensure right controls are perfectly matched */}
                    <div className="hidden md:block"></div>
                    
                    {/* Right-aligned column for helpers/control fields */}
                    <div className="w-full flex flex-col space-y-4">
                      {/* Dots indicator */}
                      {cantoImages.length > 1 && !isCantoCarouselEditorMode && (
                        <div className="flex justify-center gap-1.5">
                          {cantoImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCantoCarouselIndex(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                cantoCarouselIndex === idx ? "w-4 bg-[#a4161a]" : "w-1.5 bg-stone-300 hover:bg-stone-400"
                              }`}
                              title={`${t("Vai all'immagine", "Go to image")} ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {isCantoCarouselEditorMode && (
                        (() => {
                          const curCantoImg = cantoImages[cantoCarouselIndex % cantoImages.length];
                          const scale = curCantoImg?.scale || 1.0;
                          return (
                            <div 
                              id="canti-carousel-editor-controls-box"
                              className={`p-4 rounded-lg border space-y-3 font-mono transition-colors ${
                                isDarkMode 
                                  ? "bg-stone-900 border-stone-800 text-stone-300" 
                                  : "bg-stone-100 border-stone-200 text-stone-700"
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                                <span className="text-[#a4161a] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                                  <Crop size={12} /> {t("Editor Ritaglio & Zoom", "Crop & Zoom Editor")}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setCantoCarouselImages((prev: any) => {
                                        const updated = [...prev];
                                        const idx = cantoCarouselIndex % updated.length;
                                        if (updated[idx]) {
                                          updated[idx] = { ...updated[idx], scale: Math.max(0.5, scale - 0.2) };
                                        }
                                        return updated;
                                      });
                                    }}
                                    className={`w-5 h-5 flex items-center justify-center rounded border font-bold text-xs bg-transparent transition-colors ${
                                      isDarkMode
                                        ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                        : "border-black text-black hover:bg-black/5"
                                    }`}
                                    title={t("Riduci", "Zoom Out")}
                                  >
                                    -
                                  </button>
                                  <span className="min-w-[40px] text-center font-bold text-xs">{scale.toFixed(1)}x</span>
                                  <button
                                    onClick={() => {
                                      setCantoCarouselImages((prev: any) => {
                                        const updated = [...prev];
                                        const idx = cantoCarouselIndex % updated.length;
                                        if (updated[idx]) {
                                          updated[idx] = { ...updated[idx], scale: Math.min(6.0, scale + 0.2) };
                                        }
                                        return updated;
                                      });
                                    }}
                                    className={`w-5 h-5 flex items-center justify-center rounded border font-bold text-xs bg-transparent transition-colors ${
                                      isDarkMode
                                        ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                        : "border-black text-black hover:bg-black/5"
                                    }`}
                                    title={t("Ingrandisci", "Zoom In")}
                                  >
                                    +
                                  </button>

                                  <button
                                    onClick={() => {
                                      setCantoCarouselImages((prev: any) => {
                                        const updated = [...prev];
                                        const idx = cantoCarouselIndex % updated.length;
                                        if (updated[idx]) {
                                          updated[idx] = { 
                                            ...updated[idx], 
                                            scale: 1.0, 
                                            x: 0, 
                                            y: 0, 
                                            crop: { top: 0, right: 0, bottom: 0, left: 0 } 
                                          };
                                        }
                                        return updated;
                                      });
                                    }}
                                    className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold bg-transparent transition-colors ${
                                      isDarkMode
                                        ? "border-stone-400 text-stone-300 hover:bg-white/10"
                                        : "border-black text-black hover:bg-black/5"
                                    }`}
                                  >
                                    {t("Azzera", "Reset")}
                                  </button>
                                </div>
                              </div>

                              {/* Info Note: Not italic, exactly 10pt (13.33px) */}
                              <div className="text-[13.33px] text-stone-500 dark:text-stone-400 leading-normal font-sans">
                                {t("* Trascina l'immagine per spostarla. Trascina i quadratini bianchi ai vertici per lo zoom ed i trattini rossi sui lati per fare liberamente crop.", "* Drag the image to pan. Drag the white corner squares for zoom, and the red side handles to freely crop the image.")}
                              </div>

                              {/* Current Caption Editor field */}
                              {curCantoImg && (
                                <div className="space-y-1.5 pt-3 border-t border-stone-200 dark:border-stone-850">
                                  <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                                    {t("Modifica Didascalia Corrente:", "Edit Current Caption:")}
                                  </label>
                                  <input
                                    type="text"
                                    value={curCantoImg.caption || ""}
                                    onChange={(e) => {
                                      const newCaption = e.target.value;
                                      setCantoCarouselImages((prev: any) => {
                                        const updated = [...prev];
                                        const idx = cantoCarouselIndex % updated.length;
                                        if (updated[idx]) {
                                          updated[idx] = { ...updated[idx], caption: newCaption };
                                        }
                                        return updated;
                                      });
                                    }}
                                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-solid border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-[#a4161a] text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-500 transition-colors hover:border-[#a4161a] dark:hover:border-[#a4161a] font-sans"
                                    placeholder={t("Inserisci didascalia...", "Enter caption...")}
                                  />
                                </div>
                              )}

                              {/* Image Reordering Thumbnail organizer */}
                              {cantoImages.length > 1 && (
                                <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-stone-850">
                                  <label className="block text-[10px] font-mono uppercase tracking-wider opacity-80 font-bold text-stone-600 dark:text-stone-400">
                                    {t("Ordina le immagini (Seleziona, sposta o trascina):", "Order Images (Select, move or drag to reorder):")}
                                  </label>
                                  <div className="flex flex-wrap gap-2 py-1 items-center bg-black/5 dark:bg-black/20 p-2 rounded-md">
                                    {cantoImages.map((img, idx) => {
                                      const isCurrent = (cantoCarouselIndex % cantoImages.length) === idx;
                                      return (
                                        <div 
                                          key={img.id || idx}
                                          draggable={true}
                                          onDragStart={(e) => {
                                            setCantoDraggedThumbIndex(idx);
                                            e.dataTransfer.effectAllowed = "move";
                                          }}
                                          onDragOver={(e) => {
                                            e.preventDefault();
                                          }}
                                          onDragEnter={() => setCantoDragOverThumbIndex(idx)}
                                          onDragEnd={() => {
                                            setCantoDraggedThumbIndex(null);
                                            setCantoDragOverThumbIndex(null);
                                          }}
                                          onDrop={(e) => {
                                            e.preventDefault();
                                            if (cantoDraggedThumbIndex !== null && cantoDraggedThumbIndex !== idx) {
                                              setCantoCarouselImages((prev: any) => {
                                                const next = [...prev];
                                                const [moved] = next.splice(cantoDraggedThumbIndex, 1);
                                                next.splice(idx, 0, moved);
                                                return next;
                                              });
                                              setCantoCarouselIndex(idx);
                                            }
                                            setCantoDraggedThumbIndex(null);
                                            setCantoDragOverThumbIndex(null);
                                          }}
                                          className={`relative group/thumb border rounded p-1 flex flex-col items-center gap-1 transition-all select-none cursor-grab active:cursor-grabbing ${
                                            cantoDraggedThumbIndex === idx
                                              ? "opacity-40 border-dashed border-[#a4161a] bg-[#a4161a]/5 scale-95"
                                              : cantoDragOverThumbIndex === idx
                                              ? "border-dashed border-[#a4161a] bg-[#a4161a]/25 scale-105"
                                              : isCurrent 
                                              ? "border-[#a4161a] bg-[#a4161a]/10 scale-105" 
                                              : "border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 hover:bg-stone-50 dark:hover:bg-stone-900"
                                          }`}
                                          title={t("Trascina per riordinare", "Drag to reorder")}
                                        >
                                          {/* Red insertion segment indicator */}
                                          {cantoDraggedThumbIndex !== null && cantoDragOverThumbIndex === idx && cantoDraggedThumbIndex !== idx && (
                                            <div 
                                              className={`absolute top-0 bottom-0 w-1 bg-[#a4161a] rounded shadow-[0_0_8px_rgba(164,22,26,0.8)] pointer-events-none z-20 ${
                                                idx < cantoDraggedThumbIndex ? "-left-1.5" : "-right-1.5"
                                              }`}
                                            >
                                              {/* Accent dots on top & bottom to highlight the vertical line insertion precision */}
                                              <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#a4161a] rounded-full shadow-[0_0_6px_rgba(164,22,26,0.8)] border border-white dark:border-stone-950" />
                                              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#a4161a] rounded-full shadow-[0_0_6px_rgba(164,22,26,0.8)] border border-white dark:border-stone-950" />
                                            </div>
                                          )}

                                          {/* Thumbnail */}
                                          <div 
                                            className="w-12 h-10 rounded overflow-hidden cursor-pointer relative bg-black/10 flex items-center justify-center shrink-0"
                                            onClick={() => setCantoCarouselIndex(idx)}
                                            title={t("Seleziona questa immagine", "Select this image")}
                                          >
                                            {img.mediaType === "video" ? (
                                              <div className="w-full h-full bg-stone-800 flex items-center justify-center text-[8px] text-white font-mono uppercase font-bold">Vid</div>
                                            ) : (
                                              <img src={resolveUrl(img.url)} className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                                            )}
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                              <span className="text-[9px] text-white font-bold">#{idx + 1}</span>
                                            </div>
                                          </div>

                                          {/* Left/Right Ordering Buttons and Grip Handle */}
                                          <div className="flex items-center gap-1">
                                            <div className="text-stone-400 dark:text-stone-600 cursor-grab active:cursor-grabbing hover:text-[#a4161a]" title={t("Trascina per riordinare", "Drag to reorder")}>
                                              <GripVertical size={11} />
                                            </div>
                                            <button
                                              type="button"
                                              disabled={idx === 0}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setCantoCarouselImages((prev: any) => {
                                                  const next = [...prev];
                                                  const temp = next[idx];
                                                  next[idx] = next[idx - 1];
                                                  next[idx - 1] = temp;
                                                  return next;
                                                });
                                                if (isCurrent) {
                                                  setCantoCarouselIndex(idx - 1);
                                                } else if ((cantoCarouselIndex % cantoImages.length) === idx - 1) {
                                                  setCantoCarouselIndex(idx);
                                                }
                                              }}
                                              className={`p-0.5 rounded border flex items-center justify-center transition-colors ${
                                                idx === 0 
                                                  ? "opacity-30 cursor-not-allowed" 
                                                  : "hover:bg-[#a4161a] hover:text-white dark:hover:bg-[#a4161a] border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                                              }`}
                                              title={t("Sposta a sinistra", "Move/Order Left")}
                                            >
                                              <ChevronLeft size={10} />
                                            </button>
                                            <button
                                              type="button"
                                              disabled={idx === cantoImages.length - 1}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setCantoCarouselImages((prev: any) => {
                                                  const next = [...prev];
                                                  const temp = next[idx];
                                                  next[idx] = next[idx + 1];
                                                  next[idx + 1] = temp;
                                                  return next;
                                                });
                                                if (isCurrent) {
                                                  setCantoCarouselIndex(idx + 1);
                                                } else if ((cantoCarouselIndex % cantoImages.length) === idx + 1) {
                                                  setCantoCarouselIndex(idx);
                                                }
                                              }}
                                              className={`p-0.5 rounded border flex items-center justify-center transition-colors ${
                                                idx === cantoImages.length - 1 
                                                  ? "opacity-30 cursor-not-allowed" 
                                                  : "hover:bg-[#a4161a] hover:text-white dark:hover:bg-[#a4161a] border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                                              }`}
                                              title={t("Sposta a destra", "Move/Order Right")}
                                            >
                                              <ChevronRight size={10} />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-200 dark:border-stone-850">
                                {/* Left action tools: Nuova Immagine button */}
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setIsCantoAddingImage(!isCantoAddingImage)}
                                    className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shadow transition-all duration-200 flex items-center gap-1 shrink-0 ${
                                      isCantoAddingImage
                                        ? "bg-[#a4161a] text-white hover:bg-[#a4161a]/90"
                                        : isDarkMode
                                        ? "bg-stone-800 hover:bg-stone-750 text-stone-200"
                                        : "bg-stone-200 hover:bg-stone-300 text-stone-800"
                                    }`}
                                    title={t("Aggiungi nuova immagine", "Add new image")}
                                  >
                                    <Plus size={10} />
                                    {t("Nuova Immagine", "Add Image")}
                                  </button>
                                </div>

                                {/* Right action tools: Fine button */}
                                <button
                                  onClick={() => setIsCantoCarouselEditorMode(false)}
                                  className="px-3 py-1 bg-[#a4161a] hover:bg-[#a4161a]/90 text-white font-bold rounded-md font-mono text-[10px] uppercase tracking-wider shadow shrink-0"
                                >
                                  {t("Fine", "Finish")}
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      )}

                      {/* Drop-and-Drop addition of a new plate */}
                      {isCantoCarouselEditorMode && isCantoAddingImage && (
                        <div 
                          className={`p-4 rounded-lg border border-dashed transition-all relative ${
                            isCantoDragOver
                              ? "border-[#a4161a] bg-[#a4161a]/5 scale-[1.01]"
                              : isDarkMode
                              ? "bg-stone-900 border-stone-850 text-stone-300"
                              : "bg-stone-100 border-stone-200 text-stone-700"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsCantoDragOver(true);
                          }}
                          onDragLeave={() => setIsCantoDragOver(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsCantoDragOver(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              const file = e.dataTransfer.files[0];
                              await processFileUpload(file, setNewCantoImageUrl, setNewCantoMediaType);
                              setNewCantoImageCaption(file.name.replace(/\.[^/.]+$/, ""));
                            }
                          }}
                        >
                          <div className="space-y-3">
                            <span className="text-[10px] font-mono tracking-wider uppercase opacity-90 block font-bold text-[#a4161a]">
                              {t("Nuova Piastra Illustrativa", "New Illustration Plate")}
                            </span>
                            
                            {/* File Drag upload */}
                            <div className="flex items-center gap-2.5">
                              <label className="flex-1 flex flex-col items-center justify-center p-3 rounded-md border border-dashed border-stone-300 dark:border-stone-800 hover:border-[#a4161a] transition-colors cursor-pointer bg-black/5 dark:bg-black/10">
                                <Plus size={16} className="text-[#a4161a]" />
                                <span className="text-[9px] font-mono uppercase mt-1 opacity-80">{t("Trascina file qui o Sfoglia (.jpg, .png, .mp4)", "Drag file here or Browse")}</span>
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      await processFileUpload(file, setNewCantoImageUrl, setNewCantoMediaType);
                                      setNewCantoImageCaption(file.name.replace(/\.[^/.]+$/, ""));
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {/* Or Url input */}
                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono uppercase tracking-wider opacity-80 font-bold">
                                {t("Oppure inserisci URL Web esterno:", "Or enter external Web URL:")}
                              </label>
                              <input
                                type="text"
                                value={newCantoImageUrl.startsWith("data:") || newCantoImageUrl.startsWith("indexeddb://") ? "" : newCantoImageUrl}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setNewCantoImageUrl(val);
                                  const valLower = val.toLowerCase();
                                  if (valLower.endsWith(".mp4") || valLower.endsWith(".webm") || valLower.endsWith(".mov") || valLower.endsWith(".ogg") || valLower.includes("video") || isYouTubeUrl(val)) {
                                    setNewCantoMediaType("video");
                                  }
                                }}
                                placeholder={newCantoMediaType === "video" ? "https://example.com/movie.mp4" : "https://example.com/illustration.jpg"}
                                className="w-full text-xs px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#a4161a]"
                              />
                            </div>

                            {/* Caption display */}
                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono uppercase tracking-wider opacity-80 font-bold">
                                {t("Didascalia / Titolo:", "Caption / Title:")}
                              </label>
                              <input
                                type="text"
                                value={newCantoImageCaption}
                                onChange={(e) => setNewCantoImageCaption(e.target.value)}
                                placeholder={t("Es. Dante contempla la selva oscura", "e.g., Dante contemplating the forest")}
                                className="w-full text-xs px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-800 bg-stone-200/50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#a4161a]"
                              />
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                onClick={() => {
                                  setIsCantoAddingImage(false);
                                  setNewCantoImageUrl("");
                                  setNewCantoImageCaption("");
                                  setNewCantoMediaType("image");
                                }}
                                className={`px-2.5 py-1 rounded text-[10px] border transition-colors ${
                                  isDarkMode ? "border-stone-700 text-stone-400 hover:bg-stone-800" : "border-stone-300 text-stone-600 hover:bg-stone-200"
                                }`}
                              >
                                {t("Annulla", "Cancel")}
                              </button>
                              <button
                                onClick={() => {
                                  if (!newCantoImageUrl) return;
                                  const newImg = {
                                    id: "canto-custom-" + Date.now(),
                                    url: newCantoImageUrl,
                                    caption: newCantoImageCaption || (newCantoMediaType === "video" ? t("Video didattico", "Study video") : t("Piatto personalizzato", "Custom Plate")),
                                    mediaType: newCantoMediaType,
                                    scale: 1.0,
                                    x: 0,
                                    y: 0
                                  };
                                  setCantoCarouselImages((prev: any) => [...prev, newImg]);
                                  setCantoCarouselIndex(cantoImages.length); // focus on newly added plate
                                  setIsCantoAddingImage(false);
                                  setNewCantoImageUrl("");
                                  setNewCantoImageCaption("");
                                  setNewCantoMediaType("image");
                                }}
                                disabled={!newCantoImageUrl}
                                className="px-3 py-1 bg-[#a4161a] hover:bg-[#a4161a]/90 text-white font-bold rounded text-[10px] disabled:opacity-40"
                              >
                                {t("Includi", "Include")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ACTIVE CANTO CONTAINER */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Info Column left */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-mono tracking-widest text-[#a4161a] uppercase font-bold flex items-center gap-1.5 animate-fade-in">
                    {selectedDisciplina === "Italiano" ? (
                      <>
                        <Headphones size={13} className="shrink-0 text-[#a4161a]" />
                        <span>{t("supporto audio", "audio support")}</span>
                      </>
                    ) : (
                      `${t(currentCommedia.title, currentCommedia.titleEn)} • ${t("Lezione", "Lesson")} ${activeCanto.romanNumeral || (selectedCantoIndex + 1)}`
                    )}
                  </span>
                </div>

                <div className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                  isDarkMode 
                    ? "bg-stone-900/40 border-stone-800" 
                    : "bg-white border-stone-200 shadow-sm"
                } ${isParaphraseActive ? "lg:mt-[76px]" : "lg:mt-5"}`}>
                  <div className="space-y-5">
                    {/* Track Selector */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                        {t("Scegli il Contenuto", "Choose Content Type")}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setAudioTrackType("original")}
                          className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border h-10 ${
                            audioTrackType === "original"
                              ? isDarkMode
                                ? "bg-red-955 border-[#a4161a]/30 text-white"
                                : "bg-red-50 border-[#a4161a] text-[#a4161a]"
                              : isDarkMode
                              ? "bg-stone-850/40 hover:bg-stone-800 text-stone-400 border-stone-850"
                              : "bg-stone-50 hover:bg-stone-100 text-[#161a1d] border-stone-200"
                          }`}
                        >
                          <div className="text-center leading-none">
                            <span className="block text-[9px] font-bold">{t("VERSI ORIGINALI", "ORIGINAL VERSES")}</span>
                            <span className="block text-[7px] opacity-75 font-normal font-mono">Dante Alighieri</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setAudioTrackType("paraphrase")}
                          className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border h-10 ${
                            audioTrackType === "paraphrase"
                              ? isDarkMode
                                ? "bg-red-955 border-[#a4161a] text-white"
                                : "bg-red-50 border-[#a4161a] text-[#a4161a]"
                              : isDarkMode
                              ? "bg-stone-850/40 hover:bg-stone-800 text-stone-400 border-stone-850"
                              : "bg-stone-50 hover:bg-stone-100 text-[#161a1d] border-stone-200"
                          }`}
                        >
                          <div className="text-center leading-none">
                            <span className="block text-[9px] font-bold">{t("PARAFRASI", "PARAPHRASE")}</span>
                            <span className="block text-[7px] opacity-75 font-normal font-mono">Lettura in Prosa</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Main Player Display Card */}
                    <div className={`p-3 rounded-lg border flex flex-col items-center justify-center relative overflow-hidden ${
                      isDarkMode ? "bg-stone-950/50 border-stone-800" : "bg-stone-50 border-stone-200"
                    }`}>
                      <div className="absolute top-1.5 left-2.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[8px] font-mono uppercase tracking-widest text-[#a4161a] font-bold">
                          {audioTrackType === "original" ? t("VOCE ATTORE", "VOICE ACTOR") : t("AUDIO STUDIO", "AUDIO STUDIO")}
                        </span>
                      </div>

                      <div className="absolute top-1.5 right-2.5">
                        <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[#a4161a]/10 text-[#a4161a] font-bold">
                          Canto {cantiData[selectedCantoIndex].romanNumeral}
                        </span>
                      </div>

                      {/* Visualizer animation when playing */}
                      <div className="h-8 flex items-end gap-0.5 px-2 mt-4">
                        {Array.from({ length: 15 }).map((_, waveIdx) => (
                          <div
                            key={waveIdx}
                            className={`w-0.5 max-w-[2px] bg-[#a4161a] rounded transition-all duration-300 ${
                              audioIsPlaying ? "animate-audio-bar" : "h-1 opacity-45"
                            }`}
                            style={{
                              animationDelay: `${waveIdx * 0.08}s`,
                              height: audioIsPlaying ? `${Math.floor(Math.random() * 20) + 4}px` : "4px"
                            }}
                          />
                        ))}
                      </div>

                      {/* Timing metrics */}
                      <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold tracking-wider mt-3 px-1.5 opacity-80">
                        <span>
                          {Math.floor(audioElapsedSeconds / 60)}:{(audioElapsedSeconds % 60).toString().padStart(2, "0")}
                        </span>
                        <span className="opacity-50">/</span>
                        <span>
                          {Math.floor((cantiData[selectedCantoIndex].tercets.length * 8) / 60)}:
                          {((cantiData[selectedCantoIndex].tercets.length * 8) % 60).toString().padStart(2, "0")}
                        </span>
                      </div>

                      {/* Scrubber track (Progress Bar) */}
                      <div className="w-full mt-1.5 px-0.5 relative">
                        <div 
                          className={`h-1 w-full rounded-full cursor-pointer relative ${
                            isDarkMode ? "bg-stone-800" : "bg-stone-250"
                          }`}
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const percentage = clickX / rect.width;
                            const totalTerz = cantiData[selectedCantoIndex].tercets.length;
                            const targetTercet = Math.floor(percentage * totalTerz);
                            seekAudioTercet(Math.max(0, Math.min(targetTercet, totalTerz - 1)));
                          }}
                        >
                          <div 
                            className="h-full bg-[#a4161a] rounded-full relative transition-all duration-300 animate-pulse"
                            style={{ width: `${audioProgress}%` }}
                          >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-[#a4161a] rounded-full shadow-md" />
                          </div>
                        </div>
                      </div>

                      {/* Player controls */}
                      <div className="flex items-center gap-3 mt-4 animate-fade-in font-sans">
                        {/* Skip Previous */}
                        <button
                          onClick={() => seekAudioTercet(Math.max(0, audioCurrentTercetIdx - 1))}
                          disabled={audioCurrentTercetIdx === 0}
                          className={`p-1.5 rounded-full transition-all border ${
                            audioCurrentTercetIdx === 0
                              ? "opacity-30 cursor-not-allowed text-stone-500 border-transparent"
                              : isDarkMode
                              ? "hover:bg-stone-800 text-stone-200 border-stone-800"
                              : "hover:bg-stone-100 text-stone-700 border-stone-250"
                          }`}
                          title={t("Terzina Precedente", "Previous Tercet")}
                        >
                          <SkipBack size={12} />
                        </button>

                        {/* Master Play / Pause */}
                        <button
                          onClick={() => {
                            if (audioIsPlaying) {
                              pauseAudioCanto();
                            } else {
                              startAudioCanto();
                            }
                          }}
                          className="p-2 bg-[#a4161a] hover:bg-[#b52226] text-white rounded-full transition-all shadow-md shadow-[#a4161a]/25 focus:ring-2 focus:ring-[#a4161a]/30"
                          title={audioIsPlaying ? t("Pausa", "Pause") : t("Riproduci", "Play")}
                        >
                          {audioIsPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
                        </button>

                        {/* Stop */}
                        <button
                          onClick={stopAudioCanto}
                          className={`p-1.5 rounded-full transition-all border ${
                            isDarkMode
                              ? "hover:bg-stone-800 text-stone-200 border-stone-800"
                              : "hover:bg-stone-100 text-stone-700 border-stone-250"
                          }`}
                          title={t("Ferma e Resetta", "Stop & Reset")}
                        >
                          <Square size={11} fill="currentColor" />
                        </button>

                        {/* Skip Next */}
                        <button
                          onClick={() => seekAudioTercet(Math.min(cantiData[selectedCantoIndex].tercets.length - 1, audioCurrentTercetIdx + 1))}
                          disabled={audioCurrentTercetIdx === cantiData[selectedCantoIndex].tercets.length - 1}
                          className={`p-1.5 rounded-full transition-all border ${
                            audioCurrentTercetIdx === cantiData[selectedCantoIndex].tercets.length - 1
                              ? "opacity-30 cursor-not-allowed text-stone-500 border-transparent"
                              : isDarkMode
                              ? "hover:bg-stone-800 text-stone-200 border-stone-800"
                              : "hover:bg-stone-100 text-stone-700 border-stone-250"
                          }`}
                          title={t("Terzina Successiva", "Next Tercet")}
                        >
                          <SkipForward size={12} />
                        </button>
                      </div>
                    </div>

                    {/* UDL Learning Speed Controls */}
                    <div className="space-y-1 border-t pt-3.5 border-stone-800/10 dark:border-stone-800/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                          {t("Regolazione del Tempo (Sussidio UDL)", "Modulate Pace / Speed (UDL-Aid)")}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-[#a4161a]">
                          {audioSpeed}x ({audioSpeed === 0.75 ? t("Lento", "Slow") : audioSpeed === 1.0 ? t("Standard", "Standard") : t("Rapido", "Fast")})
                        </span>
                      </div>
                      <div className="flex gap-1 font-mono">
                        {[0.75, 1.0, 1.25].map((speedVal) => (
                          <button
                            key={speedVal}
                            onClick={() => changeAudioSpeed(speedVal)}
                            className={`flex-1 py-1 rounded text-[9px] font-bold transition-all border ${
                              audioSpeed === speedVal
                                ? "bg-[#a4161a]/10 border-[#a4161a] text-[#a4161a]"
                                : isDarkMode
                                ? "bg-stone-850/50 hover:bg-stone-800 text-stone-400 border-stone-850"
                                : "bg-stone-100/50 hover:bg-stone-200 text-stone-600 border-stone-250"
                            }`}
                          >
                            {speedVal === 0.75 ? "🐢 0.75x" : speedVal === 1.0 ? "🦊 1.0x" : "⚡ 1.25x"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* UDL Instructional Tip Card */}
                  <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 border leading-relaxed select-none ${
                    isDarkMode 
                      ? "bg-[#1c0708]/30 border-red-900/10 text-stone-200" 
                      : "bg-red-50/40 border-red-200/40 text-stone-800"
                  }`}>
                    <Info size={11} className="text-[#a4161a] shrink-0 mt-0.5" />
                    <p className="text-[9px] font-light leading-normal">
                      <strong className="font-semibold block text-[#a4161a] mb-0.5 font-mono text-[9px]">
                        {t("Didattica Accessibile UDL:", "Accessible UDL Guidance:")}
                      </strong>
                      {t(
                        "Puoi cliccare su una qualsiasi delle terzine elencate nel lettore visivo a destra per attivare lo scorrimento interattivo assistito e focalizzare l'attenzione su quella precisa riga di versi.",
                        "You can click on any tercet box listed in the visual reader pane on the right to trigger active micro-scrolling assistance and focus attention on those specific lines."
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verses Column right (Responsive side-by-side or centered layout) */}
              <div className="lg:col-span-7 space-y-10">
                {/* LABELS ROW ALIGNED WITH SECTION HEADER/CONTROLS */}
                <div className="flex items-center justify-between pb-2 pl-8">
                  <span className="text-xs sm:text-sm font-mono text-[#a4161a] uppercase font-bold tracking-widest">
                    {t("Esegesi ed Analisi del Testo", "Exegesis and Text Analysis")}
                  </span>
                </div>

                {isParaphraseActive && (
                  <div className="grid grid-cols-2 gap-4 px-4 py-2 border-b border-[#a4161a]/10">
                    <span className={`text-xs sm:text-sm font-mono font-bold uppercase tracking-wide ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                      {t("VERSI ORIGINALI", "ORIGINAL VERSES")}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-[#a4161a] font-bold uppercase tracking-wide">
                      {t("Parafrasi", "Paraphrase")}
                    </span>
                  </div>
                )}

                {/* LIST OF TERCETS */}
                <div className="space-y-12">
                  {activeCanto.tercets.map((tercet, idxT) => {
                    const originalVersesString = tercet.verses.map(v => v.text).join(" \n ");
                    const isTercetActive = currentlyPlayingTercet === tercet.id || (audioCantoIndex === selectedCantoIndex && audioCurrentTercetIdx === idxT);
                    return (
                      <div
                        key={tercet.id}
                        id={`tercet-box-${idxT}`}
                        onClick={() => {
                          if (isSpeaking) {
                            window.speechSynthesis.cancel();
                            setIsSpeaking(false);
                            setCurrentlyPlayingTercet(null);
                          }
                          seekAudioTercet(idxT);
                          if (!audioIsPlaying) {
                            setAudioIsPlaying(true);
                            window.speechSynthesis?.cancel();
                            playCantoTercetAudio(idxT);
                          }
                        }}
                        className={`space-y-4 relative p-4 rounded-lg transition-all cursor-pointer border ${
                          isTercetActive
                            ? isDarkMode
                              ? "bg-red-950/15 border-[#a4161a]/60 shadow-[0_0_12px_rgba(164,22,26,0.15)]"
                              : "bg-red-50/70 border-[#a4161a]/30 shadow-[0_0_12px_rgba(164,22,26,0.08)]"
                            : isDarkMode
                            ? "border-transparent hover:border-stone-800 hover:bg-stone-900/40"
                            : "border-transparent hover:border-stone-200 hover:bg-stone-50/75"
                        }`}
                      >
                        {/* Audio and controls per tercet */}
                        <div className="absolute top-1 right-2 flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(originalVersesString, tercet.id);
                            }}
                            className={`p-1 rounded hover:bg-stone-500/10 transition-colors text-xs flex items-center gap-1 ${
                              currentlyPlayingTercet === tercet.id ? "text-red-500 font-bold" : (isDarkMode ? "text-stone-400" : "text-[#161a1d]")
                            }`}
                            title={t("Lettura assistita", "Read-aloud assistance")}
                          >
                            {currentlyPlayingTercet === tercet.id ? <Volume2 size={13} className="animate-bounce" /> : <VolumeX size={13} />}
                            <span className="text-xs font-mono hidden sm:inline">TTS</span>
                          </button>
                        </div>

                        {/* ORIGINAL VERSES VS PARAPHRASE DYNAMIC SPLITTER */}
                        <div
                          className={`grid ${
                            isParaphraseActive ? "grid-cols-2 gap-4 items-start" : "grid-cols-1 justify-items-start text-left"
                          } w-full transition-all duration-300`}
                        >
                          {/* Col 1: Original Tercet */}
                          <div className={`space-y-2.5 w-full ${isParaphraseActive ? "text-left border-r border-[#a4161a]/10 pr-2 sm:pr-4" : "max-w-xl text-left"}`}>
                            {tercet.verses.map((v, i) => (
                              <div
                                key={i}
                                className="flex items-start space-x-3 w-full"
                              >
                                {/* Line Number on left */}
                                <span className="font-mono text-xs text-[#a4161a] w-5 text-right select-none opacity-80 font-semibold shrink-0 pt-1">
                                  {v.lineNumber ? v.lineNumber : " "}
                                </span>
                                {/* Verse Line */}
                                <p
                                  className={`font-serif tracking-wide whitespace-pre-line leading-loose ${
                                    isDarkMode ? (
                                      isParaphraseActive
                                        ? "text-xs sm:text-sm md:text-base italic text-stone-300"
                                        : "text-stone-300"
                                    ) : (
                                      "text-[#161a1d]" + (isParaphraseActive ? " text-xs sm:text-sm md:text-base italic" : "")
                                    )
                                  } ${!isParaphraseActive ? zoomStyles.verses : ""}`}
                                >
                                  {renderVerseWithGlossary(v.text, tercet.id)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Col 2: Paraphrase (Visible only when toggled) */}
                          {isParaphraseActive && (
                            <div className="w-full space-y-2.5">
                              <span className="text-xs font-mono text-[#a4161a]/90 font-bold uppercase tracking-wider block bg-[#a4161a]/5 px-1.5 py-0.5 rounded w-max leading-none mb-1 sm:hidden">
                                {t("PARAFRASI", "PARAPHRASE")}
                              </span>
                              <p
                                className={`italic font-mono leading-loose font-normal text-xs sm:text-sm md:text-base ${isDarkMode ? "text-stone-300" : "text-stone-700/90"} ${zoomStyles.paraphrase}`}
                              >
                                {tercet.paraphraseText}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 4. CAA ACCESSIBLE LAYER - CONDITIONAL RENDER SYMBOL BAR */}
                        {isCaaActive && (
                          <div
                            id={`caa-layer-${tercet.id}`}
                            className={`p-4 rounded-md border-[0.5px] text-left mt-4 transition-all ${
                              isDarkMode ? "bg-stone-900/50 border-stone-800" : "bg-neutral-50/80 border-stone-250 shadow-inner"
                            }`}
                          >
                            {/* Italian Simplification sentence */}
                            <p className={`font-medium mb-3 italic ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"} ${zoomStyles.caaText}`}>
                              {t(tercet.caaSimplifiedText, tercet.caaSimplifiedText)}
                            </p>

                            {/* Symbol Grid mapping cards */}
                            <div className="flex flex-wrap gap-2.5 pt-1">
                              {tercet.caaSymbols.map((sym, symIdx) => {
                                // Color define depending on type of grammar block - customized to keep feeling/action in color and others in grayscale
                                let typeBg = "";
                                let typeText = "";

                                const isColorful = sym.type === "feeling" || sym.type === "action";

                                if (isColorful) {
                                  if (!isDarkMode) {
                                    // In Light mode: feeling and action look exactly like "DANTE character" (warm orange palette)
                                    typeBg = "border-orange-300 bg-orange-50/50";
                                    typeText = "text-orange-800";
                                  } else {
                                    // In Dark mode: text and border get the coordinated crimson/red theme (#a4161a)
                                    typeBg = "border-[#a4161a]/40 bg-[#a4161a]/15";
                                    typeText = "text-[#f26466]";
                                  }
                                } else {
                                  // Grayscale for character, setting, concept: border matches text color
                                  if (!isDarkMode) {
                                    typeBg = "border-stone-300 bg-stone-100/30";
                                    typeText = "text-stone-500";
                                  } else {
                                    // Dark mode: text is a lighter tone (text-stone-300) and border matches it exactly (border-stone-300)
                                    typeBg = "border-stone-400/30 bg-stone-900/40";
                                    typeText = "text-stone-300";
                                  }
                                }

                                return (
                                  <div
                                    key={symIdx}
                                    className={`px-2 py-1.5 rounded-md border-[0.5px] flex items-center space-x-2 shadow-sm transition-transform hover:scale-105 duration-200 ${typeBg}`}
                                  >
                                    <span className="text-xl shrink-0 grayscale opacity-80" role="img" aria-label={sym.word}>
                                      {sym.symbol}
                                    </span>
                                    <div className="flex flex-col">
                                      <span className={`text-xs font-mono font-bold leading-none uppercase ${typeText}`}>
                                        {sym.word}
                                      </span>
                                      <span className={`text-[10px] uppercase ${isDarkMode ? "text-stone-500" : "text-[#161a1d]"}`}>
                                        {t(sym.type, sym.type)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.5 DEDICATED AUDIO SUPPORT & READ-ALOUD PLAYER (UDL MULTIMODAL ENGAGEMENT) - DEPRECATED FROM BOTTOM, INTEGRATED DIRECTLY TO THE CANTO VIEWER */}
      {false && (
      <section
        id="audio-support-section"
        className={`py-12 sm:py-20 border-t ${
          isDarkMode
            ? "bg-[#0b090a] border-stone-900 text-stone-100"
            : "bg-stone-50 border-gray-200 text-stone-900"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-mono tracking-widest text-[#a4161a] uppercase font-bold block">
                {t("MULTIMODALITÀ & ACCESSIBILITÀ UDL", "UDL MULTIMODALITY & ACCESSIBILITY")}
              </span>
              <h2 className={`font-serif tracking-tight font-extrabold flex items-center gap-2.5 ${zoomStyles.titleSec}`}>
                <Headphones className="text-[#a4161a]" size={24} />
                {t("Supporto Audio & Voce Narrante", "Audio Support & Narrator Voice")}
              </h2>
              <p className={`text-xs sm:text-sm max-w-2xl font-light ${isDarkMode ? "text-stone-300" : "text-stone-600"}`}>
                {t(
                  "Ascolta la lettura dei versi originali interpretati con intonazione classica o la comoda spiegazione in prosa (parafrasi). Regola la velocità secondo le tue esigenze di apprendimento e segui il testo evidenziato.",
                  "Listen to the reading of the original verses interpreted with classical intonation or the comfortable prose explanation (paraphrase). Adjust the speed to your learning needs and follow the highlighted text."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Box: Player Deck and Custom Controls */}
            <div className={`col-span-1 lg:col-span-12 xl:col-span-5 p-6 rounded-xl border flex flex-col justify-between ${
              isDarkMode 
                ? "bg-stone-900/40 border-stone-800" 
                : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div className="space-y-6">
                {/* Selector for Canto */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 block">
                    {t("1. Seleziona il Canto", "1. Select the Canto")}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {cantiData.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAudioCantoIndex(idx)}
                        className={`py-2 rounded text-xs font-mono font-bold uppercase transition-all flex flex-col items-center justify-center border ${
                          audioCantoIndex === idx
                            ? "bg-[#a4161a] text-white border-[#a4161a] shadow-sm"
                            : isDarkMode
                            ? "bg-stone-850 hover:bg-stone-800 text-stone-400 border-stone-800"
                            : "bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-250"
                        }`}
                        title={`Canto ${c.romanNumeral}`}
                      >
                        <span className="text-[9px] opacity-70">Canto</span>
                        <span className="font-serif italic text-sm">{c.romanNumeral}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Track Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 block">
                    {t("2. Scegli il Contenuto", "2. Choose Content Type")}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAudioTrackType("original")}
                      className={`flex-1 py-3 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                        audioTrackType === "original"
                          ? isDarkMode
                            ? "bg-red-950/40 border-[#a4161a] text-white"
                            : "bg-red-50 border-[#a4161a] text-[#a4161a]"
                          : isDarkMode
                          ? "bg-stone-850/40 hover:bg-stone-800 text-stone-400 border-stone-800"
                          : "bg-stone-50 hover:bg-stone-100 text-[#161a1d] border-stone-200"
                      }`}
                    >
                      <span className="text-sm">🎙️</span>
                      <div className="text-left leading-tight">
                        <span className="block text-[11px] font-bold">{t("Versi Originali", "Original Verses")}</span>
                        <span className="block text-[9px] opacity-75 font-normal font-mono">Dante Alighieri</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setAudioTrackType("paraphrase")}
                      className={`flex-1 py-3 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                        audioTrackType === "paraphrase"
                          ? isDarkMode
                            ? "bg-red-955 border-[#a4161a] text-white"
                            : "bg-red-50 border-[#a4161a] text-[#a4161a]"
                          : isDarkMode
                          ? "bg-stone-850/40 hover:bg-stone-800 text-stone-400 border-stone-800"
                          : "bg-stone-50 hover:bg-stone-100 text-[#161a1d] border-stone-200"
                      }`}
                    >
                      <span className="text-sm">📖</span>
                      <div className="text-left leading-tight">
                        <span className="block text-[11px] font-bold">{t("Parafrasi & Spiegazione", "Paraphrase Translation")}</span>
                        <span className="block text-[9px] opacity-75 font-normal font-mono">Lettura in Prosa</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Main Player Display Card */}
                <div className={`p-4 rounded-lg border flex flex-col items-center justify-center relative overflow-hidden ${
                  isDarkMode ? "bg-stone-950/50 border-stone-800" : "bg-stone-50 border-stone-200"
                }`}>
                  <div className="absolute top-2 left-3 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#a4161a] font-bold">
                      {audioTrackType === "original" ? t("VOCE ATTORE", "VOICE ACTOR") : t("AUDIO STUDIO", "AUDIO STUDIO")}
                    </span>
                  </div>

                  <div className="absolute top-2 right-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#a4161a]/10 text-[#a4161a] font-bold">
                      Canto {cantiData[audioCantoIndex].romanNumeral}
                    </span>
                  </div>

                  {/* Visualizer animation when playing */}
                  <div className="h-12 flex items-end gap-1 px-4 mt-6">
                    {Array.from({ length: 15 }).map((_, waveIdx) => (
                      <div
                        key={waveIdx}
                        className={`w-0.5 max-w-[3px] bg-[#a4161a] rounded transition-all duration-300 ${
                          audioIsPlaying ? "animate-audio-bar" : "h-1.5 opacity-45"
                        }`}
                        style={{
                          animationDelay: `${waveIdx * 0.08}s`,
                          height: audioIsPlaying ? `${Math.floor(Math.random() * 28) + 6}px` : "6px"
                        }}
                      />
                    ))}
                  </div>

                  {/* Timing metrics */}
                  <div className="w-full flex items-center justify-between text-xs font-mono font-bold tracking-wider mt-4 px-2 opacity-80">
                    <span>
                      {Math.floor(audioElapsedSeconds / 60)}:{(audioElapsedSeconds % 60).toString().padStart(2, "0")}
                    </span>
                    <span className="opacity-50">/</span>
                    <span>
                      {Math.floor((cantiData[audioCantoIndex].tercets.length * 8) / 60)}:
                      {((cantiData[audioCantoIndex].tercets.length * 8) % 60).toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Scrubber track (Progress Bar) */}
                  <div className="w-full mt-2 px-1 relative">
                    <div 
                      className={`h-1.5 w-full rounded-full cursor-pointer relative ${
                        isDarkMode ? "bg-stone-800" : "bg-stone-250"
                      }`}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const percentage = clickX / rect.width;
                        const totalTerz = cantiData[audioCantoIndex].tercets.length;
                        const targetTercet = Math.floor(percentage * totalTerz);
                        seekAudioTercet(Math.max(0, Math.min(targetTercet, totalTerz - 1)));
                      }}
                    >
                      <div 
                        className="h-full bg-[#a4161a] rounded-full relative transition-all duration-300 animate-pulse"
                        style={{ width: `${audioProgress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#a4161a] rounded-full shadow-md" />
                      </div>
                    </div>
                  </div>

                  {/* Player controls */}
                  <div className="flex items-center gap-4 mt-6 animate-fade-in">
                    {/* Skip Previous */}
                    <button
                      onClick={() => seekAudioTercet(Math.max(0, audioCurrentTercetIdx - 1))}
                      disabled={audioCurrentTercetIdx === 0}
                      className={`p-2 rounded-full transition-all border ${
                        audioCurrentTercetIdx === 0
                          ? "opacity-30 cursor-not-allowed text-stone-500 border-transparent"
                          : isDarkMode
                          ? "hover:bg-stone-800 text-stone-200 border-stone-800"
                          : "hover:bg-stone-100 text-stone-700 border-stone-250"
                      }`}
                      title={t("Terzina Precedente", "Previous Tercet")}
                    >
                      <SkipBack size={15} />
                    </button>

                    {/* Master Play / Pause */}
                    <button
                      onClick={() => {
                        if (audioIsPlaying) {
                          pauseAudioCanto();
                        } else {
                          startAudioCanto();
                        }
                      }}
                      className="p-3.5 bg-[#a4161a] hover:bg-[#b52226] text-white rounded-full transition-all shadow-md shadow-[#a4161a]/25 focus:ring-4 focus:ring-[#a4161a]/30"
                      title={audioIsPlaying ? t("Pausa", "Pause") : t("Riproduci", "Play")}
                    >
                      {audioIsPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                    </button>

                    {/* Stop */}
                    <button
                      onClick={stopAudioCanto}
                      className={`p-2.5 rounded-full transition-all border ${
                        isDarkMode
                          ? "hover:bg-stone-800 text-stone-200 border-stone-80 border-stone-800"
                          : "hover:bg-stone-100 text-stone-700 border-stone-250"
                      }`}
                      title={t("Ferma e Resetta", "Stop & Reset")}
                    >
                      <Square size={14} fill="currentColor" />
                    </button>

                    {/* Skip Next */}
                    <button
                      onClick={() => seekAudioTercet(Math.min(cantiData[audioCantoIndex].tercets.length - 1, audioCurrentTercetIdx + 1))}
                      disabled={audioCurrentTercetIdx === cantiData[audioCantoIndex].tercets.length - 1}
                      className={`p-2 rounded-full transition-all border ${
                        audioCurrentTercetIdx === cantiData[audioCantoIndex].tercets.length - 1
                          ? "opacity-30 cursor-not-allowed text-stone-500 border-transparent"
                          : isDarkMode
                          ? "hover:bg-stone-800 text-stone-200 border-stone-800"
                          : "hover:bg-stone-100 text-stone-700 border-stone-250"
                      }`}
                      title={t("Terzina Successiva", "Next Tercet")}
                    >
                      <SkipForward size={15} />
                    </button>
                  </div>
                </div>

                {/* UDL Learning Speed Controls */}
                <div className="space-y-2 border-t pt-4 border-stone-800/10 dark:border-stone-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 block">
                      {t("Regolazione del Tempo (Sussidio UDL)", "Modulate Pace / Speed (UDL-Aid)")}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#a4161a]">
                      {audioSpeed}x ({audioSpeed === 0.75 ? t("Sotto-ritmo lento", "Slow assistance") : audioSpeed === 1.0 ? t("Ritmo standard", "Standard rhythm") : t("Rapido", "Sustained pace")})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[0.75, 1.0, 1.25].map((speedVal) => (
                      <button
                        key={speedVal}
                        onClick={() => changeAudioSpeed(speedVal)}
                        className={`flex-1 py-1.5 rounded font-mono text-xs font-bold transition-all border ${
                          audioSpeed === speedVal
                            ? "bg-[#a4161a]/10 border-[#a4161a] text-[#a4161a]"
                            : isDarkMode
                            ? "bg-stone-850/50 hover:bg-stone-800 text-stone-400 border-stone-800"
                            : "bg-stone-100/50 hover:bg-stone-200 text-stone-600 border-stone-250"
                        }`}
                      >
                        {speedVal === 0.75 ? "🐢 0.75x" : speedVal === 1.0 ? "🦊 1.0x" : "⚡ 1.25x"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* UDL Instructional Tip Card */}
              <div className={`mt-6 p-4 rounded-lg flex items-start gap-2.5 border leading-relaxed select-none ${
                isDarkMode 
                  ? "bg-[#1c0708]/30 border-red-900/20 text-stone-200" 
                  : "bg-red-50/40 border-red-200/50 text-stone-800"
              }`}>
                <Info size={14} className="text-[#a4161a] shrink-0 mt-0.5" />
                <p className="text-[11px] font-light leading-normal">
                  <strong className="font-semibold block text-[#a4161a] mb-0.5">
                    {t("Didattica Accessibile UDL:", "Accessible UDL Guidance:")}
                  </strong>
                  {t(
                    "Puoi cliccare su una qualsiasi delle terzine elencate nel lettore visivo a destra per attivare lo scorrimento interattivo assistito e focalizzare l'attenzione su quella precisa riga di versi.",
                    "You can click on any tercet box listed in the visual reader pane on the right to trigger active micro-scrolling assistance and focus attention on those specific lines."
                  )}
                </p>
              </div>
            </div>

            {/* Right Box: Transcripts & Auto-Active Text Highlights */}
            <div className="col-span-1 lg:col-span-12 xl:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 border-stone-200/30">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                  {t("3. Testo Sincronizzato con l'Audio", "3. Audio-Synced Interactive Transcription")}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {cantiData[audioCantoIndex].tercets.length} {t("terzine disponibili", "tercets available")}
                </span>
              </div>

              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 no-scrollbar">
                {cantiData[audioCantoIndex].tercets.map((tercet, tercIdx) => {
                  const isActive = audioCurrentTercetIdx === tercIdx;
                  return (
                    <div
                      key={tercet.id}
                      onClick={() => seekAudioTercet(tercIdx)}
                      className={`p-4 rounded-lg cursor-pointer transition-all border relative group ${
                        isActive
                          ? isDarkMode
                            ? "bg-red-950/25 border-[#a4161a] shadow-md shadow-[#a4161a]/5"
                            : "bg-[#a4161a]/5 border-[#a4161a]/40 shadow-sm"
                          : isDarkMode
                          ? "bg-stone-900/10 hover:bg-stone-900/40 border-stone-850 hover:border-stone-800"
                          : "bg-white hover:bg-stone-100/50 border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      {/* Active indicator badge */}
                      {isActive && (
                        <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[#a4161a] font-mono text-[9px] font-bold">
                          <span>{t("NARRANDO", "PLAYING")}</span>
                          <Volume2 size={11} className="animate-bounce" />
                        </div>
                      )}

                      {!isActive && (
                        <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 font-mono text-[9px]">
                          <span>click to hear</span>
                        </div>
                      )}

                      {/* Line numbering on top left */}
                      <span className="text-[10px] font-mono text-stone-500 font-bold block mb-2">
                        {t("TERZINA", "TERCET")} {tercIdx + 1}
                      </span>

                      {/* Original Verses */}
                      {audioTrackType === "original" ? (
                        <div className="space-y-1.5 pl-4 border-l-2 border-[#a4161a]/30">
                          {tercet.verses.map((v, i) => (
                            <p
                              key={i}
                              className={`font-serif leading-relaxed italic ${
                                isActive 
                                  ? "text-sm sm:text-base font-bold text-[#a4161a]" 
                                  : isDarkMode 
                                  ? "text-stone-300 text-xs sm:text-sm" 
                                  : "text-stone-800 text-xs sm:text-sm"
                              }`}
                            >
                              {v.text}
                              {v.lineNumber && (
                                <span className="font-mono text-[10px] text-stone-400 ml-2 italic">
                                  [{v.lineNumber}]
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
                      ) : (
                        /* Paraphrase Text */
                        <div className="pl-4 border-l-2 border-emerald-600/30">
                          <p
                            className={`font-sans leading-relaxed text-xs sm:text-sm ${
                              isActive
                                ? "font-semibold text-[#a4161a]"
                                : isDarkMode
                                ? "text-stone-400"
                                : "text-stone-600"
                            }`}
                          >
                            {currentLang === "it"
                              ? tercet.paraphraseText
                              : (tercet.caaSimplifiedText || tercet.paraphraseText)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 8. KNOWLEDGE QUIZ SECTION AT THE BOTTOM */}
      <section
        id="quiz-section"
        className={`py-12 sm:py-20 border-t ${
          isDarkMode ? "bg-[#0B090A] border-[#161a1d]" : "bg-stone-50 border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className={`font-serif tracking-tight font-extrabold ${zoomStyles.titleSec}`}>
              {t("Verifica delle Conoscenze", "Knowledge Validation Quiz")}
            </h2>
            <p className={`text-xs sm:text-sm font-light max-w-xl mx-auto uppercase tracking-wider font-mono ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
              {t("Mettiti alla Prova", "Test Your Knowledge")}
            </p>
          </div>

          {/* Interactive Quiz Canvas */}
          <div
            className={`p-6 rounded-lg border-[0.5px] focus-within:ring-1 focus-within:ring-[#a4161a] ${
              isDarkMode ? "bg-stone-900/50 border-stone-800" : "bg-neutral-50/80 border-stone-250 shadow-inner"
            }`}
          >
            <div className="space-y-6">
              {/* Question Progress Header */}
              <div className={`flex items-center justify-center border-b-[0.5px] pb-4 ${
                isDarkMode ? "border-stone-800" : "border-stone-250"
              }`}>
                <span className={`px-3.5 py-2.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-default border-[0.5px] ${
                  isDarkMode 
                    ? "bg-stone-900/50 text-[#a4161a] border-stone-800" 
                    : "bg-stone-200/50 text-[#a4161a] border-stone-250"
                }`}>
                  {t("Domanda", "Question")} {activeQuestionIndex + 1} di {currentQuizQuestions.length}
                </span>
              </div>

              {/* Active Question Render */}
              {(() => {
                const q = currentQuizQuestions[activeQuestionIndex];
                const hasSelected = userAnswers[q.id] !== undefined;
                const isSubmitted = submittedQuestions[q.id];
                const selectedAns = userAnswers[q.id];

                return (
                  <div className="space-y-5 animate-fade-in" key={q.id}>
                    <h4 className={`text-sm sm:text-base md:text-lg font-serif font-bold leading-snug ${isDarkMode ? "text-stone-100" : "text-[#161a1d]"}`}>
                      {t(q.question, q.questionEn)}
                    </h4>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isThisSelected = selectedAns === oIdx;
                        const isThisCorrect = q.correctAnswerIndex === oIdx;
                        let optionStyle = isDarkMode
                          ? "bg-stone-900/60 border-stone-800 border-[0.5px] text-stone-300 hover:bg-stone-850 cursor-pointer"
                          : "bg-stone-100 border-stone-250 border-[0.5px] text-[#161a1d] hover:bg-stone-150 cursor-pointer";

                        if (isThisSelected) {
                          optionStyle = isDarkMode
                            ? "bg-stone-800/80 border-stone-600 border-[0.5px] text-stone-100 font-bold shadow-sm"
                            : "bg-stone-300 border-stone-500 border-2 text-stone-950 font-bold shadow-sm";
                        }
                        if (isSubmitted) {
                          if (isThisCorrect) {
                            optionStyle = "bg-emerald-950/20 border-emerald-500 border-[1.5px] text-emerald-400 font-bold cursor-not-allowed";
                          } else if (isThisSelected) {
                            optionStyle = "bg-rose-950/20 border-rose-500 border-[1.5px] text-rose-400 font-bold cursor-not-allowed";
                          } else {
                            optionStyle = "opacity-45 border-stone-900/10 border-[0.5px] cursor-not-allowed text-stone-500";
                          }
                        }

                        let circleStyle = "bg-stone-950/40 text-[#a4161a]";
                        if (isThisSelected) {
                          circleStyle = isDarkMode ? "bg-[#a4161a] text-black" : "bg-[#a4161a] text-white";
                        }

                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleAnswerSelect(q.id, oIdx)}
                            className={`p-3.5 rounded text-xs sm:text-sm transition-all flex items-start gap-2.5 ${optionStyle}`}
                          >
                            <span className={`font-mono text-xs sm:text-xs font-bold shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full transition-colors ${circleStyle}`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="leading-snug">{t(opt, q.optionsEn[oIdx])}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit check & Feedback per question */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {isSubmitted ? (
                        <div
                          className={`p-3 rounded-md text-xs leading-relaxed flex items-start gap-2 border flex-1 ${
                            selectedAns === q.correctAnswerIndex
                              ? "bg-emerald-950/15 border-emerald-900/40 text-emerald-400"
                              : "bg-rose-950/15 border-rose-900/40 text-rose-400"
                          }`}
                        >
                          {selectedAns === q.correctAnswerIndex ? (
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                          ) : (
                            <XCircle size={15} className="mt-0.5 shrink-0" />
                          )}
                          <p>
                            <strong>
                              {selectedAns === q.correctAnswerIndex
                                ? t("Ottimo lavoro!", "Wonderful job!")
                                : t("Riprova per imparare!", "Try again to learn!")}
                            </strong>{" "}
                            {t(q.feedback, q.feedbackEn)}
                          </p>
                        </div>
                      ) : activeQuestionIndex === currentQuizQuestions.length - 1 ? (
                        <button
                          onClick={submitAllQuiz}
                          disabled={!hasSelected}
                          className={`px-5 py-3 rounded text-xs uppercase font-mono font-bold tracking-wider leading-none transition-all w-full sm:w-auto ${
                            hasSelected
                              ? isDarkMode
                                ? "bg-[#a4161a] text-white hover:bg-[#e5383b] shadow-md shadow-[#a4161a]/25"
                                : "bg-[#a4161a] text-white hover:bg-[#800f14] shadow-md shadow-[#a4161a]/15"
                              : isDarkMode
                                ? "bg-stone-900 border border-stone-850 text-stone-500 cursor-not-allowed"
                                : "bg-stone-200 border border-stone-300 text-stone-400 cursor-not-allowed font-extrabold"
                          }`}
                        >
                          {t("VERIFICA", "SUBMIT QUIZ")}
                        </button>
                      ) : (
                        <div className="flex-1 hidden sm:block" />
                      )}

                      {/* Carousel Controls: Precedente & Successivo */}
                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
                        <button
                          onClick={() => setActiveQuestionIndex(p => Math.max(0, p - 1))}
                          disabled={activeQuestionIndex === 0}
                          className={`px-3.5 py-2.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                            activeQuestionIndex === 0
                              ? "opacity-35 cursor-not-allowed text-stone-600"
                              : isDarkMode
                                ? "bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                                : "bg-stone-200 hover:bg-stone-255 text-stone-700 border border-gray-300"
                          }`}
                        >
                          {t("← Prec.", "← Prev")}
                        </button>
                        <button
                          onClick={() => setActiveQuestionIndex(p => Math.min(currentQuizQuestions.length - 1, p + 1))}
                          disabled={activeQuestionIndex === currentQuizQuestions.length - 1}
                          className={`px-3.5 py-2.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                            activeQuestionIndex === currentQuizQuestions.length - 1
                              ? "opacity-35 cursor-not-allowed text-stone-600"
                              : isDarkMode
                                ? "bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                                : "bg-stone-200 hover:bg-stone-255 text-stone-700 border border-gray-300"
                          }`}
                        >
                          {t("Succ. →", "Next →")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Scoreboard summary */}
            {Object.keys(submittedQuestions).length === currentQuizQuestions.length && (
              <div className="mt-8 p-6 rounded bg-[#a4161a]/10 border border-[#a4161a]/30 text-center space-y-4">
                <Award size={40} className="mx-auto text-[#e5383b] animate-bounce" />
                <h4 className={`text-lg font-serif font-bold ${isDarkMode ? "text-stone-200" : "text-[#161a1d]"}`}>
                  {t("Quiz Completato!", "Quiz Completed!")}
                </h4>
                <p className="text-xl sm:text-2xl font-mono font-bold text-[#e5383b]">
                  {score} / {currentQuizQuestions.length} Punti
                </p>
                <p className={`text-xs max-w-md mx-auto ${isDarkMode ? "text-stone-400" : "text-[#161a1d]"}`}>
                  {score === 5
                    ? t("Incredibile! Hai dimostrato una conoscenza perfetta del cammino dantesco. Le stelle ti sorridono!", "Incredibly done! Perfect knowledge of Dante's journey. The stars smile upon you!")
                    : t("Ben fatto! La Divina Commedia è un capolavoro da scoprire passo dopo passo. Ripassa i cantoni e ritenta!", "Well and bravely done! The Divine Comedy is a masterpiece, learned step by step. Have another look and try again!")}
                </p>
                <button
                  onClick={resetQuiz}
                  className={`px-5 py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 mx-auto ${
                    isDarkMode
                      ? "bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                      : "bg-black hover:bg-stone-800 text-white border border-black"
                  }`}
                >
                  <RotateCcw size={12} />
                  {t("Ricomincia", "Retry Quiz")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. VISITA IL DANTE EXPLORER FOOTER CTA WITH INTERACTIVE ATLAS MODAL */}
      <section className="py-12 sm:py-20 text-center relative overflow-hidden bg-gradient-to-b from-[#0b090a] to-[#120406]/90 border-t border-[#a4161a]/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
          <h2 className={`font-serif tracking-tight font-extrabold text-white leading-none ${zoomStyles.titleSec}`}>
            {t("Il Cammino delle stelle", "The Path of the Stars")}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed">
            {t(
              "Un viaggio interattivo nell’Inferno.",
              "An interactive journey through Inferno."
            )}
            <br />
            {t(
              "Progettato per superare i limiti didattici astratti.",
              "Designed to overcome abstract educational limits."
            )}
          </p>
          <a
            href="https://il-cammino-delle-stelle-2.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4.5 rounded bg-gradient-to-r from-[#a4161a] to-[#e5383b] hover:from-[#e5383b] hover:to-[#f5f3f4] hover:text-stone-950 hover:shadow-xl hover:shadow-[#a4161a]/15 text-white font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 inline-flex items-center gap-2 mx-auto"
          >
            <Compass size={16} />
            <span>{t("ESPLORA", "EXPLORE")}</span>
          </a>
        </div>
      </section>

      {/* 10. FOOTER CARDS LINKING TO DIFFERENT CANTOS/SECTIONS */}
      <footer
        className={`py-12 border-t transition-colors ${
          isDarkMode ? "bg-stone-950 border-stone-900 text-stone-500" : "bg-white border-gray-300 text-gray-750"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Title before the cards */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#a4161a] uppercase tracking-wider">
              {t("Approfondiamo!", "Let's Deepen!")}
            </h3>
          </div>

          {/* Quick links footer cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => scrollToSection("dante-section")}
              className={`p-4 rounded border transition-all cursor-pointer select-none flex flex-col justify-between ${
                isDarkMode ? "bg-stone-900/40 border-stone-850 hover:border-[#a4161a]/40" : "bg-neutral-50 border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#a4161a] uppercase font-bold">Bio 01</span>
                <p className="text-xs sm:text-sm font-serif font-bold text-stone-300 hover:text-[#e5383b]">
                  {selectedDisciplina === "Italiano" ? t("Dante Alighieri", "Biography of Dante") : t(`Biografia di ${currentBio.name}`, `Biography of ${currentBio.name}`)}
                </p>
              </div>
              <ChevronRight size={14} className="self-end hover:translate-x-1 transition-transform mt-3" />
            </div>

            {selectedDisciplina === "Italiano" ? (
              <>
                <div
                  onClick={() => {
                    setSelectedCantoIndex(0);
                    scrollToSection("canti-explorer-section");
                  }}
                  className={`p-4 rounded border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isDarkMode ? "bg-stone-900/40 border-stone-850 hover:border-[#a4161a]/40" : "bg-neutral-50 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#a4161a] uppercase font-bold">Canto I - II</span>
                    <p className="text-xs sm:text-sm font-serif font-bold text-stone-300 hover:text-[#e5383b]">{t("Selva e Beatrice", "Forest & Beatrice")}</p>
                  </div>
                  <ChevronRight size={14} className="self-end hover:translate-x-1 transition-transform mt-3" />
                </div>

                <div
                  onClick={() => {
                    setSelectedCantoIndex(2);
                    scrollToSection("canti-explorer-section");
                  }}
                  className={`p-4 rounded border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isDarkMode ? "bg-stone-900/40 border-stone-850 hover:border-[#a4161a]/40" : "bg-neutral-50 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#a4161a] uppercase font-bold">Canto III - IV</span>
                    <p className="text-xs sm:text-sm font-serif font-bold text-stone-300 hover:text-[#e5383b]">{t("Caronte e Limbo", "Charon & Limbo")}</p>
                  </div>
                  <ChevronRight size={14} className="self-end hover:translate-x-1 transition-transform mt-3" />
                </div>

                <div
                  onClick={() => {
                    setSelectedCantoIndex(4);
                    scrollToSection("canti-explorer-section");
                  }}
                  className={`p-4 rounded border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isDarkMode ? "bg-stone-900/40 border-stone-850 hover:border-[#a4161a]/40" : "bg-neutral-50 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#a4161a] uppercase font-bold">Canto V</span>
                    <p className="text-xs sm:text-sm font-serif font-bold text-stone-300 hover:text-[#e5383b]">{t("Paolo e Francesca", "Paolo and Francesca")}</p>
                  </div>
                  <ChevronRight size={14} className="self-end hover:translate-x-1 transition-transform mt-3" />
                </div>
              </>
            ) : (
              currentCanti.slice(0, 3).map((c: any, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCantoIndex(index);
                    scrollToSection("canti-explorer-section");
                  }}
                  className={`p-4 rounded border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isDarkMode ? "bg-stone-900/40 border-stone-850 hover:border-[#a4161a]/40" : "bg-neutral-50 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#a4161a] uppercase font-bold">
                      {t("Lezione", "Lesson")} {c.romanNumeral || (index + 1)}
                    </span>
                    <p className="text-xs sm:text-sm font-serif font-bold text-stone-305 hover:text-[#e5383b]">
                      {t(c.title, c.titleEn)}
                    </p>
                  </div>
                  <ChevronRight size={14} className="self-end hover:translate-x-1 transition-transform mt-3" />
                </div>
              ))
            )}
          </div>

          {/* Center alignment of Go to Top */}
          <div className="flex justify-center py-2">
            <span
              className="hover:text-[#e5383b] transition-colors cursor-pointer select-none text-xs font-mono font-bold flex items-center gap-1.5"
              onClick={() => scrollToSection("hero-section")}
            >
              🚀 {t("Torna all'Inizio", "Go to Top")}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left border-t border-stone-850 transition-colors pt-6 text-[11px] font-mono text-stone-450">
            <div>
              <p>© 2026 {t("Metamodello Didattico Inclusivo", "Inclusive Learning Metamodel")}</p>
              <p className="text-stone-500 font-light text-[9px] mt-0.5">{t("Basato sull'UDL (Universal Design for Learning) e Scala SAMR", "Based on UDL (Universal Design for Learning) & SAMR Scale")}</p>
            </div>
            <div className="flex space-x-4">
              <span className={`transition-colors select-none text-xs sm:text-sm ${isDarkMode ? "text-stone-400" : "text-stone-650"}`}>
                {t("© 2026 Claudia La Perna. Tutti i diritti riservati", "© 2026 Claudia La Perna. All rights reserved")}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- EXTRA: DANTE BIOGRAPHY CONCEPT DETAILED MODAL --- */}
      {selectedConceptIndex !== null && (() => {
        const isSimplifiedMode = isCaaActive;
        const conceptDeepDives = [
          {
            title: "L'esilio politico",
            titleEn: "Political Exile",
            desc: isSimplifiedMode ? (
              "Dante viveva a Firenze molti anni fa. In quel periodo c'erano forti litigi tra diversi gruppi politici. Dante faceva parte di un gruppo moderato chiamato 'Guelfi Bianchi'.\n\nNel 1302 i suoi nemici politici presero il controllo della città. Accusarono Dante ingiustamente e lo condannarono all'esilio: non poteva più tornare a casa, altrimenti sarebbe stato ucciso.\n\nDante fu costretto a viaggiare di città in città per 19 anni fino alla fine della sua vita. Questo grande dolore lo spinse a scrivere la Divina Commedia per cercare giustizia."
            ) : (
              "Dante visse in un periodo di forti scontri a Firenze tra Guelfi (favorevoli al Papa) e Ghibellini (favorevoli all'Imperatore). Successivamente, i Guelfi si divisero a loro volta in Bianchi (più moderati, fazione a cui apparteneva Dante) e Neri (estremisti alleati del Papa Bonifacio VIII).\n\nNel 1302, mentre Dante si trovava a Roma in ambasceria, la fazione dei Neri prese il controllo di Firenze. Dante fu accusato ingiustamente di corruzione e baratteria. Viene condannato all'esilio perpetuo e alla morte sul rogo se fosse rientrato in patria.\n\nIniziò così un doloroso esilio durato 19 anni. Dante peregrinò tra diverse corti dell'Italia settentrionale (Verona, la Lunigiana e infine Ravenna). Questa esperienza profonda influenzò tutta la Divina Commedia: nel poema traspare un'immensa ricerca di giustizia universale, e molti personaggi incontrati profetizzano l'esilio di Dante, tra cui il suo antenato Cacciaguida nel XVII canto del Paradiso."
            ),
            descEn: isSimplifiedMode ? (
              "Dante lived in Florence many years ago. At that time, there were big fights between political groups. Dante belonged to a moderate group called the 'White Guelphs'.\n\nIn 1302, his political enemies took power. They falsely accused Dante and banished him: he could never return home, or he would be killed.\n\nDante had to travel from city to city for 19 years until the end of his life. This great sadness inspired him to write the Divine Comedy to seek justice."
            ) : (
              "Dante lived during a time of intense conflict in Florence between Guelphs (supporting the Pope) and Ghibellines (supporting the Emperor). Later, the Guelphs split into White Guelphs (moderates, Dante's faction) and Black Guelphs (radical supporters of Pope Boniface VIII).\n\nIn 1302, while Dante was on a diplomatic delegation in Rome, the Black Guelphs seized power. Dante was falsely accused of corruption and graft, and was sentenced to perpetual exile and death by fire if he ever returned.\n\nThis started a painful 19-year exile. Dante wandered through northern Italian courts (Verona, Lunigiana, and Ravenna). This profound experience shaped the entire Divine Comedy: the poem is fueled by a desperate search for universal justice, and several characters prophecised Dante's exile, notably his ancestor Cacciaguida in Paradiso XVII."
            )
          },
          {
            title: "Beatrice, la Musa",
            titleEn: "Beatrice, the Muse",
            desc: isSimplifiedMode ? (
              "Beatrice era una donna realmente esistita che Dante amò moltissimo, ma in modo puro e spirituale. La incontrò la prima volta quando avevano solo nove anni.\n\nBeatrice morì giovanissima, lasciando Dante in un grandissimo dolore. Per ricordarla, Dante scrisse una raccolta di poesie intitolata 'Vita Nuova'.\n\nNella Divina Commedia, Beatrice non è solo una donna amata, ma diventa il simbolo della fede e dell'aiuto di Dio. È lei che manda Virgilio a salvare Dante e che lo accompagna in Paradiso fino alla fine del viaggio."
            ) : (
              "Beatrice Portinari fu l'ispiratrice assoluta della produzione letteraria di Dante. Il poeta la incontrò per la prima volta quando avevano entrambi solo nove anni, e una seconda volta nove anni dopo, rimanendone conquistato da un amore puramente spirituale ed eterno.\n\nLa morte prematura di Beatrice nel 1290 gettò Dante in una profonda crisi personale e filosofica. Nella celebre opera 'Vita Nuova', Dante raccoglie le rime d'amore per lei e promette solennemente di scrivere su di lei ciò che non fu mai scritto per nessuna altra donna.\n\nNella Divina Commedia, Beatrice viene ritratta non più solo come una musa terrena, ma come il simbolo e lo strumento della Grazia divina, della Fede e della Teologia. È lei che scende nel Limbo per chiedere a Virgilio di soccorrere Dante, ed è lei stessa che assumerà il ruolo di guida celeste nel Paradiso terrestre e celeste, conducendo il poeta oltre i limiti terreni della ragione umana."
            ),
            descEn: isSimplifiedMode ? (
              "Beatrice was a real woman whom Dante loved deeply, in a pure and spiritual way. He met her for the first time when they were both nine years old.\n\nBeatrice died very young, leaving Dante in deep grief. To remember her, Dante wrote a collection of poems called 'Vita Nuova'.\n\nIn the Divine Comedy, Beatrice is not just a beloved woman, but becomes the symbol of faith and God's grace. She sends Virgil to rescue Dante and guides him through Heaven."
            ) : (
              "Beatrice Portinari was the absolute inspiration of Dante's literary universe. The poet met her for the first time when they were both nine years old, and a second time nine years later, capturing him in a purely spiritual and eternal love.\n\nBeatrice's early death in 1290 plunged Dante into a deep personal and philosophical crisis. In his famous work 'Vita Nuova', Dante compiled love poetry for her and solemnly vowed to write about her what had never been written about any other woman.\n\nIn the Divine Comedy, Beatrice is depicted not merely as an earthly muse, but as the supreme symbol of Divine Grace, Faith, and Theology. It is she who descends to Limbo to ask Virgil to rescue Dante, and she who guides the poet through the high spheres of Purgatory and Paradiso beyond human reason."
            )
          },
          {
            title: "La lingua del popolo",
            titleEn: "The Vernacular",
            desc: isSimplifiedMode ? (
              "Nel Medioevo i libri importanti venivano scritti solo in latino, una lingua difficile che solo poche persone ricche e istruite sapevano leggere.\n\nDante decise di fare una scelta rivoluzionaria: scrisse la Divina Commedia in 'volgare', cioè la lingua parlata tutti i giorni dal popolo di Firenze.\n\nDante voleva che tutti potessero capire le sue storie. Usò parole semplici, ma anche parole eleganti e inventò nuovi termini. Grazie a questa scelta, Dante ha creato le basi della lingua italiana che usiamo oggi."
            ) : (
              "Nel Medioevo tutte le opere letterarie ufficiali e accademiche e gli scritti dottrinali venivano composti rigorosamente in latino, lingua dell'élite colta che escludeva la quasi totalità della popolazione comune.\n\nDante compì una scelta rivoluzionaria: decise di redigere la Divina Commedia in 'volgare' (l'italiano fiorentino parlato quotidianamente, opportunamente raffinato). Egli sostenne con forza che la lingua materna possiede una naturale nobiltà ed è perfettamente capace di comunicare verità spirituali ed elevatissime.\n\nQuesta scelta democratizzò la cultura e la letteratura, rendendole accessibili anche al popolo. Per ritrarre ogni sfaccettatura del mondo - dalla bassezza infernale alla sublimità divina - Dante adoperò il 'plurilinguismo', coniugando vocaboli umili, suoni aspri, latinismi colti e neologismi celestiali, gettando le fondamenta della moderna lingua italiana."
            ),
            descEn: isSimplifiedMode ? (
              "In the Middle Ages, important books were written only in Latin, a difficult language that only rich, educated people could read.\n\nDante made a revolutionary choice: he wrote the Divine Comedy in the 'vernacular', which was the everyday language spoken by common people in Florence.\n\nDante wanted everyone to understand his stories. He used common words, elegant words, and invented new terms. Thanks to this choice, Dante laid the foundations of the Italian language we use today."
            ) : (
              "During the Middle Ages, all official academic and literary masterpieces were written strictly in Latin, the language of the educated elite, leaving out the vast majority of common people.\n\nDante made a revolutionary choice: he decided to write the Divine Comedy in the 'vernacular' (the Florentine everyday language, beautifully refined). He strongly asserted that the native tongue has local nobility and is perfectly capable of conveying high spiritual and philosophical realities.\n\nThis decision democratized culture and literature, opening them to everyone. To portray all facets of the universe - from the harshness of Inferno to the sublimity of Heaven - Dante pioneered 'plurilingualism', weaving humble words, harsh sounds, academic Latinisms, and celestial neologisms, laying the foundations for the modern Italian language."
            )
          }
        ];
        const concept = (selectedConceptIndex !== null && selectedDisciplina === "Italiano"
          ? conceptDeepDives[selectedConceptIndex]
          : currentBio.keyConcepts[selectedConceptIndex]) || { title: "", titleEn: "", desc: "", descEn: "" };
        return (
          <div
            id="dante-concept-dialog"
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 top-[57px] sm:top-[65px] z-50 flex items-start justify-center p-6 sm:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <div
              className={`w-full max-w-lg rounded-lg border-[0.5px] text-left shadow-2xl relative flex flex-col my-8 ${
                isDarkMode ? "bg-stone-950 border-stone-800 text-stone-300" : "bg-white border-stone-300 text-gray-850"
              }`}
            >
              {/* Elegant Top Right Close "X" Button */}
              <button
                onClick={() => setSelectedConceptIndex(null)}
                className={`absolute top-4 right-4 p-1.5 rounded-full transition-all border ${
                  isDarkMode 
                    ? "border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white bg-stone-900/80" 
                    : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100"
                }`}
                aria-label={t("Chiudi", "Close")}
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="p-6 pb-3 border-b border-stone-850/10 pr-10">
                <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#a4161a] font-bold block mb-1">
                  {t("Scheda di Approfondimento", "In-Depth Topic Summary")}
                </span>
                <h3 className={`text-lg sm:text-xl font-serif font-bold ${isDarkMode ? "text-stone-200" : "text-[#161a1d]"}`}>
                  0{selectedConceptIndex + 1}. {t(concept.title, concept.titleEn)}
                </h3>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh] text-sm sm:text-base leading-relaxed font-light no-scrollbar">
                {t(concept.desc, concept.descEn).split('\n\n').map((paragraph, index) => (
                  <p key={index} className={isDarkMode ? "text-stone-305" : "text-stone-800"}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- A0. PEDAGOGICAL STATEMENT & UDL DETAILED MODAL ("IL CAMMINO DELLE STELLE") --- */}
      {isUdlModalOpen && (
        <div
          id="udl-pedagogical-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
        >
          <div
            className={`w-full max-w-4xl rounded-xl border-2 text-left shadow-2xl relative flex flex-col max-h-[85vh] transition-all duration-300 ${
              isDarkMode 
                ? "bg-stone-950 border-stone-800 text-[#f5f3f4]" 
                : "bg-[#fcfbf9] border-stone-300 text-stone-850"
            }`}
          >
            {/* Elegant, Accessible Top Right Close "X" Button */}
            <button
              onClick={() => setIsUdlModalOpen(false)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-all border z-10 ${
                isDarkMode 
                  ? "border-stone-800 hover:border-stone-750 text-stone-400 hover:text-white bg-stone-900/80" 
                  : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100"
              }`}
              aria-label={t("Chiudi", "Close")}
            >
              <X size={16} />
            </button>

            {/* Locked Header */}
            <div className={`p-6 sm:p-8 pb-4 border-b ${isDarkMode ? "border-stone-850" : "border-stone-200"}`}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a4161a] font-bold block mb-1">
                {t("CORNICE PEDAGOGICA & ACCESSIBILITÀ", "PEDAGOGICAL FRAMEWORK & ACCESSIBILITY")}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                {t("Metamodello Didattico d'Inclusione", "Inclusive Educational Metamodel")}
              </h3>
              <p className={`text-xs mt-1 font-mono tracking-wider ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>
                {t("IL CAMMINO DELLE STELLE ★ COSTRUTTO UDL & LIVELLO SAMR REDEFINITION", "THE PATH OF THE STARS ★ UDL CONSTRUCT & SAMR REDEFINITION")}
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 pr-4 sm:pr-8">
              
              {/* Proposta di Progetto Spot */}
              <div className={`p-5 rounded-lg border-l-4 ${
                isDarkMode 
                  ? "bg-stone-900/40 border-[#a4161a] border-y border-r border-stone-850" 
                  : "bg-stone-100/50 border-[#a4161a] border-y border-r border-stone-200"
              }`}>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#a4161a] mb-2 flex items-center gap-1.5">
                  <Award size={14} />
                  {t("Proposta di Progetto", "Project Proposal")}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-serif italic text-stone-800 dark:text-stone-200">
                  {t(
                    "Sviluppo del metamodello didattico “Il Cammino delle Stelle”, progettato per l'inclusione di alunni con BES, DSA e disabilità nella Scuola Secondaria di I grado, ispirato alla normativa sulla Differenziazione Didattica (D.M. 5669/2011), ai tre principi UDL (Universal Design for Learning) e al livello massimo (Redefinition) del modello SAMR.",
                    "Development of the educational metamodel 'The Path of the Stars', designed for the inclusion of pupils with SEN (Special Educational Needs), SLD (Specific Learning Disorders), and disabilities in Lower Secondary School. It is inspired by regulations on Didactic Differentiation (D.M. 5669/2011), the three principles of UDL (Universal Design for Learning), and the highest level (Redefinition) of the SAMR model."
                  )}
                </p>
              </div>

              {/* Introduzione */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold opacity-80 flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <Info size={14} className="text-[#a4161a]" />
                  {t("Introduzione", "Introduction")}
                </h4>
                <div className={`text-xs sm:text-sm leading-relaxed space-y-3 ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                  <p>
                    {t(
                      "Quando si parla di accessibilità digitale, si pensa subito alla struttura, ai testi o ai contenuti multimediali. Tuttavia, anche il design visivo – cioè l’insieme di colori, caratteri tipografici e layout – gioca un ruolo centrale.",
                      "When discussing digital accessibility, thoughts immediately turn to technical structure, textual contents, or multimedia interfaces. However, visual design – colors, typography pairings, and spatial layout – plays a crucial role."
                    )}
                  </p>
                  <p className="font-semibold">
                    {t(
                      "Un buon design non è solo estetica: è funzionalità, fruibilità e inclusione. E quando è progettato correttamente, migliora l’esperienza per tutti gli utenti, senza distinzioni.",
                      "Good design is not just aesthetics: it centers on utility, usability, and inclusion. When structured correctly, it enhances the digital journey for all learners, without distinction."
                    )}
                  </p>
                </div>
              </div>

              {/* Analisi di Accessibilità (European Accessibility Act 2025) */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-stone-200 dark:border-stone-850">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Activity size={14} className="text-[#a4161a]" />
                    {t("Analisi di Accessibilità (European Accessibility Act 2025)", "Accessibility Impact (European Accessibility Act 2025)")}
                  </h4>
                  <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                    {t("TEST ACCESSIBILITÀ SUPERATO", "ACCESSIBILITY SHIELD PASSED")}
                  </span>
                </div>
                
                <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                  {t(
                    "L me soddisfa pienamente le direttive WCAG e European Accessibility Act (EAA) 2025 grazie alle seguenti caratteristiche strutturali incorporate:",
                    "The application fully satisfies the WCAG guidelines and the European Accessibility Act (EAA) 2025 in light of the following core architectural qualities:"
                  )}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className={`p-4 rounded-md border ${isDarkMode ? "bg-stone-900/45 border-stone-850 text-stone-300" : "bg-stone-50 border-stone-200 text-stone-700"}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#a4161a] block mb-1">
                      {t("Rapporto di Contrasto (WCAG)", "Contrast Ratio (WCAG)")}
                    </span>
                    <p className="text-xs leading-relaxed">
                      {t(
                        "È garantito un contrasto minimo nettamente superiore a 4.5:1 sia in Dark Mode (con un elegante contrasto su sfondo nero scuro) sia in Light Mode.",
                        "A strict minimum contrast ratio exceeding 4.5:1 is structurally integrated in both Dark Mode (against optimized charcoal backdrops) and Light Mode."
                      )}
                    </p>
                  </div>

                  <div className={`p-4 rounded-md border ${isDarkMode ? "bg-stone-900/45 border-stone-850 text-stone-300" : "bg-stone-50 border-stone-200 text-stone-700"}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#a4161a] block mb-1">
                      {t("Tipografia Leggibile e Adattiva", "Legible & Adaptive Typography")}
                    </span>
                    <p className="text-xs leading-relaxed">
                      {t(
                        "I testi fluiscono naturalmente e sono allineati a sinistra per evitare spaziature irregolari dovute alla giustificazione. Attraverso i comandi in testata è possibile regolare lo Zoom del testo fino a 4 livelli preimpostati (1x, 2x, 3x, 4x), che allargano dinamicamente l'interlinea (line-height fino a 1.5 e oltre) e la spaziatura dei caratteri per combattere l'affaticamento visivo.",
                        "Text flows logically and aligns left to bypass typographic river-effects. Standard widgets allow viewers to increment physical Zoom up to 4x, dynamically resizing leading (line-height 1.5+) and character tracking to counteract eye strain."
                      )}
                    </p>
                  </div>
                </div>

                {/* Cognitive and Sensory Support block */}
                <div className={`p-5 rounded-lg border ${isDarkMode ? "bg-stone-900/20 border-stone-850 text-stone-305" : "bg-stone-100/35 border-stone-200 text-stone-800"}`}>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#a4161a] block mb-3">
                    {t("Integrazione di Supporto Cognitivo e Sensoriale", "Integration of Cognitive and Sensory Support")}
                  </span>
                  <ul className="space-y-4 text-xs leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#a4161a] text-sm leading-none mt-0.5">■</span>
                      <div>
                        <strong className="block text-stone-900 dark:text-stone-100">{t("Filtro di Lettura per Dislessia:", "Dyslexia Color-Overlay Tints:")}</strong>
                        {t(
                          "Imposta un filtro cromatico su tutta la pagina. Riduce la stanchezza oculare e facilita la lettura per alunni con DSA (Dislessia, Astigmatismo o Sensibilità Scotopica-Sindrome di Irlen). È possibile creare profili alunni e salvare il suo filtro colore personalizzato.",
                          "Sets a chromatic filter across the entire interface, minimizing fatigue and reinforcing visual trackability for students with SLDs or developmental dyslexia. Features personal styling profiles for students to save unique chromatic coordinates."
                        )}
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#a4161a] text-sm leading-none mt-0.5">■</span>
                      <div>
                        <strong className="block text-stone-900 dark:text-stone-100">{t("Parafrasi Semplificata e CAA:", "Simplified Paraphrase & AAC Support:")}</strong>
                        {t(
                          "Attivabile con un clic per supportare l'apprendimento di alunni con Bisogni Educativi Speciali (BES) o difficoltà linguistiche tramite la Comunicazione Aumentativa Alternativa (simboli iconici e categorizzazione a specchio).",
                          "Toggleable seamlessly to provide clear conceptual aid for SEN or multilingual pupils, swapping and reinforcing Middle Age verse with simplified syntax and symbol-enhanced AAC visual aids."
                        )}
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#a4161a] text-sm leading-none mt-0.5">■</span>
                      <div>
                        <strong className="block text-stone-900 dark:text-stone-100">{t("Sintesi Vocale Inclusiva:", "Inclusive Voice Synthesis (TTS):")}</strong>
                        {t(
                          "Ogni terzina e parafrasi dantesca può essere letta ad alta voce con un sintetizzatore vocale integrato a velocità rallentata per favorire la comprensione uditiva e la fonologia d'aula.",
                          "Paves the way for non-readers or visually impaired students to tap speaker triggers, dictating each Dantean verse or translation at a pacified pace for audit-cognitive processing."
                        )}
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 text-[#a4161a] dark:text-[#f25c54]">
                      <span className="text-sm leading-none mt-0.5 font-bold">★</span>
                      <div>
                        <strong className="block font-bold">{t("Gestione ed Editing Inclusivo per Docenti:", "Inclusive Authoring for Faculty:")}</strong>
                        {t(
                          "Il docente può sbloccare per l’alunno la possibilità di editare il supporto per gestire o creare contenuti accessibili, incluso l’uso di immagini (con didascalie personalizzate, filtri e crop) e la creazione e formattazione di documenti PDF pronti all'uso d'aula.",
                          "Teachers can expand control rights directly, allowing students to crop and position accessible custom layouts and compile formatted, clean study notes directly into standards-compliant PDF materials."
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Come Scegliere Colori, Font e Layout */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#a4161a] border-b border-stone-200 dark:border-stone-850 pb-1 flex items-center gap-1.5">
                  <Palette size={14} />
                  {t("Scelte di Design, Font & Layout di Accessibilità", "Accessibility Design, Fonts & Layout Guidelines")}
                </h4>
                
                <div className={`text-xs sm:text-sm leading-relaxed space-y-2 ${isDarkMode ? "text-stone-305" : "text-stone-750"}`}>
                  <strong>{t("Servizio di Dichiarazione EAA ed Standard WCAG 2.1:", "Accessibility Statement Service & WCAG 2.1 Standards:")}</strong><br/>
                  <p>
                    {t(
                      "Le linee guida WCAG 2.1 definiscono standard internazionali per rendere i contenuti web accessibili a tutti, inclusi utenti con disabilità. Rispettarle non solo migliora l’esperienza utente ma evita anche potenziali sanzioni legali.",
                      "The WCAG 2.1 guidelines constitute high international standards for rendering digital structures accessible to all, including disabled web browsers. Meeting their conditions refines search flow and prevents structural compliance faults."
                    )}
                  </p>
                  <p>
                    {t(
                      "Il Servizio di Redazione della Dichiarazione di Accessibilità ti aiuta a creare un documento conforme alle normative vigenti, seguendo le linee guida WCAG 2.1. Questo servizio garantisce che la dichiarazione rifletta accuratamente lo stato di accessibilità del sito, fornendo trasparenza agli utenti e assicurando il rispetto degli obblighi legali.",
                      "Our Accessibility Statement Drafting Service assists in creating a compliant document under current norms following WCAG 2.1. This service ensures that the statement precisely mirrors the web app's accessibility level, rendering it transparent and legally robust."
                    )}
                  </p>
                  <p>
                    {t(
                      "La dichiarazione di accessibilità è uno strumento essenziale per comunicare in modo trasparente lo stato di accessibilità del tuo sito web, dimostrando il tuo impegno nel rendere i contenuti digitali inclusivi per tutti gli utenti, comprese le persone con disabilità.",
                      "The accessibility declaration is an indispensable tool to communicate clearly your website's accessibility state, reflecting your commitment to keeping digital scopes inclusive for everyone, including people with impairments."
                    )}
                  </p>
                </div>

                <div className={`p-4 rounded-md border ${isDarkMode ? "bg-stone-900/30 border-stone-850 text-stone-300" : "bg-stone-100/50 border-stone-200 text-stone-700"} text-xs leading-relaxed space-y-3`}>
                  <p>
                    {t(
                      "Per rispettare le linee guida sull’accessibilità (WCAG) e aiutare gli utenti con DSA, bisogna usare rigorosamente font Sans Serif con forme inequivocabili (dove la “I” maiuscola sia ben distinguibile dalla “l” minuscola) come i font premium certificati per l'accessibilità visiva e per studenti con DSA:",
                      "To satisfy visual readability boundaries and assist students with SLD/dyslexia, creators must employ Sans-Serif typefaces with highly distinct letterforms (such as clearly separated uppercase 'I' vs lowercase 'l') like visual-friendly premium families:"
                    )}
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                    <li><strong>Inter</strong> {t("(Sans-serif ad alto contrasto spaziale per l'intera interfaccia di lettura)", "(Sans-serif with high spatial contrast for the complete study interface)")}</li>
                    <li><strong>Lexend o Atkinson Hyperlegible</strong> {t("(progettati appositamente per massimizzare il riconoscimento dei caratteri per persone ipovedenti)", "(crafted exclusively to maximize letter recognition for low-vision readers)")}</li>
                    <li><strong>JetBrains Mono</strong> {t("(per tutte le etichette informative)", "(for all informative metadata labels)")}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase font-mono tracking-wider opacity-90 text-stone-600 dark:text-stone-400">
                    {t("La Nostra Combinazione Tipografica Corrente:", "Our Implemented Typographic Combination:")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-md border ${isDarkMode ? "bg-stone-900 border-stone-850 text-stone-300" : "bg-white border-stone-200 text-stone-800"}`}>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 block uppercase mb-1">
                        {t("Testo Principale (font-sans)", "Main Body Text (font-sans)")}
                      </span>
                      <p className="text-sm font-sans font-bold text-[#a4161a]">Inter</p>
                      <p className="text-[11px] mt-1 text-stone-500 leading-normal">
                        {t("Massimizza la leggibilità sugli schermi riducendo la fatica.", "Elevates screen legibility, curtailing tiredness.")}
                      </p>
                    </div>

                    <div className={`p-4 rounded-md border ${isDarkMode ? "bg-stone-900 border-stone-850 text-stone-300" : "bg-white border-stone-200 text-stone-800"}`}>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 block uppercase mb-1">
                        {t("Titoli e Poesia (font-serif)", "Headings & Verses (font-serif)")}
                      </span>
                      <p className="text-sm font-serif font-bold text-[#a4161a]">Playfair Display</p>
                      <p className="text-[11px] mt-1 text-stone-500 leading-normal">
                        {t("Valorizza i versi letterari danteschi con elegante impatto.", "Bestows historical elegance onto medieval poetry verses.")}
                      </p>
                    </div>

                    <div className={`p-4 rounded-md border ${isDarkMode ? "bg-stone-900 border-stone-850 text-stone-300" : "bg-white border-stone-200 text-stone-800"}`}>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 block uppercase mb-1">
                        {t("Dati e Parametri (font-mono)", "Technical Metadata (font-mono)")}
                      </span>
                      <p className="text-sm font-mono font-bold text-[#a4161a]">JetBrains Mono</p>
                      <p className="text-[11px] mt-1 text-stone-500 leading-normal">
                        {t("Garantisce spaziatura fissa e controllo dei dati numerici.", "Delivers rigid modular layout tracking for figures & ratios.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accessibilità e Autonomia (I Principi UDL) */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#a4161a] border-b border-stone-200 dark:border-stone-850 pb-1 flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <Layers size={14} />
                  {t("Accessibilità e Autonomia: I Tre Principi UDL", "Accessibility and Autonomy: The Three UDL Pillars")}
                </h4>

                <div className="space-y-6">
                  {/* UDL Principle 1 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-[#a4161a] bg-[#a4161a]/10 dark:bg-[#a4161a]/25 px-2.5 py-1 rounded inline-block">
                      {t("1. Molteplici Mezzi di Rappresentazione (Representation)", "1. Multiple Means of Representation (Representation)")}
                    </span>
                    <ul className="list-disc list-inside space-y-2.5 text-xs leading-relaxed pl-1 pt-1 text-stone-700 dark:text-stone-300">
                      <li>
                        <strong>{t("Parafrasi a fronte sincronizzata: ", "Side-by-side synchronized Paraphrase: ")}</strong>
                        {t(
                          "Un commutatore intelligente sdoppia il testo. Quando inattivo, le terzine appaiono centrali e spaziate; all'attivazione lo sdoppiamento avviene side-by-side garantendo l'incolonnamento parallelo e l'allineamento tra Testo Originale e Parafrasi.",
                          "A layout coordinator splits text blocks. In standard mode, lines are centered. When active, original verses and modern translations flow in side-by-side panels aligned perfectly."
                        )}
                      </li>
                      <li>
                        <strong>{t("CAA (Comunicazione Aumentativa Alternativa): ", "AAC Pictograms: ")}</strong>
                        {t(
                          "Sostituisce/integra i complessi versi del XIV secolo con sintesi semplificate supportate da simboli iconici e concettuali codificati a colori per categoria grammaticale.",
                          "Translates the complex medieval Italian into simplified words accompanied by semantic color-coded pictograms."
                        )}
                      </li>
                      <li>
                        <strong>{t("Traduzione completa (Italiano / Inglese): ", "Dual Translation (Italian / English): ")}</strong>
                        {t(
                          "un selettore di lingua permette il rinforzo bilingue istantaneo per alunni con background migratorio o con DSA.",
                          "provides real-time bilingual support to back up students with second-language learning background."
                        )}
                      </li>
                      <li>
                        <strong>{t("Sintesi Vocale Integrata (TTS): ", "Embedded Audio Speech (TTS): ")}</strong>
                        {t(
                          "Un lettore acustico attivabile su ciascuna terzina modula l'esposizione uditiva facilitando gli studenti non vedenti, ipovedenti o dislessici.",
                          "an auditory player readies acoustic dictation triggers on each stanza to reinforce auditory learners."
                        )}
                      </li>
                      <li>
                        <strong>{t("Eye zoom tipografico: ", "Visual Font Zoom: ")}</strong>
                        {t(
                          "Un pulsante nella barra superiore ingrandisce fluidamente l'intero impianto grafico per agevolare l'affaticamento visivo (fino a 4 livelli preimpostati).",
                          "increases visual spacing, leading, and typography size to aid visually challenged readers."
                        )}
                      </li>
                      <li>
                        <strong>{t("Filtro cromatico antiriflesso (Dyslexia Visual Overlay): ", "Antireflective Chromatic Overlay Filters: ")}</strong>
                        {t(
                          "Consente di applicare overlays colorati in modalità duotone (Seppia, Turchese, Giallo Contrasto, Cremisi Teatrale) o di scegliere un colore personalizzato tramite un selettore esadecimale, riducendo lo stress visivo. Include la funzione di creare profili colore personalizzati per singoli alunni.",
                          "creates custom duotone lenses (Sepia, Turquoise, Yellow, Crimson) or custom hex values to stop light glare and help dyslexic pupils. Supports individual student color configurations."
                        )}
                      </li>
                    </ul>
                  </div>

                  {/* UDL Principle 2 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-[#a4161a] bg-[#a4161a]/10 dark:bg-[#a4161a]/25 px-2.5 py-1 rounded inline-block">
                      {t("2. Molteplici Mezzi di Azione ed Espressione (Action & Expression)", "2. Multiple Means of Action & Expression (Action & Expression)")}
                    </span>
                    <ul className="list-disc list-inside space-y-2 text-xs leading-relaxed pl-1 pt-1 text-stone-700 dark:text-stone-300">
                      <li>
                        <strong>{t("Verifica delle conoscenze: ", "Interactive Knowledge Verification: ")}</strong>
                        {t(
                          "quiz finali interattivi a risposta multipla con feedback immediato e spiegazioni contestualizzate per riconsolidare i punti cardine dei Canti I-V.",
                          "provides customizable comprehension quizzes with automatic, encouraging step-by-step notes to foster individual diagnostic reflection."
                        )}
                      </li>
                    </ul>
                  </div>

                  {/* UDL Principle 3 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-[#a4161a] bg-[#a4161a]/10 dark:bg-[#a4161a]/25 px-2.5 py-1 rounded inline-block">
                      {t("3. Molteplici Mezzi di Coinvolgimento (Engagement)", "3. Multiple Means of Engagement (Engagement)")}
                    </span>
                    <ul className="list-disc list-inside space-y-2 text-xs leading-relaxed pl-1 pt-1 text-stone-700 dark:text-stone-300">
                      <li>
                        <strong>{t("Dante explorer (atlante interattivo): ", "Animated Dante's Atlas: ")}</strong>
                        {t(
                          "Un generatore di mappe geografiche dell'Inferno. Gli studenti possono selezionare i cerchi concentrici per approfondire la topologia morale e attivare lo scroll automatico (smooth scroll) al Canto desiderato.",
                          "enables pupils to navigate the geographical spiral of Hell concentric circles to explore theological structures, sparking student curiosity."
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Conclusioni */}
              <div className={`p-6 rounded-lg border-2 border-dashed ${
                isDarkMode 
                  ? "bg-stone-900/10 border-stone-850 text-stone-300 font-sans" 
                  : "bg-white border-stone-250 text-stone-850 font-sans"
              } text-center space-y-3`}>
                <span className="text-xs font-mono uppercase tracking-widest text-[#a4161a] font-bold block">
                  {t("CONCLUSIONI", "CONCLUSIONS")}
                </span>
                <p className="text-sm font-sans font-bold text-[#a4161a] dark:text-[#f25c54]">
                  {t("Un design efficace è sempre accessibile", "Effective Design is Always Accessible")}
                </p>
                <p className="text-xs leading-relaxed max-w-3xl mx-auto italic">
                  {t(
                    "L’accessibilità non è un limite al design, ma una sua evoluzione. Colori ben scelti, font leggibili e layout chiari potenziano il messaggio, rendono l’interfaccia più elegante e migliorano le performance complessive del sito. Progettare con cura questi elementi significa pensare davvero all’utente finale, offrendo esperienze digitali fluide, coerenti e inclusive. Un design accessibile non è solo più bello. È anche più intelligente.",
                    "Accessibility is not a constraint on digital layouts, but their logical culmination. Harmonious colors, ultra-readable typefaces, and geometric grids amplify study progress and augment aesthetics. Building layouts with accessibility in mind is a tribute to human focus, producing seamless, coherent, and inclusive experiences. An accessible design is not just more pleasant. It is smarter."
                  )}
                </p>
              </div>

            </div>

            {/* Sticky Foot */}
            <div className={`p-4 sm:p-6 border-t flex justify-end shrink-0 ${isDarkMode ? "bg-stone-950 border-stone-850" : "bg-stone-50 border-stone-200"}`}>
              <button
                onClick={() => setIsUdlModalOpen(false)}
                className="px-5 py-2 bg-[#a4161a] hover:bg-[#a4161a]/95 text-white rounded-md font-sans text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
              >
                {t("Ho Capito, Grazie", "I Understand, Thank You")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- A1. ACCESSIBILITY OVERLAY CONFIGURATION MODAL (DYSLEXIA VISUAL FILTER SETUP) --- */}
      {isOverlayModalOpen && (
        <div
          id="overlay-picker-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 bottom-0 top-[64px] z-[75] flex items-center justify-center p-6 sm:p-8 bg-black/70 backdrop-blur-sm"
        >
          {/* Inner Dialog Box: Always strictly contained, high-contrast borders */}
          <div
            className={`w-full max-w-md rounded-lg border-2 text-left shadow-2xl relative flex flex-col max-h-[80vh] ${
              isDarkMode ? "bg-stone-950 border-stone-800 text-[#f5f3f4]" : "bg-white border-stone-300 text-gray-800"
            }`}
          >
            {/* Elegant, Accessible Top Right Close "X" Button */}
            <button
              onClick={() => setIsOverlayModalOpen(false)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-all border ${
                isDarkMode 
                  ? "border-stone-800 hover:border-stone-750 text-stone-400 hover:text-white bg-stone-900/80" 
                  : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100"
              }`}
              aria-label={t("Chiudi", "Close")}
            >
              <X size={16} />
            </button>

            {/* Locked Header */}
            <div className="p-6 pb-3 border-b border-stone-850/10 pr-10">
              <h3 className={`text-base sm:text-lg font-serif font-bold flex items-center gap-1.5 ${isDarkMode ? "text-stone-200" : "text-[#161a1d]"}`}>
                <Palette size={18} className={`shrink-0 ${isDarkMode ? "text-[#f5f3f4]" : "text-black"}`} strokeWidth={2.5} />
                <span>{t("Personalizzazione Filtro Visivo", "Visual Filter Customization")}</span>
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
                {t(
                  "Imposta un filtro cromatico su tutta la pagina. Riduce la stanchezza oculare e facilita la lettura per alunni con DSA (Dislessia, Astigmatismo o Sensibilità Scotopica-Sindrome di Irlen).",
                  "Apply a color multiplier tint across the entire page. Reduces eye fatigue and aids reading for pupils with developmental dyslexia or Visual Scotopic Sensitivity-Irlen Syndrome."
                )}
                <span className="block mt-1 font-semibold text-[#a4161a]">
                  {t("Puoi anche scegliere un colore personalizzato.", "You can also choose a custom color.")}
                </span>
              </p>
            </div>

            {/* Scrollable container with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* List of presets */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                  {t("Scegli un filtro preimpostato", "Select preconfigured filter")}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {duotoneColors.map((color) => {
                    const isPresetActive = selectedOverlay === color.id;
                    return (
                      <button
                        key={color.id}
                        onClick={() => {
                          setSelectedOverlay(color.id);
                        }}
                        className={`w-full p-2.5 rounded border text-xs text-left font-medium transition-all flex items-center justify-between ${
                          isPresetActive
                            ? isDarkMode
                              ? "bg-stone-800 border-stone-600 text-stone-100 font-semibold"
                              : "bg-stone-200 border-stone-400 text-stone-950 font-semibold"
                            : isDarkMode
                            ? "bg-slate-900/60 border-stone-850 text-stone-300 hover:bg-stone-850"
                            : "bg-stone-100 border-gray-300 text-stone-700 hover:bg-stone-150"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-4 h-4 rounded-full border border-stone-600 ${
                              color.id === "none" ? "bg-transparent border-dashed" : ""
                            }`}
                            style={{ backgroundColor: color.bgHex || "transparent" }}
                          />
                          <span>{t(color.name, color.nameEn)}</span>
                        </div>
                        {isPresetActive && <span className="text-[9px] uppercase font-mono bg-[#a4161a] text-white px-1.5 py-0.5 rounded leading-none">{t("Attivo", "Active")}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Custom color option picker */}
                <div className="pt-4 border-t border-stone-850/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                      {t("Colore di Lettura Personalizzato", "Custom Reading Tint Option")}
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="color"
                        value={customOverlayColor}
                        onChange={(e) => {
                          setSelectedOverlay("custom");
                          setCustomOverlayColor(e.target.value);
                        }}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                      />
                      <span className={`text-xs font-mono font-bold uppercase ${isDarkMode ? "text-stone-100" : "text-stone-950"}`}>{customOverlayColor}</span>
                    </label>
                  </div>

                  {/* Save student profile section */}
                  <div className={`p-3 rounded-md border ${isDarkMode ? "bg-stone-900/40 border-stone-800" : "bg-stone-50 border-gray-200"} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                        {t("Crea profilo colore alunno", "Create student color profile")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t("Nome alunno (es. Matteo)", "Student name (e.g. Matteo)")}
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className={`flex-1 px-2.5 py-1.5 rounded border text-xs leading-none outline-none ${
                          isDarkMode
                            ? "bg-stone-950 border-stone-800 text-white placeholder-stone-500 focus:border-stone-500"
                            : "bg-white border-gray-300 text-black placeholder-gray-400 focus:border-stone-500"
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (newStudentName.trim()) {
                              const updated = [...studentProfiles, { name: newStudentName.trim(), color: customOverlayColor }];
                              setStudentProfiles(updated);
                              safeLocalStorageSetItem("dante_student_color_profiles", JSON.stringify(updated));
                              setNewStudentName("");
                              setSelectedOverlay("custom");
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newStudentName.trim()) {
                            const updated = [...studentProfiles, { name: newStudentName.trim(), color: customOverlayColor }];
                            setStudentProfiles(updated);
                            safeLocalStorageSetItem("dante_student_color_profiles", JSON.stringify(updated));
                            setNewStudentName("");
                            setSelectedOverlay("custom");
                          }
                        }}
                        className="px-2.5 py-1.5 bg-black hover:bg-stone-900 border border-black hover:border-stone-900 text-white rounded text-xs font-mono leading-none flex items-center justify-center gap-1 transition-all"
                      >
                        <Plus size={12} />
                        <span className="hidden sm:inline">{t("Salva", "Save")}</span>
                      </button>
                    </div>

                    {/* List of saved student profiles */}
                    {studentProfiles.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-dashed border-stone-800/20">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">
                          {t("Profili Alunni (Doppio clic sul colore per modificarlo)", "Student Profiles (Double-click color to modify)")}
                        </span>
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                          {studentProfiles.map((prof, idx) => {
                            const isActiveProfile = selectedOverlay === "custom" && customOverlayColor === prof.color;
                            return (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-1.5 rounded text-xs transition-all border ${
                                  isActiveProfile
                                    ? (isDarkMode ? "bg-stone-850 border-stone-750 text-white font-semibold" : "bg-stone-150 border-stone-300 text-stone-950 font-semibold")
                                    : (isDarkMode ? "bg-transparent border-transparent hover:bg-stone-800/80 text-stone-300" : "bg-transparent border-transparent hover:bg-stone-200/50 text-stone-700")
                                }`}
                              >
                                <div className="flex-1 flex items-center space-x-2 text-left overflow-hidden">
                                  {/* Secret input type color for custom student selection */}
                                  <input
                                    type="color"
                                    id={`student-color-picker-${idx}`}
                                    value={prof.color.startsWith("#") ? prof.color : "#3b82f6"}
                                    onChange={(e) => {
                                      const newColor = e.target.value;
                                      const updated = [...studentProfiles];
                                      updated[idx] = { ...updated[idx], color: newColor };
                                      setStudentProfiles(updated);
                                      safeLocalStorageSetItem("dante_student_color_profiles", JSON.stringify(updated));
                                      setSelectedOverlay("custom");
                                      setCustomOverlayColor(newColor);
                                    }}
                                    className="sr-only absolute pointer-events-none"
                                    style={{ width: 0, height: 0, padding: 0, border: 0, opacity: 0 }}
                                  />
                                  <button
                                    type="button"
                                    onDoubleClick={(e) => {
                                      e.stopPropagation();
                                      document.getElementById(`student-color-picker-${idx}`)?.click();
                                    }}
                                    title={t("Doppio clic sul cerchio per cambiare colore con tavolozza", "Double-click circle to open color palette")}
                                    className="w-3.5 h-3.5 rounded-full border border-stone-500 shrink-0 shadow-sm transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer relative z-10"
                                    style={{ backgroundColor: prof.color }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedOverlay("custom");
                                      setCustomOverlayColor(prof.color);
                                    }}
                                    title={t("Seleziona profilo", "Select profile")}
                                    className="flex-1 text-left font-medium truncate focus:outline-none py-0.5"
                                  >
                                    {prof.name}
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = studentProfiles.filter((_, i) => i !== idx);
                                    setStudentProfiles(updated);
                                    safeLocalStorageSetItem("dante_student_color_profiles", JSON.stringify(updated));
                                  }}
                                  className={`p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-850 ${isDarkMode ? "text-stone-500 hover:text-stone-300" : "text-stone-400 hover:text-stone-600"}`}
                                  title={t("Elimina profilo", "Delete profile")}
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedOverlay === "custom" && (
                    <p className="text-[10px] text-yellow-500 font-mono italic">
                      {t("→ Filtro custom attivo con livello soft alpha", "→ Custom soft alpha filter currently active")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Locked Footer */}
            <div className="p-6 pt-3 border-t border-stone-850/40 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedOverlay("none");
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono leading-none border transition-all ${
                  isDarkMode ? "bg-stone-900 border-stone-850 text-stone-400 hover:text-stone-300" : "bg-stone-100 border-gray-300 text-stone-600 hover:bg-stone-150"
                }`}
              >
                {t("Reset Filtro", "Reset Filter")}
              </button>
              <button
                onClick={() => {
                  setIsOverlayModalOpen(false);
                }}
                className="px-5 py-2.5 rounded bg-black hover:bg-stone-900 border border-black hover:border-stone-900 text-white font-mono text-xs tracking-wider uppercase leading-none font-bold transition-all"
              >
                {t("Conferma", "Approve & Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAILED DANTE EXPLORER LIBRARY/ATLAS MODAL (SMART FILTERS & UNIVERSAL KNOWLEDGE) --- */}
      <DanteUniverseExplorer
        isLibraryOpen={isLibraryOpen}
        setIsLibraryOpen={setIsLibraryOpen}
        isDarkMode={isDarkMode}
        currentLang={currentLang}
        selectedDisciplina={selectedDisciplina}
        t={t}
        setSelectedCantoIndex={setSelectedCantoIndex}
        scrollToSection={scrollToSection}
        zoomLevel={zoomLevel}
        isCaaActive={isCaaActive}
      />
      {isLibraryOpen && false && (() => {
        const availableTags: string[] = [];
        const activeItem: any = null;
        const filteredLibraryItems: any[] = [];
        const handleNavigateToCanto = (canto: string) => {};

        const danteUniverseData = [
          {
            id: 1,
            cantica: 'Inferno',
            titolo: 'La Selva Oscura',
            canto: 'I',
            temi: 'Peccato, Smarrimento, Guida',
            personaggi: 'Dante, Virgilio, Le tre fiere',
            descrizione: 'Dante si ritrova in una selva oscura. Incontra Virgilio, che lo guiderà attraverso l\'abisso infernale.',
            dettaglio: 'Il viaggio inizia il Venerdì Santo del 1300. Le tre fiere rappresentano lussuria, superbia e cupidigia.'
          },
          {
            id: 10,
            cantica: 'Inferno',
            titolo: 'Il Dubbio di Dante',
            canto: 'II',
            temi: 'Missione, Grazia, Coraggio',
            personaggi: 'Dante, Virgilio, Beatrice (citata), Lucia, Maria',
            descrizione: 'Dante esita, temendo di non essere all\'altezza. Virgilio rivela che Beatrice si è mossa per lui.',
            dettaglio: 'Si delinea la "catena della salvezza": Maria, Lucia e Beatrice collaborano per salvare Dante dal peccato.'
          },
          {
            id: 2,
            cantica: 'Inferno',
            titolo: 'Paolo e Francesca',
            canto: 'V',
            temi: 'Lussuria, Amore tragico',
            personaggi: 'Minosse, Paolo Malatesta, Francesca da Polenta',
            descrizione: 'Il cerchio dei lussuriosi, dove gli amanti sono travolti da una bufera eterna.',
            dettaglio: '"Galeotto fu \'l libro e chi lo scrisse". Uno dei momenti più lirici e umani dell\'Inferno.'
          },
          {
            id: 3,
            cantica: 'Inferno',
            titolo: 'Il Conte Ugolino',
            canto: 'XXXIII',
            temi: 'Tradimento, Vendetta',
            personaggi: 'Ugolino della Gherardesca, Arcivescovo Ruggieri',
            descrizione: 'Nel ghiaccio di Cocito, il conte Ugolino rode il cranio del suo traditore.',
            dettaglio: 'La tragedia della fame e del tradimento politico nella zona dell\'Antenora.'
          },
          {
            id: 11,
            cantica: 'Inferno',
            titolo: 'Il Limbo',
            canto: 'IV',
            temi: 'Nobiltà, Desiderio, Sapienza',
            personaggi: 'Omero, Orazio, Ovidio, Lucano, Aristotele',
            descrizione: 'Il primo cerchio, dove risiedono i giusti non battezzati e i grandi spiriti dell\'antichità.',
            dettaglio: 'Le anime non soffrono pene fisiche, ma la pena del desiderio eterno di vedere Dio senza speranza.'
          },
          {
            id: 4,
            cantica: 'Purgatorio',
            titolo: 'L\'Antipurgatorio',
            canto: 'I-II',
            temi: 'Libertà, Penitenza, Speranza',
            personaggi: 'Catone l\'Uticense, Casella',
            descrizione: 'Dante e Virgilio arrivano sulla spiaggia del Purgatorio, accolti da Catone.',
            dettaglio: '"Libertà va cercando, ch\'è sì cara...". Inizia la salita verso la purificazione.'
          },
          {
            id: 5,
            cantica: 'Purgatorio',
            titolo: 'La Valletta dei Principi',
            canto: 'VII-VIII',
            temi: 'Politica, Negligenza',
            personaggi: 'Sordello da Goito, Sovrani europei',
            descrizione: 'Un luogo di sosta per i sovrani che tardarono a pentirsi per i troppi impegni politici.',
            dettaglio: 'Include la celebre invettiva "Ahi serva Italia, di dolore ostello".'
          },
          {
            id: 6,
            cantica: 'Purgatorio',
            titolo: 'Il Paradiso Terrestre',
            canto: 'XXVIII-XXXIII',
            temi: 'Rinascita, Lete, Eunoè',
            personaggi: 'Matelda, Beatrice',
            descrizione: 'Sulla cima della montagna, Dante incontra Beatrice e si purifica nei fiumi sacri.',
            dettaglio: 'Virgilio scompare: la ragione umana lascia il posto alla fede e alla grazia divina.'
          },
          {
            id: 7,
            cantica: 'Paradiso',
            titolo: 'Il Cielo della Luna',
            canto: 'III',
            temi: 'Incostanza, Voti mancati',
            personaggi: 'Piccarda Donati, Costanza d\'Altavilla',
            descrizione: 'Il primo cielo, dove risiedono le anime che mancarono ai voti religiosi.',
            dettaglio: 'Piccarda spiega la gerarchia della beatitudine: "In la sua volontade è nostra pace".'
          },
          {
            id: 8,
            cantica: 'Paradiso',
            titolo: 'Cacciaguida',
            canto: 'XV-XVII',
            temi: 'Nobiltà, Esilio, Missione',
            personaggi: 'Cacciaguida (antenato di Dante)',
            descrizione: 'Nel cielo di Marte, Dante incontra il suo antenato che gli profetizza l\'esilio.',
            dettaglio: 'Cacciaguida investe Dante della missione di scrivere il poema per il bene del mondo.'
          },
          {
            id: 9,
            cantica: 'Paradiso',
            titolo: 'L\'Empireo e la Candida Rosa',
            canto: 'XXX-XXXIII',
            temi: 'Visione di Dio, Amore Universale',
            personaggi: 'San Bernardo, Vergine Maria, Dio',
            descrizione: 'L\'ultimo traguardo: la visione della Trinità e l\'armonia dell\'universo.',
            dettaglio: 'Il viaggio si conclude con "L\'amor che move il sole e l\'altre stelle".'
          }
        ];

        // Apply all search filters
        const filtered = danteUniverseData.filter((item) => {
          const matchesCantica = universeCantica === "all" || item.cantica === universeCantica;
          
          const text = universeSearch.toLowerCase();
          const matchesSearch = text === "" || 
            item.titolo.toLowerCase().includes(text) ||
            item.personaggi.toLowerCase().includes(text) ||
            item.temi.toLowerCase().includes(text) ||
            item.descrizione.toLowerCase().includes(text);

          const matchesCanto = universeCanto === "all" || item.canto === universeCanto;
          const matchesPersonaggio = universePersonaggio === "all" || item.personaggi.toLowerCase().includes(universePersonaggio.toLowerCase());
          const matchesPeccato = universePeccato === "all" || item.temi.toLowerCase().includes(universePeccato.toLowerCase());

          return matchesCantica && matchesSearch && matchesCanto && matchesPersonaggio && matchesPeccato;
        });

        return (
          <div
            id="dante-universe-explorer-modal"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md overflow-y-auto"
          >
            <div
              className={`w-full max-w-6xl h-[80vh] sm:h-[82vh] my-4 sm:my-6 rounded-2xl border flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
                isDarkMode 
                  ? "bg-[#0b090a] border-stone-800 text-stone-100" 
                  : "bg-[#fbfbf9] border-stone-300 text-stone-900 shadow-xl"
              }`}
            >
              {/* Header */}
              <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
                isDarkMode ? "border-stone-900 bg-stone-950/40" : "border-stone-200 bg-stone-100/40"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#a4161a]/10 flex items-center justify-center">
                    <BookOpen size={20} className="text-[#a4161a]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-extrabold tracking-tight uppercase flex items-center gap-2">
                      {t("Dante Explorer", "Dante Explorer Library")}
                      <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#a4161a] text-white">
                        {t("BIBLIOTECA", "UNIVERSAL INDEX")}
                      </span>
                    </h3>
                    <p className={`text-[10px] sm:text-xs font-light ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
                      {t(
                        "Atlante critico intellettuale con filtri intelligenti e analisi UDL dell'opera dantesca.",
                        "Critical intellectual atlas with smart filters and UDL-compatible study sheets."
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLibraryOpen(false)}
                  className={`p-2 rounded-lg transition-colors border ${
                    isDarkMode 
                      ? "hover:bg-stone-900 border-stone-850 text-stone-400 hover:text-white" 
                      : "hover:bg-stone-200 border-stone-250 text-stone-600 hover:text-stone-950"
                  }`}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Filters Panel */}
              <div className={`p-4 sm:p-5 border-b space-y-4 shrink-0 ${
                isDarkMode ? "border-stone-900 bg-stone-950/20" : "border-stone-200 bg-stone-50"
              }`}>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                    <input
                      type="text"
                      value={librarySearchText}
                      onChange={(e) => setLibrarySearchText(e.target.value)}
                      placeholder={t("Cerca personaggi, canti, versi o temi...", "Search characters, cantos, quotes or themes...")}
                      className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-xs sm:text-sm transition-all border outline-none font-bold ${
                        isDarkMode 
                          ? "bg-stone-900 border-stone-800 hover:border-stone-700 focus:border-[#a4161a] text-white placeholder-stone-500" 
                          : "bg-white border-stone-300 hover:border-stone-400 focus:border-[#a4161a] text-stone-900 placeholder-stone-400 shadow-inner"
                      }`}
                    />
                    {librarySearchText && (
                      <button
                        onClick={() => setLibrarySearchText("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs font-mono font-bold"
                      >
                        {t("Pulisci", "Clear")}
                      </button>
                    )}
                  </div>

                  {/* Filter elements: Category tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold mr-1 block md:inline">
                      {t("CATEGORIA:", "CATEGORY:")}
                    </span>
                    {["Tutti", "Personaggi", "Luoghi", "Temi"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedLibraryCategory(cat);
                          setSelectedLibraryItem(null); // Reset detail preview selection
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          selectedLibraryCategory === cat
                            ? "bg-[#a4161a] border-[#a4161a] text-white shadow-sm"
                            : isDarkMode
                            ? "bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-400"
                            : "bg-white hover:bg-stone-100 border-stone-300 text-stone-600 shadow-sm"
                        }`}
                      >
                        {cat === "Tutti" ? t("Tutti", "All") : cat === "Personaggi" ? t("Personaggi", "Characters") : cat === "Luoghi" ? t("Luoghi & Spazi", "Locations") : t("Temi & Simboli", "Themes")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Filters: Cantica picker & Dynamic hot tags */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/10 dark:border-stone-800/40">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold mr-1">
                      {t("CANTICA:", "REALM:")}
                    </span>
                    {["Tutti", "Inferno", "Purgatorio", "Paradiso"].map((realm) => {
                      let btnColor = "bg-[#a4161a]";
                      let activeStyle = "bg-[#a4161a] border-[#a4161a] text-white";
                      if (realm === "Purgatorio") {
                        btnColor = "bg-amber-700";
                        activeStyle = "bg-amber-700 border-amber-700 text-white";
                      } else if (realm === "Paradiso") {
                        btnColor = "bg-blue-700";
                        activeStyle = "bg-blue-700 border-blue-700 text-white";
                      } else if (realm === "Tutti") {
                        btnColor = "bg-stone-600";
                        activeStyle = "bg-stone-800 border-stone-850 text-white dark:bg-stone-200 dark:border-stone-200 dark:text-stone-950";
                      }
                      
                      const isActive = selectedLibraryCantica === realm;
                      return (
                        <button
                          key={realm}
                          onClick={() => {
                            setSelectedLibraryCantica(realm);
                            setSelectedLibraryItem(null);
                          }}
                          className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-all border ${
                            isActive
                              ? activeStyle
                              : isDarkMode
                              ? "bg-stone-900/50 hover:bg-stone-850 border-stone-800 text-stone-400"
                              : "bg-white hover:bg-stone-100 border-stone-250 text-stone-600"
                          }`}
                        >
                          {realm === "Tutti" ? t("Tutte", "All") : t(realm, realm)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Smart pill tag list */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold">
                      {t("PAROLA CHIAVE:", "HOT TAGS:")}
                    </span>
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {availableTags.slice(0, 8).map((tag) => {
                        const isTagActive = selectedLibraryTag === tag;
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              setSelectedLibraryTag(isTagActive ? "" : tag);
                              setSelectedLibraryItem(null);
                            }}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition-all border ${
                              isTagActive
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : isDarkMode
                                ? "bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-400"
                                : "bg-white hover:bg-stone-100 border-stone-200 text-stone-500"
                            }`}
                          >
                            #{tag.toLowerCase()}
                          </button>
                        );
                      })}
                      {selectedLibraryTag && (
                        <button
                          onClick={() => setSelectedLibraryTag("")}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600 text-white font-bold"
                        >
                          [x] Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Workspace Body */}
              <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Pane: Item catalogue list */}
                <div className={`w-full lg:w-[40%] h-full min-h-0 border-r flex flex-col overflow-y-auto ${
                  isDarkMode ? "border-stone-900 bg-stone-950/20" : "border-stone-200 bg-stone-100/10"
                } ${activeItem && "hidden lg:flex"}`}>
                  <div className="p-3 bg-stone-900/5 dark:bg-stone-900/30 border-b border-stone-800/10 dark:border-stone-800/40 font-mono text-[10px] text-stone-400 uppercase tracking-wider font-bold">
                    {filteredLibraryItems.length} {t("elementi corrispondenti", "items found")}
                  </div>

                  {filteredLibraryItems.length === 0 ? (
                    <div className="p-8 text-center space-y-3 my-auto">
                      <div className="text-3xl">📭</div>
                      <h4 className="font-serif text-sm font-bold">{t("Nessun risultato trovato", "No records match")}</h4>
                      <p className="text-xs text-stone-500 font-light/80 max-w-xs mx-auto">
                        {t(
                          "Nessuna informazione corrisponde alla ricerca corrente nella biblioteca. Prova a svuotare i filtri.",
                          "No entries match your search criteria. Try removing filters or modifying search keywords."
                        )}
                      </p>
                      <button
                        onClick={() => {
                          setLibrarySearchText("");
                          setSelectedLibraryCategory("Tutti");
                          setSelectedLibraryCantica("Tutti");
                          setSelectedLibraryTag("");
                        }}
                        className="mt-2 px-4 py-1.5 rounded bg-[#a4161a] hover:bg-[#b52226] text-white text-xs font-bold transition-all"
                      >
                        {t("Svuota filtri", "Reset All Filters")}
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-800/10 dark:divide-stone-850">
                      {filteredLibraryItems.map((item) => {
                        const isItemSelected = activeItem?.id === item.id;
                        let realmColor = "text-[#a4161a] border-[#a4161a]/10 bg-[#a4161a]/5";
                        if (item.cantica === "Purgatorio") {
                          realmColor = "text-amber-700 border-amber-600/10 bg-amber-500/5";
                        } else if (item.cantica === "Paradiso") {
                          realmColor = "text-blue-700 border-blue-600/10 bg-blue-500/5";
                        } else if (item.cantica === "Tutte") {
                          realmColor = "text-stone-500 border-stone-600/10 bg-stone-500/5";
                        }

                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedLibraryItem(item)}
                            className={`p-4 cursor-pointer transition-all border-l-4 ${
                              isItemSelected
                                ? "border-l-[#a4161a] bg-[#a4161a]/5 dark:bg-[#a4161a]/10"
                                : "border-l-transparent hover:bg-stone-500/5"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <span className="text-2xl pt-1 block">{item.symbol}</span>
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-1.5">
                                  <h4 className="font-serif font-bold text-xs sm:text-sm truncate">
                                    {currentLang === "it" ? item.name : item.nameEn}
                                  </h4>
                                  <span className={`text-[8px] font-mono leading-none tracking-wider px-1.5 py-0.5 rounded uppercase border font-bold ${realmColor}`}>
                                    {item.cantica === "Tutte" ? t("Tutte", "All") : t(item.cantica, item.cantica)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-500 uppercase tracking-widest font-extrabold">
                                  <span>{t(item.category, item.category === "personaggio" ? "character" : item.category === "luogo" ? "place" : "theme")}</span>
                                  <span>•</span>
                                  <span>{currentLang === "it" ? item.canto : item.cantoEn}</span>
                                </div>
                                <p className="text-xs line-clamp-2 font-light text-stone-500 dark:text-stone-400">
                                  {currentLang === "it" ? item.summary : item.summaryEn}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Pane: Study desk area (detailed reading) */}
                <div className={`flex-1 h-full min-h-0 flex flex-col overflow-y-auto ${
                  isDarkMode ? "bg-[#0b090a]/40" : "bg-white"
                } ${!activeItem && "hidden lg:flex"}`}>
                  
                  {/* Mobile Back Button */}
                  {activeItem && (
                    <div className="p-3 border-b border-stone-800/10 dark:border-stone-800/50 flex lg:hidden bg-stone-900/5 items-center justify-between shrink-0">
                      <button
                        onClick={() => setSelectedLibraryItem(null)}
                        className="text-xs font-mono font-bold text-[#a4161a] flex items-center gap-1"
                      >
                        ← {t("Torna all'indice", "Back to Index")}
                      </button>
                      <span className="text-[10px] font-mono text-stone-400 uppercase">
                        {t("MODALITÀ STUDIO", "STUDY MODE")}
                      </span>
                    </div>
                  )}

                  {!activeItem ? (
                    <div className="p-12 text-center space-y-4 my-auto">
                      <div className="h-16 w-16 rounded-full border border-dashed border-stone-500 flex items-center justify-center mx-auto text-stone-400 opacity-60">
                        <BookOpen size={28} />
                      </div>
                      <h4 className="font-serif text-base font-bold text-stone-400">{t("Scegli un termine da esplorare", "Select an element of the Divine Comedy")}</h4>
                      <p className="text-xs text-stone-500 font-light max-w-sm mx-auto">
                        {t(
                          "Seleziona una delle schede a sinistra per visualizzare la spiegazione dettagliata, la valenza allegorica medievale, le citazioni e i riferimenti didattici UDL.",
                          "Select an item from the catalog list to reveal famous quotes, medieval allegories, historical profiles, and UDL educational insights."
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="p-5 sm:p-8 space-y-8 max-w-3xl mx-auto w-full">
                      {/* Anchor Hero Header */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl sm:text-6xl p-2 rounded-2xl bg-[#a4161a]/5 border border-[#a4161a]/15">{activeItem.symbol}</span>
                          <div>
                            <span className="text-[9px] font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold uppercase">
                              {t(activeItem.category, activeItem.category === "personaggio" ? "CHARACTER" : activeItem.category === "luogo" ? "PLACE" : "THEME")}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight mt-1 text-stone-900 dark:text-stone-100">
                              {currentLang === "it" ? activeItem.name : activeItem.nameEn}
                            </h2>
                            <p className="text-xs font-mono text-stone-500 flex items-center gap-2 mt-0.5 font-bold">
                              <span className="font-bold underline uppercase">{activeItem.cantica}</span>
                              <span>•</span>
                              <span>{currentLang === "it" ? activeItem.canto : activeItem.cantoEn}</span>
                            </p>
                          </div>
                        </div>

                        {/* Summary Block */}
                        <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border font-light ${
                          isDarkMode 
                            ? "bg-stone-900/30 border-stone-850 text-stone-300" 
                            : "bg-stone-50 border-stone-250 text-stone-600"
                        }`}>
                          {currentLang === "it" ? activeItem.summary : activeItem.summaryEn}
                        </div>
                      </div>

                      {/* Famous Quote Card */}
                      <div className={`relative p-5 sm:p-6 rounded-xl border-l-4 overflow-hidden before:absolute before:top-2 before:right-3 before:text-5xl before:font-serif before:font-bold before:opacity-10 before:content-['“'] ${
                        isDarkMode
                          ? "bg-[#1c0708]/30 border-l-[#a4161a] border-stone-850"
                          : "bg-red-50/20 border-l-[#a4161a] border-stone-200"
                      }`}>
                        <p className="text-sm sm:text-base font-serif italic text-stone-900 dark:text-stone-100 leading-relaxed font-semibold">
                          «{activeItem.quote}»
                        </p>
                        <p className="text-xs font-mono text-stone-500 mt-2">
                          — {currentLang === "it" ? "Versione italiana" : activeItem.quoteTranslation}
                        </p>
                      </div>

                      {/* Complete Allegorical Explanation */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#a4161a]">
                          {t("ANALISI DI DETTAGLIO & ALLEGORIA", "CRITICAL STUDY & ALLEGORY")}
                        </h4>
                        <p className="text-xs sm:text-sm font-light leading-relaxed text-stone-850 dark:text-stone-300 whitespace-pre-line">
                          {currentLang === "it" ? activeItem.explanation : activeItem.explanationEn}
                        </p>
                      </div>

                      {/* UDL Specific Study Aid Block */}
                      <div className={`p-5 rounded-xl border leading-relaxed ${
                        isDarkMode 
                          ? "bg-stone-900/50 border-stone-800" 
                          : "bg-emerald-50/10 border-emerald-600/20 text-stone-850"
                      }`}>
                        <div className="flex items-center gap-2 mb-3">
                          <BookMarked className="text-emerald-700 dark:text-red-400" size={18} />
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-red-400">
                            {t("DIDATTICA INCLUSIVA UDL / ANALISI CONCETTUALE", "ACCESSIBLE UDL STUDY GUIDE")}
                          </h4>
                        </div>
                        <ul className="space-y-2 text-xs font-light text-stone-600 dark:text-stone-400 pl-4 list-disc">
                          {activeItem.tags.map((tag, tIdx) => (
                            <li key={tIdx}>
                              <strong className="font-bold text-[#a4161a] dark:text-red-405 dark:text-red-400 uppercase tracking-wide">
                                {tag}
                              </strong>: {
                                tag === "Protagonista" ? t("Rappresenta ogni essere umano che compie scelte.", "Reflects the universal journey of choice-making humans.") :
                                tag === "Esilio" ? t("Simbolo dello smarrimento terreno da superare con coraggio.", "Symbol of worldly lostness to overcome with resilience.") :
                                tag === "Saggezza" || tag === "Ragione" ? t("Rappresenta lo studio accademico, l'autocontrollo e l'intelletto logico.", "Encompasses human knowledge, academic research, and logical thought.") :
                                tag === "Mostro" ? t("Simbolo delle forze brutali e animalesche che imprigionano la mente.", "Image of beasts and raw instincts trapping moral intellect.") :
                                tag === "Amore" ? t("La forza suprema dell'universo che guida le azioni umane e divine.", "The supreme cosmic force inspiring celestial movement and care.") :
                                t("Un concetto base per comprendere il simbolismo strutturale della Commedia.", "Core symbol to master the political and moral patterns of the text.")
                              }
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive Link Action to go to Canto inside main app */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-800/10 dark:border-stone-800/40">
                        {activeItem.cantica !== "Tutte" && (
                          <button
                            onClick={() => handleNavigateToCanto(activeItem.canto)}
                            className="px-5 py-2.5 rounded-lg bg-[#a4161a] hover:bg-[#b52226] text-white font-mono text-xs font-bold transition-all uppercase flex items-center gap-1.5 shadow-md shadow-[#a4161a]/10"
                          >
                            <Compass size={14} />
                            {t("Leggi testi nel Canto", "Read related Canto Verses")} →
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setLibrarySearchText(activeItem.name);
                            setSelectedLibraryCategory("Tutti");
                            setSelectedLibraryCantica("Tutti");
                          }}
                          className={`px-4 py-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                            isDarkMode 
                              ? "hover:bg-stone-900 border-stone-800 text-stone-400 hover:text-white" 
                              : "hover:bg-stone-100 border-stone-350 text-stone-700 hover:text-stone-950"
                          }`}
                        >
                          {t("Cerca correlati", "Search related elements")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- A2. DETAILED ATALANTE DANTE EXPLORER MAP MODAL --- */}
      {isExplorerOpen && (() => {
        const isSimplifiedMode = isCaaActive;
        return (
          <div
            id="dante-explorer-canvas-modal"
            role="dialog"
            aria-modal="true"
            className={`fixed inset-x-0 bottom-0 top-[57px] sm:top-[65px] z-50 flex items-start justify-center p-4 backdrop-blur-md overflow-y-auto transition-colors duration-300 ${
              isDarkMode ? "bg-black/95 text-stone-100" : "bg-stone-100/95 text-stone-900"
            }`}
          >
            <div
              className={`w-full max-w-4xl p-6 sm:p-8 rounded-lg border text-left shadow-2xl relative my-8 overflow-hidden ${
                isDarkMode ? "bg-stone-950 border-stone-800 text-[#f5f3f4]" : "bg-white border-gray-300 text-gray-800"
              }`}
              style={explorerBgImgUrl ? { backgroundImage: `url(${explorerBgImgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              {explorerBgImgUrl && (
                <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${isDarkMode ? "bg-black/90" : "bg-white/95"}`} />
              )}
              <div className="relative z-20">
                {/* Modal close top corner */}
                <button
                  onClick={() => setIsExplorerOpen(false)}
                  className={`absolute top-4 right-4 p-2 rounded-lg transition-colors border ${
                    isDarkMode 
                      ? "hover:bg-stone-900 border-stone-850 text-stone-400 hover:text-white bg-stone-950/40" 
                      : "hover:bg-stone-200 border-stone-250 text-stone-600 hover:text-stone-950 bg-stone-50/40"
                  }`}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

              {/* Header atlas description */}
              <div className="space-y-2 mb-8 pr-12">
                <h3 className={`text-xl sm:text-2xl font-serif font-bold uppercase flex items-center gap-2 ${isDarkMode ? "text-stone-100" : "text-[#161a1d]"}`}>
                  <Compass className="animate-spin text-[#a4161a]" size={20} />
                  {t("Cartografia dell'Inferno", "Inferno Cartography")}
                </h3>
                <p className={`text-xs leading-relaxed font-light ${isDarkMode ? "text-stone-400" : "text-[#161a1d]"}`}>
                  {isSimplifiedMode ? (
                    t(
                      "Questa mappa mostra come è fatto l'Inferno. Clicca sui livelli per leggere i canti e scoprire dove si trovano i diversi personaggi.",
                      "This map shows how Hell is made. Click on the levels to read the cantos and discover where the different characters are."
                    )
                  ) : (
                    t(
                      "Questo schema ridisegna l'imbuto dei cerchi dell'Inferno. Clicca su ciascun livello della spirale per saperne di piu",
                      "This interactive outline tracks the funnel of Hell. Click on any spiral level to learn more"
                    )
                  )}
                </p>
              </div>

              {/* Funnel design map */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left Column: Visual funner map representation using nested layers */}
                <div className="md:col-span-7 space-y-3">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block font-bold text-center md:pt-5">
                    ↓ {t("L'Abisso Infernale", "The Deep Abyss")} ↓
                  </span>

                  {/* Level 1 banner */}
                  <div
                    onClick={() => {
                      setSelectedExplorerCircle(0);
                    }}
                    className={`group p-2.5 rounded border transition-all hover:scale-[1.03] cursor-pointer ${
                      selectedExplorerCircle === 0 
                        ? "ring-2 ring-[#a4161a] border-[#a4161a] bg-stone-100/90 text-stone-900" 
                        : "border-stone-200 bg-stone-50 text-stone-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-bold font-serif tracking-wider">Canto I - La Selva Oscura</span>
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-tight uppercase transition-colors duration-200 ${
                        selectedExplorerCircle === 0 
                          ? "text-[#a4161a]" 
                          : "text-stone-500 dark:text-stone-400 group-hover:text-[#a4161a]"
                      }`}>{t("Smarrimento", "Loss / Straying")}</span>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] italic mt-0.5 text-stone-600/95 leading-normal">
                      {isSimplifiedMode ? (
                        t(
                          "Dante ha paura nella foresta buia. Arriva Virgilio per salvarlo e fargli da guida.",
                          "Dante is afraid in the dark forest. Virgil arrives to rescue and guide him."
                        )
                      ) : (
                        t(
                          "L'incontro con le bestie e la chiamata di Virgilio.",
                          "The encounter with wild beasts and Virgil's rescue."
                        )
                      )}
                    </p>
                  </div>

                  {/* Level 2 banner */}
                  <div
                    onClick={() => {
                      setSelectedExplorerCircle(1);
                    }}
                    className={`group p-2.5 rounded border transition-all hover:scale-[1.03] hover:border-[#a4161a] cursor-pointer ${
                      selectedExplorerCircle === 1
                        ? "ring-2 ring-[#a4161a] border-[#a4161a] bg-stone-200 text-stone-900"
                        : "border-stone-300 bg-stone-100 text-stone-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-bold font-serif tracking-wider">Canto II - La Selva Oscura</span>
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-tight uppercase transition-colors duration-200 ${
                        selectedExplorerCircle === 1
                          ? "text-[#a4161a]"
                          : "text-stone-500 dark:text-stone-400 group-hover:text-[#a4161a]"
                      }`}>{t("La Catena d'Amore", "The Love Chain")}</span>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] italic mt-0.5 text-stone-600/95 leading-normal">
                      {isSimplifiedMode ? (
                        t(
                          "Dante ha paura e vuole fermarsi, ma scopre che Beatrice lo protegge dal cielo.",
                          "Dante is scared and wants to stop, but learns Beatrice is protecting him from above."
                        )
                      ) : (
                        t(
                          "Il dubbio di Dante e l'intervento di Beatrice",
                          "Dante's doubt and Beatrice's intervention"
                        )
                      )}
                    </p>
                  </div>

                  {/* Level 3 banner */}
                  <div
                    onClick={() => {
                      setSelectedExplorerCircle(2);
                    }}
                    className={`group p-2.5 rounded border transition-all hover:scale-[1.03] hover:border-[#a4161a] cursor-pointer ml-3 ${
                      selectedExplorerCircle === 2
                        ? "ring-2 ring-[#a4161a] border-[#a4161a] bg-stone-300 text-stone-900"
                        : "border-stone-400 bg-stone-200 text-stone-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-bold font-serif tracking-wider">Canto III - Antinferno e Fiume Acheronte</span>
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-tight uppercase transition-colors duration-200 ${
                        selectedExplorerCircle === 2
                          ? "text-[#a4161a]"
                          : "text-stone-500 dark:text-stone-400 group-hover:text-[#a4161a]"
                      }`}>{t("Ignavia", "Sloth / Indifference")}</span>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] italic mt-0.5 text-stone-700/95 leading-normal">
                      {isSimplifiedMode ? (
                        t(
                          "La porta dell'Inferno e le persone pigre che non scelsero il bene. C'è il traghettatore Caronte.",
                          "The gates of Hell and lazy people who did not choose good. There is the boatman Charon."
                        )
                      ) : (
                        t(
                          "La Porta dell'Inferno e gli Ignavi, il fiume Acheronte e Caronte dagli occhi infuocati.",
                          "The Gates of Hell, the Ignavi, the Acheron river, and Charon with fiery eyes."
                        )
                      )}
                    </p>
                  </div>

                  {/* Level 4 banner */}
                  <div
                    onClick={() => {
                      setSelectedExplorerCircle(3);
                    }}
                    className={`group p-2.5 rounded border transition-all hover:scale-[1.03] hover:border-[#a4161a] cursor-pointer ml-6 ${
                      selectedExplorerCircle === 3
                        ? "ring-2 ring-[#a4161a] border-[#a4161a] bg-stone-400 text-stone-900"
                        : "border-stone-500 bg-stone-300 text-stone-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-bold font-serif tracking-wider">Canto IV - Cerchio I: Limbo</span>
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-tight uppercase transition-colors duration-200 ${
                        selectedExplorerCircle === 3
                          ? "text-[#a4161a]"
                          : "text-stone-500 dark:text-stone-400 group-hover:text-[#a4161a]"
                      }`}>{t("Mancanza di Battesimo", "Lack of Baptism")}</span>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] italic mt-0.5 text-stone-800/95 leading-normal">
                      {isSimplifiedMode ? (
                        t(
                          "Il Limbo, un castello calmo dove vivono le persone brave nate prima di Gesù.",
                          "Limbo, a calm castle where good people born before Jesus live."
                        )
                      ) : (
                        t(
                          "Il focolare dei poeti sani (Omero, Orazio, Virgilio) nati prima di Cristo.",
                          "The castle of righteous souls born before Christ (Homer, Horace, Lucan)."
                        )
                      )}
                    </p>
                  </div>

                  {/* Level 5 banner */}
                  <div
                    onClick={() => {
                      setSelectedExplorerCircle(4);
                    }}
                    className={`group p-2.5 rounded border transition-all hover:scale-[1.03] hover:border-[#a4161a] cursor-pointer ml-9 ring-1 ring-[#a4161a]/15 ${
                      selectedExplorerCircle === 4
                        ? "ring-2 ring-[#a4161a] border-[#a4161a] bg-stone-500 text-black text-stone-950"
                        : "border-stone-600 bg-stone-400 text-stone-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-bold font-serif tracking-wider text-stone-950">Canto V - Cerchio II: Lussuriosi</span>
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-tight uppercase transition-colors duration-200 ${
                        selectedExplorerCircle === 4
                          ? "text-[#a4161a]"
                          : "text-stone-500 dark:text-stone-400 group-hover:text-[#a4161a]"
                      }`}>{t("Lussuria", "Lust")}</span>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] italic mt-0.5 text-stone-900/95 leading-normal">
                      {isSimplifiedMode ? (
                        t(
                          "Paolo e Francesca, due innamorati trascinati insieme da un vento fortissimo.",
                          "Paolo and Francesca, two lovers dragged together by a very strong wind."
                        )
                      ) : (
                        t(
                          "La tragedia di Paolo e Francesca, spazzati dal forte vento per l'eternità.",
                          "The tragic romance of Paolo and Francesca, tossed around by furious storms."
                        )
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Column: Key legends and educational pointers OR Scheda Riassuntiva */}
                {selectedExplorerCircle !== null ? (
                  (() => {
                    const circle = activeExplorerCircleData[selectedExplorerCircle];
                    const simplifiedCircles = [
                      {
                        luogo: t("La foresta buia, dove Dante si perde", "The dark forest where Dante gets lost"),
                        personaggi: t("Dante e la sua guida Virgilio", "Dante and his helper Virgil"),
                        custodi: t("Tre animali paurosi: una lonza, un leone e una lupa", "Three scary animals: a leopard, a lion, and a wolf"),
                        contrappasso: t("Dante si perde nella foresta perché ha preso una strada sbagliata nella vita. Non riesce a camminare verso la luce del sole a causa degli animali feroci.", "Dante gets lost in the forest because he took a wrong path in life. He cannot walk to the sunny hill because of the wild beasts.")
                      },
                      {
                        luogo: t("La base della montagna deserta", "The base of the empty mountain"),
                        personaggi: t("Dante, Virgilio e l'aiuto di Beatrice dal cielo", "Dante, Virgil, and Beatrice helping from heaven"),
                        custodi: t("Nessuno. Beatrice protegge Dante dal cielo.", "None. Beatrice protects Dante from heaven."),
                        contrappasso: t("Dante ha molta paura e pensa di non essere abbastanza forte per il viaggio. Virgilio lo rassicura dicendo che tre donne sante dal cielo lo proteggono.", "Dante is very afraid and feels weak. Virgil comforts him by explaining that three holy ladies in heaven are protecting him.")
                      },
                      {
                        luogo: t("La porta dell'Inferno e le sponde del fiume", "The gates of Hell and the riverbanks"),
                        personaggi: t("Le persone pigre (Ignavi) e il traghettatore Caronte", "Lazy people (Ignavi) and the boatman Charon"),
                        custodi: t("Caronte, il vecchio nocchiero arrabbiato con gli occhi rossi come il fuoco", "Charon, the angry old boatman with eyes like fire"),
                        contrappasso: t("Qui si trovano i pigri, cioè le persone che in vita non hanno mai scelto tra bene e male. Per questo ora corrono senza sosta dietro a una bandiera e vengono punti da insetti.", "Here are the lazy people who never chose between good and bad. Now they run forever after a flag while being stung by insects.")
                      },
                      {
                        luogo: t("Il Limbo, un castello tranquillo con sette mura", "Limbo, a calm castle with seven walls"),
                        personaggi: t("I grandi scrittori e filosofi del passato (Omero, Aristotele e altri)", "The ancient great writers and philosophers (Homer, Aristotle, and others)"),
                        custodi: t("Nessun custode cattivo, c'è solo un po' di tristezza.", "No bad guardians, there is only a bit of sadness."),
                        contrappasso: t("Qui si trovano le persone buone nate prima di Gesù. Non hanno commesso peccati, ma non hanno ricevuto il Battesimo. Non vengono puniti, ma sono tristi perché non possono vedere Dio.", "Here are good people born before Jesus. They did no wrong, but didn't receive Baptism. They are not punished, but they feel sad because they cannot see God.")
                      },
                      {
                        luogo: t("Il secondo cerchio dell'Inferno con un vento fortissimo", "The second circle of Hell with a very strong wind"),
                        personaggi: t("Paolo e Francesca e altri famosi innamorati", "Paolo and Francesca and other famous lovers"),
                        custodi: t("Minosse, il mostro che decide dove mandare le anime usando la coda", "Minos, the monster using his tail to decide where to send souls"),
                        contrappasso: t("Qui ci sono le persone travolte dalla passione dell'amore. Come nella vita reale si sono lasciate trasportare dai sentimenti senza ragionare, ora un vento violentissimo le trascina per sempre nel buio.", "Here are people swept away by love passion. Just as in life they let feelings drag them without thinking, now a violent wind drags them forever in the dark.")
                      }
                    ];
                    const simp = simplifiedCircles[selectedExplorerCircle];

                    return (
                      <div
                        className={`flex flex-col space-y-4 md:col-span-5 p-5 rounded border animate-fade-in ${
                          isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-stone-50 border-stone-300 shadow-lg text-stone-900"
                        }`}
                      >
                        {/* Header with back button */}
                        <div className="flex items-center justify-between pb-2 border-b border-stone-700/35">
                          <span className="text-xs font-mono text-[#a4161a] uppercase font-bold tracking-wider">
                            {t("Scheda Riassuntiva", "Summary Sheet")}
                          </span>
                        </div>

                        {/* Header Detail */}
                        <div className="space-y-1">
                          <h4 className={`text-[10px] sm:text-xs font-bold font-serif tracking-wider ${isDarkMode ? "text-stone-100" : "text-stone-900"}`}>
                            {circle.title}
                          </h4>
                        </div>

                        {/* Info structure with hidden scrollbar */}
                        <div className="space-y-3.5 text-xs font-light leading-relaxed max-h-[350px] overflow-y-auto pr-1 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          <div>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">{t("Canto di riferimento", "Reference Canto")}</span>
                            <p className={`font-semibold ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>{circle.canto}</p>
                          </div>

                          <div>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">{t("Luogo", "Location")}</span>
                            <p className={`font-semibold ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                              {isSimplifiedMode ? simp.luogo : circle.luogo}
                            </p>
                          </div>

                          <div>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">{t("Personaggi", "Characters")}</span>
                            <p className={`font-semibold ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                              {isSimplifiedMode ? simp.personaggi : circle.personaggi}
                            </p>
                          </div>

                          <div>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">{t("Custodi", "Guardians")}</span>
                            <p className={`font-semibold ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                              {isSimplifiedMode ? simp.custodi : circle.custodi}
                            </p>
                          </div>

                          <div>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-[#a4161a] font-bold">{t("Peccato e legge del contrappasso", "Sin & Retribution Law")}</span>
                            <p className={`italic whitespace-pre-line ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                              {isSimplifiedMode ? simp.contrappasso : circle.contrappasso}
                            </p>
                          </div>

                          {/* Versi celebri con parafrasi a fianco - senza titolo della sezione */}
                          <div className="pt-2.5 border-t border-stone-500/20">
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 border p-2.5 rounded ${isDarkMode ? "bg-black/15 border-stone-800" : "bg-stone-100 border-stone-250"}`}>
                              <div>
                                <span className="block text-[9px] font-mono text-[#a4161a] select-none font-bold uppercase">{t("Versi Celebri", "Famous Verses")}</span>
                                <p className={`font-serif italic font-medium block whitespace-pre-line leading-snug pt-1 ${isDarkMode ? "text-stone-200" : "text-stone-900"}`}>
                                  "{circle.versi}"
                                </p>
                              </div>
                              <div className={`border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-3 ${isDarkMode ? "border-stone-800" : "border-stone-250"}`}>
                                <span className="block text-[9px] font-mono text-[#a4161a] select-none font-bold uppercase">{t("Parafrasi", "Paraphrase")}</span>
                                <p className={`text-[11px] leading-relaxed pt-1 ${isDarkMode ? "text-stone-400" : "text-stone-700"}`}>
                                  {circle.parafrasi}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lower actions */}
                        <div className="pt-3 border-t border-stone-500/20 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCantoIndex(selectedExplorerCircle);
                              setIsExplorerOpen(false);
                              scrollToSection("canti-explorer-section");
                            }}
                            className="flex-1 py-2 rounded bg-[#a4161a] hover:bg-[#e5383b] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            {t("Seleziona e Leggi Canto", "Select & Read Canto")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedExplorerCircle(null)}
                            className={`px-3 py-2 rounded border font-mono text-[10px] transition-colors cursor-pointer ${
                              isDarkMode 
                                ? "border-stone-700 hover:bg-stone-800 text-stone-400" 
                                : "border-stone-300 hover:bg-stone-200 text-stone-600"
                            }`}
                          >
                            {t("Indietro", "Back")}
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div
                    className={`flex flex-col space-y-4 md:col-span-5 p-5 rounded border ${
                      isDarkMode ? "bg-stone-900 border-stone-850" : "bg-stone-100 border-gray-300 shadow-inner"
                    }`}
                  >
                    <div className="space-y-1 pb-2 border-b border-stone-500/20">
                      <h4 className={`text-xs font-mono uppercase font-bold tracking-wider ${isDarkMode ? "text-stone-100" : "text-stone-900"}`}>
                        {t("STRUTTURA DELL'INFERNO", "STRUCTURE OF HELL")}
                      </h4>
                    </div>

                    <div className={`text-xs space-y-4 leading-relaxed font-light ${isDarkMode ? "text-stone-300" : "text-[#161a1d]"}`}>
                      <div className="space-y-1">
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">
                          {t("1. Topografia", "1. Topography")}
                        </span>
                        <div>
                          {isSimplifiedMode ? (
                            <p>
                              {t(
                                "L'Inferno è come una grande valle a imbuto sotterranea divisa in 9 cerchi d'oro e ghiaccio creati dalla caduta di Lucifero.",
                                "Hell is like a large underground funnel-shaped valley divided into 9 circles of gold and ice created by Lucifer's fall."
                              )}
                            </p>
                          ) : (
                            <div className="space-y-1.5">
                              <p>
                                {t(
                                  "La struttura dell'Inferno dantesco è concepita come una voragine sotterranea a forma di imbuto prodotta dalla caduta di Lucifero dal cielo. Si divide in:",
                                  "The structure of Dante's Inferno is conceived as a subterranean funnel-shaped abyss produced by the fall of Lucifer from heaven. It is divided into:"
                                )}
                              </p>
                              <ul className="list-disc list-inside pl-1 space-y-0.5 font-normal opacity-90">
                                <li><strong className="font-bold">{t("Antinferno", "Antinferno")}</strong></li>
                                <li><strong className="font-bold">{t("9 cerchi concentrici", "9 concentric circles")}</strong></li>
                              </ul>
                              <p className="pt-0.5">
                                {t(
                                  "Ciascuna zona ospita peccatori puniti per colpe progressivamente più gravi mentre si discende verso il centro della terra, dove Lucifero stesso giace intrappolato nel ghiaccio eterno del Cocito.",
                                  "Each area houses sinners punished for progressively more severe offenses as you descend towards the center of the earth, where Lucifer himself lies trapped in the eternal ice of Cocytus."
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-[#a4161a] font-bold">
                          {t("2. Topografia Morale", "2. Moral Topography")}
                        </span>
                        <p>
                          {isSimplifiedMode ? (
                            t(
                              "L'Inferno è ordinato in modo che più si va in basso, più i peccati sono gravi e brutti, e più la punizione fa soffrire.",
                              "Hell is ordered so that the lower you go, the more serious the sins are, and the harder the punishments become."
                            )
                          ) : (
                            t(
                              "Descendendo verso il centro della Terra, la gravità morale delle colpe aumenta: si incontra prima il disordine dell'incontinenza (i sensi), si scende poi alla violenza bestiale, fino a giungere alla malizia pura e fredda della frode e del tradimento nei cerchi più profondi.",
                              "As you descend toward the Earth's center, the moral gravity of sins escalates: moving from the disorder of incontinence (senses), through bestial violence, to the coldest malice of fraud and treachery inside the deepest rings."
                            )
                          )}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-[#a4161a] font-bold">
                          {t("3. La Legge del Contrappasso", "3. The Law of Retribution")}
                        </span>
                        <div>
                          {isSimplifiedMode ? (
                            <p>
                              {t(
                                "Le punizioni assomigliano al peccato fatto in vita: chi si è lasciato trascinare dall'amore è ora trascinato da una tempesta.",
                                "The punishments match the sins: people swept away by emotional passion are now dragged by strong winds."
                              )}
                            </p>
                          ) : (
                            <div className="space-y-1.5">
                              <p>
                                {t(
                                  "Ogni pena è regolata dal 'contrappasso' (dal latino contra-patior, soffrire il contrario). Rappresenta la perfetta correlazione tra il peccato commesso e il supplizio eterno. Può agire per:",
                                  "Every penalty is ruled by 'contrappasso' (meaning 'to suffer the opposite'). It mirrors the exact relationship between the earthly sin and eternal punishment. It can act by:"
                                )}
                              </p>
                              <ul className="list-disc list-inside pl-1 space-y-2 mt-1.5">
                                <li className="pl-1">
                                  <span className="font-bold">{t("analogia", "analogy")}</span>: {t(
                                    "la pena riproduce la natura del peccato, come i lussuriosi trascinati da una bufera di vento eterno che evoca la tempesta delle passioni",
                                    "the punishment reproduces the nature of the sin, like the lustful swept away by an eternal storm evoking the tempest of passion"
                                  )}
                                </li>
                                <li className="pl-1">
                                  <span className="font-bold">{t("per contrasto", "by contrast")}</span>: {t(
                                    "la pena è l'esatto opposto del vizio terreno, come gli ignavi costretti a correre febbrilmente dietro a una bandiera dopo una vita passata nell'indifferenza e nell'inerzia.",
                                    "the punishment is the exact opposite of the earthly vice, like the indifferent/lazy forced to run fast after a flag after a life of indifference."
                                  )}
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- FULLSCREEN IMAGE CAROUSEL GALLERY --- */}
      {isFullscreenCarouselOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-8 select-none font-mono"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full border-b border-stone-800 pb-4 shrink-0">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#a4161a] font-bold block mb-1">
                {t("VIAGGIO NELL'INFERNO DI DANTE", "DANTE'S JOURNEY INTO HELL")}
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white uppercase tracking-wider">
                {t("L'INFERNO ILLUSTRATO", "HELL ILLUSTRATED")}
              </h3>
            </div>

            {/* Pagination & Close group */}
            <div className="flex items-center gap-4">
              {carouselImages.length > 0 && (
                <span className="text-xs font-mono text-white font-semibold bg-stone-900 px-3 py-1 rounded-full border border-stone-800 shadow-sm">
                  {((carouselIndex % carouselImages.length) + 1)} / {carouselImages.length}
                </span>
              )}
              
              <button
                onClick={() => setIsFullscreenCarouselOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-950 border border-stone-800 text-white hover:text-white hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-lg cursor-pointer"
                title={t("Chiudi", "Close")}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Viewer Body (Takes maximum available space) */}
          <div className="relative flex-1 w-full flex items-center justify-center my-6 overflow-hidden">
            {carouselImages.length > 0 ? (
              (() => {
                const curImg = carouselImages[carouselIndex % carouselImages.length];
                return (
                  <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
                    {/* Navigation Left Arrow */}
                    {carouselImages.length > 1 && (carouselIndex % carouselImages.length) !== 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
                        }}
                        className="absolute left-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                        title={t("Precedente", "Previous")}
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}

                    {isVideoContent(curImg) ? (
                      isYouTubeUrl(curImg?.url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(curImg?.url) || ""}
                          className="w-[85vw] h-[65vh] md:w-[70vw] md:h-[75vh] max-h-[72vh] md:max-h-[78vh] max-w-full rounded-lg shadow-2xl border border-stone-850 transition-all duration-300 bg-black"
                          title={curImg?.caption || "YouTube Video"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={resolveUrl(curImg?.id === "default-journey" && imageStyle === "custom" && customJourneyImgUrl ? customJourneyImgUrl : curImg?.url)}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="max-h-[72vh] md:max-h-[78vh] max-w-full object-contain rounded-lg shadow-2xl border border-stone-850 transition-all duration-300"
                        />
                      )
                    ) : (
                      <img
                        src={resolveUrl(curImg?.id === "default-journey" && imageStyle === "custom" && customJourneyImgUrl ? customJourneyImgUrl : curImg?.url)}
                        alt={curImg?.caption || t("Illustrazione", "Illustration")}
                        className="max-h-[72vh] md:max-h-[78vh] max-w-full md:max-w-[90vw] object-contain rounded-lg shadow-2xl border border-stone-850 transition-all duration-300 pointer-events-none"
                      />
                    )}

                    {/* Navigation Right Arrow or Rewind */}
                    {carouselImages.length > 1 && (
                      (() => {
                        const isLast = (carouselIndex % carouselImages.length) === (carouselImages.length - 1);
                        return isLast ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarouselIndex(0);
                            }}
                            className="absolute right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                            title={t("Torna all'inizio", "Back to start")}
                          >
                            <RotateCcw size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
                            }}
                            className="absolute right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                            title={t("Successivo", "Next")}
                          >
                            <ChevronRight size={24} />
                          </button>
                        );
                      })()
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-stone-500 font-mono text-xs">{t("Nessuna immagine disponibile.", "No images available.")}</div>
            )}
          </div>

          {/* Bottom Caption Overlay */}
          {carouselImages.length > 0 && (
            <div className="w-full flex flex-col items-center justify-center border-t border-stone-800 pt-4 shrink-0 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-white max-w-3xl leading-relaxed">
                {carouselImages[carouselIndex % carouselImages.length]?.caption || t("Nessuna didascalia presente.", "No caption present.")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- FULLSCREEN DANTE PORTRAIT CAROUSEL GALLERY --- */}
      {isFullscreenDanteCarouselOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-8 select-none font-mono"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full border-b border-stone-800 pb-4 shrink-0">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#a4161a] font-bold block mb-1">
                {t("GALLERIA DEI RITRATTI DI DANTE", "DANTE PORTRAITS GALLERY")}
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white uppercase tracking-wider">
                {t("I VOLTI DEL SOMMO POETA", "THE FACES OF THE GREAT POET")}
              </h3>
            </div>

            {/* Pagination & Close group */}
            <div className="flex items-center gap-4">
              {danteCarouselImages.length > 0 && (
                <span className="text-xs font-mono text-white font-semibold bg-stone-900 px-3 py-1 rounded-full border border-stone-800 shadow-sm">
                  {((danteCarouselIndex % danteCarouselImages.length) + 1)} / {danteCarouselImages.length}
                </span>
              )}
              
              <button
                onClick={() => setIsFullscreenDanteCarouselOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-950 border border-stone-800 text-white hover:text-white hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-lg cursor-pointer animate-none"
                title={t("Chiudi", "Close")}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Viewer Body (Takes maximum available space) */}
          <div className="relative flex-1 w-full flex items-center justify-center my-6 overflow-hidden">
            {danteCarouselImages.length > 0 ? (
              (() => {
                const curImg = danteCarouselImages[danteCarouselIndex % danteCarouselImages.length];
                const isVideo = isVideoContent(curImg);
                return (
                  <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
                    {/* Navigation Left Arrow */}
                    {danteCarouselImages.length > 1 && (danteCarouselIndex % danteCarouselImages.length) !== 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDanteCarouselIndex((prev) => (prev - 1 + danteCarouselImages.length) % danteCarouselImages.length);
                        }}
                        className="absolute left-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                        title={t("Precedente", "Previous")}
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}

                    {isVideo ? (
                      isYouTubeUrl(curImg?.url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(curImg?.url) || ""}
                          className="w-[85vw] h-[65vh] md:w-[70vw] md:h-[75vh] max-h-[72vh] md:max-h-[78vh] max-w-full rounded-lg shadow-2xl border border-stone-850 transition-all duration-300 bg-black"
                          title={curImg?.caption || "YouTube Video"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={resolveUrl(curImg?.id === "default-dante-portrait-1" && imageStyle === "custom" && customDanteImgUrl ? customDanteImgUrl : curImg?.url)}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="max-h-[72vh] md:max-h-[78vh] max-w-full object-contain rounded-lg shadow-2xl border border-stone-850 transition-all duration-300"
                        />
                      )
                    ) : (
                      <img
                        src={resolveUrl(curImg?.id === "default-dante-portrait-1" && imageStyle === "custom" && customDanteImgUrl ? customDanteImgUrl : curImg?.url)}
                        alt={curImg?.caption || t("Ritratto", "Portrait")}
                        className="max-h-[72vh] md:max-h-[78vh] max-w-full md:max-w-[90vw] object-contain rounded-lg shadow-2xl border border-stone-850 transition-all duration-300 pointer-events-none"
                      />
                    )}

                    {/* Navigation Right Arrow or Rewind */}
                    {danteCarouselImages.length > 1 && (
                      (() => {
                        const isLast = (danteCarouselIndex % danteCarouselImages.length) === (danteCarouselImages.length - 1);
                        return isLast ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDanteCarouselIndex(0);
                            }}
                            className="absolute right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                            title={t("Torna all'inizio", "Back to start")}
                          >
                            <RotateCcw size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDanteCarouselIndex((prev) => (prev + 1) % danteCarouselImages.length);
                            }}
                            className="absolute right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                            title={t("Successivo", "Next")}
                          >
                            <ChevronRight size={24} />
                          </button>
                        );
                      })()
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-stone-500 font-mono text-xs">{t("Nessuna immagine disponibile.", "No images available.")}</div>
            )}
          </div>

          {/* Bottom Caption Overlay */}
          {danteCarouselImages.length > 0 && (
            <div className="w-full flex flex-col items-center justify-center border-t border-stone-800 pt-4 shrink-0 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-white max-w-3xl leading-relaxed">
                {danteCarouselImages[danteCarouselIndex % danteCarouselImages.length]?.caption || t("Nessuna didascalia presente.", "No caption present.")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* CANTO IMAGES FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreenCantoCarouselOpen && (
        (() => {
          const key = `${selectedDisciplina}_${activeCanto.number}`;
          const cantoImages = (() => {
            if (cantiCarousels && cantiCarousels[key] && cantiCarousels[key].length > 0) return cantiCarousels[key];
            if (selectedDisciplina === "Italiano") {
              const defaults = DEFAULT_CANTO_IMAGES[activeCanto.number];
              if (defaults && defaults.length > 0) return defaults;
            }
            return [
              {
                id: `default-canto-fallback-${activeCanto.number}`,
                url: activeCanto.number === 1 
                  ? "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200"
                  : activeCanto.number === 2
                  ? "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200"
                  : activeCanto.number === 3
                  ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
                  : activeCanto.number === 4
                  ? "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"
                  : "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200",
                caption: `${t("Incontro di studio facilitato per", "Facilitated study illustration for")} ${t(activeCanto.title, activeCanto.titleEn)}.`,
                scale: 1,
                x: 0,
                y: 0
              }
            ];
          })();
          const curCantoImg = cantoImages[cantoCarouselIndex % cantoImages.length];
          const isVideo = isVideoContent(curCantoImg);

          return (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-8 select-none font-mono"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between w-full border-b border-stone-800 pb-4 shrink-0">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#a4161a] font-bold block mb-1">
                    {selectedDisciplina === "Italiano"
                      ? `${t("STUDIO DEL CANTO", "CANTO STUDY")} ${activeCanto.romanNumeral}`
                      : `${t("STUDIO DELLA LEZIONE", "LESSON STUDY")} ${activeCanto.romanNumeral || (selectedCantoIndex + 1)}`}
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-white uppercase tracking-wider">
                    {t(activeCanto.title, activeCanto.titleEn)}
                  </h3>
                </div>

                {/* Pagination & Close group */}
                <div className="flex items-center gap-4">
                  {cantoImages.length > 0 && (
                    <span className="text-xs font-mono text-white font-semibold bg-stone-900 px-3 py-1 rounded-full border border-stone-800 shadow-sm">
                      {((cantoCarouselIndex % cantoImages.length) + 1)} / {cantoImages.length}
                    </span>
                  )}
                  
                  <button
                    onClick={() => setIsFullscreenCantoCarouselOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-950 border border-stone-800 text-white hover:text-white hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-200 shadow-lg cursor-pointer animate-none"
                    title={t("Chiudi", "Close")}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Main Viewer Body (Takes maximum available space) */}
              <div className="relative flex-1 w-full flex items-center justify-center my-6 overflow-hidden">
                {cantoImages.length > 0 ? (
                  <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
                    {/* Navigation Left Arrow */}
                    {cantoImages.length > 1 && (cantoCarouselIndex % cantoImages.length) !== 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCantoCarouselIndex((prev) => (prev - 1 + cantoImages.length) % cantoImages.length);
                        }}
                        className="absolute left-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                        title={t("Precedente", "Previous")}
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}

                    {isVideo ? (
                      isYouTubeUrl(curCantoImg?.url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(curCantoImg?.url) || ""}
                          className="w-[85vw] h-[65vh] md:w-[70vw] md:h-[75vh] max-h-[72vh] md:max-h-[78vh] max-w-full rounded-lg shadow-2xl border border-stone-850 transition-all duration-300 bg-black"
                          title={curCantoImg?.caption || "YouTube Video"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={resolveUrl(curCantoImg?.url)}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="max-h-[72vh] md:max-h-[78vh] max-w-full object-contain rounded-lg shadow-2xl border border-stone-850 transition-all duration-300"
                        />
                      )
                    ) : (
                      <img
                        src={resolveUrl(curCantoImg?.url)}
                        alt={curCantoImg?.caption || t("Illustrazione", "Illustration")}
                        className="max-h-[72vh] md:max-h-[78vh] max-w-full md:max-w-[90vw] object-contain rounded-lg shadow-2xl border border-stone-850 transition-all duration-300 pointer-events-none"
                      />
                    )}

                    {/* Navigation Right Arrow or Rewind */}
                    {cantoImages.length > 1 && (
                      (() => {
                        const isLast = (cantoCarouselIndex % cantoImages.length) === (cantoImages.length - 1);
                        return isLast ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCantoCarouselIndex(0);
                            }}
                            className="absolute right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                            title={t("Torna all'inizio", "Back to start")}
                          >
                            <RotateCcw size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCantoCarouselIndex((prev) => (prev + 1) % cantoImages.length);
                            }}
                            className="absolute right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/90 text-white border border-stone-800 hover:bg-[#a4161a] hover:border-[#a4161a] transition-all duration-250 shadow-xl cursor-pointer"
                            title={t("Successivo", "Next")}
                          >
                            <ChevronRight size={24} />
                          </button>
                        );
                      })()
                    )}
                  </div>
                ) : (
                  <div className="text-stone-500 font-mono text-xs">{t("Nessuna immagine disponibile.", "No images available.")}</div>
                )}
              </div>

              {/* Bottom Caption Overlay */}
              {cantoImages.length > 0 && (
                <div className="w-full flex flex-col items-center justify-center border-t border-stone-800 pt-4 shrink-0 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-white max-w-3xl leading-relaxed">
                    {curCantoImg?.caption || t("Nessuna didascalia presente.", "No caption present.")}
                  </p>
                </div>
              )}
            </div>
          );
        })()
      )}

      {/* --- A3. PERSONALIZZAZIONE DIDATTICA - STUDENT PROFILES MODAL --- */}
      {isProfileModalOpen && (
        <div
          id="student-profile-customization-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 bottom-0 top-[64px] z-[75] flex items-center justify-center p-6 sm:p-8 bg-black/70 backdrop-blur-sm"
        >
          <div
            className={`w-full max-w-2xl rounded-lg border-2 text-left shadow-2xl relative flex flex-col max-h-[80vh] ${
              isDarkMode ? "bg-stone-950 border-stone-800 text-[#f5f3f4]" : "bg-white border-stone-300 text-gray-800"
            }`}
          >
            {/* Elegant, Accessible Top Right Close "X" Button */}
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-all border ${
                isDarkMode 
                  ? "border-stone-800 hover:border-stone-750 text-stone-400 hover:text-white bg-stone-900/80" 
                  : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100"
              }`}
              aria-label={t("Chiudi", "Close")}
            >
              <X size={16} />
            </button>

            {/* Locked Header */}
            <div className="p-6 pb-3 border-b border-stone-850/10 pr-10">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#a4161a] font-bold block mb-1">
                {t("Personalizzazione Didattica Individuale", "Individual Educational Customization")}
              </span>
              <h3 className={`text-base sm:text-lg font-serif font-bold flex items-center gap-1.5 ${isDarkMode ? "text-stone-200" : "text-[#161a1d]"}`}>
                <User className="text-[#a4161a]" size={18} />
                {t("Pannello Profilo Alunno", "Student Profile Panel")}
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
                {t(
                  "Rispetto alla differenziazione a livello di classe, qui puoi impostare e salvare un profilo didattico su misura per un singolo alunno. L'app ricorderà tutte le sue preferenze grafiche, di semplificazione, zoom e personalizzazione delle immagini.",
                  "Compared to class-level differentiation, here you can set and save a custom learning profile tailored to an individual student. The app will remember all display, simplification, zoom, and image custom preferences."
                )}
              </p>
            </div>

            {/* Scrollable container with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Side: Saved Profiles List */}
              <div className="md:col-span-5 space-y-4">
                <div className={`text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold border-b pb-1 ${
                  isDarkMode ? "text-stone-400 border-stone-800" : "text-stone-500 border-stone-200"
                }`}>
                  <Users size={14} className={isDarkMode ? "text-stone-100" : "text-stone-900"} strokeWidth={2.5} />
                  <span>{t("Profili Salvati", "Saved Profiles")}</span>
                </div>

                {personalProfiles.length === 0 ? (
                  <p className="text-xs italic text-stone-500 py-4">
                    {t("Nessun profilo alunno creato. Usa il modulo a destra per crearne uno.", "No student profile created. Use the form on the right to start creating.")}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {personalProfiles.map((p) => {
                      const isActive = activeProfileId === p.id;
                      return (
                        <div
                          key={p.id}
                          className={`p-3 rounded border transition-all flex items-center justify-between ${
                            isActive
                              ? isDarkMode
                                ? "border-[#a4161a] bg-stone-900 text-white font-medium"
                                : "border-[#a4161a] bg-stone-100 text-stone-900 font-medium"
                              : isDarkMode
                              ? "border-stone-800 bg-stone-900/40 hover:bg-stone-900 text-stone-300"
                              : "border-gray-200 bg-stone-50 hover:bg-stone-100 text-stone-800"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              handleLoadProfile(p);
                            }}
                            className="flex-1 text-left flex items-center gap-2"
                          >
                            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#a4161a]" : "bg-stone-400"}`} />
                            <span className="text-xs font-bold font-mono tracking-wide uppercase truncate">
                              {p.name}
                            </span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = personalProfiles.filter((prof) => prof.id !== p.id);
                                setPersonalProfiles(updated);
                                safeLocalStorageSetItem("dante_personal_student_profiles", JSON.stringify(updated));
                                if (activeProfileId === p.id) {
                                  handleResetProfile();
                                }
                              }}
                              className="p-1.5 rounded hover:bg-red-500/10 text-stone-400 hover:text-red-500"
                              title={t("Elimina profilo", "Delete profile")}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeProfileId ? (
                  <div className="space-y-3 mt-4">
                    <div className="p-3 rounded border border-dashed border-stone-300 dark:border-stone-800 bg-transparent text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#a4161a] font-mono select-none uppercase text-[10px]">
                          {t("Profilo in uso", "Profile in use")}
                        </span>
                        <button
                          type="button"
                          onClick={handleResetProfile}
                          className={`text-[9px] font-mono tracking-wider uppercase underline transition-colors ${
                            isDarkMode ? "text-stone-400" : "text-stone-500"
                          } hover:text-[#a4161a]`}
                        >
                          {t("Disattiva", "Deactivate")}
                        </button>
                      </div>
                      <p className="italic leading-snug text-stone-500 font-light">
                        {t(
                          "Qualsiasi modifica apportata ai controlli (zoom, CAA, parafrasi, tema, colori) verrà salvata automaticamente nel profilo attivo.",
                          "Any change made to controls (zoom, AAC, paraphrase, theme, colors) is immediately auto-saved into the active profile settings."
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const baseQuestions = customQuestions && customQuestions.length > 0 
                          ? customQuestions 
                          : JSON.parse(JSON.stringify(quizQuestions));
                        setEditingQuestions(baseQuestions);
                        setEditingQuestionIdx(0);
                        setIsQuizEditorOpen(true);
                      }}
                      className={`w-full py-2.5 px-3 rounded font-mono text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg border ${
                        isDarkMode 
                          ? "bg-stone-900 border-stone-800 hover:bg-stone-850 text-white" 
                          : "bg-black border-stone-950 hover:bg-stone-900 text-white"
                      }`}
                    >
                      <ClipboardList size={14} />
                      {t("Crea Verifica Personalizzata", "Create Custom Quiz")}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsReportsOpen(true)}
                      className={`w-full py-2.5 px-3 rounded font-mono text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg border ${
                        isDarkMode 
                          ? "bg-stone-900 border-stone-800 hover:bg-stone-850 text-stone-200"
                          : "bg-stone-100 border-stone-300 hover:bg-stone-200 text-stone-700"
                      }`}
                    >
                      <History size={14} />
                      {t("Visualizza Report Verifiche", "View Completed Quizzes")}
                    </button>
                  </div>
                ) : (
                  <div className={`p-3 rounded border border-dashed text-xs text-center space-y-1 mt-4 ${
                    isDarkMode ? "border-stone-800 bg-stone-900/10 text-stone-500" : "border-stone-300 bg-stone-50 text-stone-600"
                  }`}>
                    <AlertCircle size={15} className="mx-auto text-stone-400 mb-0.5" />
                    <p className="font-mono text-[10px] uppercase font-bold text-stone-400">
                      {t("Verifica Personalizzata", "Custom Quiz Evaluation")}
                    </p>
                    <p className="leading-snug text-[10px]">
                      {t(
                        "Attiva o seleziona un profilo alunno per sbloccare la creazione di verifiche e quiz personalizzati d'aula.",
                        "Activate or select a student profile first to unlock the creation of custom quiz evaluations."
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side: Design Form / Editor */}
              <div className="md:col-span-7 space-y-4">
                <div className={`text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold border-b pb-1 ${
                  isDarkMode ? "text-stone-400 border-stone-800" : "text-stone-500 border-stone-200"
                }`}>
                  <Settings size={14} className={isDarkMode ? "text-stone-100" : "text-stone-900"} strokeWidth={2.5} />
                  <span>{t("Configura Preferenze Alunno", "Configure Student Settings")}</span>
                </div>

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-stone-400 block">
                    {t("Nome Studente (es. Andrea)", "Student Name (e.g. Andrea)")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("Es. Andrea G.", "e.g. Andrea G.")}
                    value={newPersonalProfileName}
                    onChange={(e) => setNewPersonalProfileName(e.target.value)}
                    className={`w-full px-3 py-2 rounded border text-xs leading-none outline-none ${
                      isDarkMode
                        ? "bg-stone-900 border-stone-800 text-white placeholder-stone-600 focus:border-stone-600"
                        : "bg-white border-gray-300 text-stone-900 placeholder-gray-400 focus:border-stone-800"
                    }`}
                  />
                </div>

                {/* Sub-configuration for Student Profile Image styling */}
                <div className="space-y-2 pt-2 border-t border-dashed border-stone-850/40">
                  <label className="text-xs font-mono font-bold uppercase text-stone-400 block">
                    {t("Modifica Immagini di Default", "Modify Default Images")}
                  </label>
                  <p className="text-[10px] leading-normal text-stone-500">
                    {t(
                      "Personalizza lo stile o nascondi le illustrazioni della vita di Dante e del viaggio per ridurre il carico visivo o adattarlo alle necessità dello studente.",
                      "Customize style or hide all default illustrations of Dante or journey details to minimize visual overload and match cognitive targets."
                    )}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { id: "default", label: t("Default (Artistico)", "Default") },
                      { id: "custom", label: t("Immagini Personalizzate", "Custom Images") },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setImageStyle(style.id);
                        }}
                        className={`p-2 rounded border text-[10px] font-mono uppercase font-bold text-center transition-all ${
                          imageStyle === style.id
                            ? isDarkMode
                              ? "bg-stone-100 border-stone-100 text-black shadow"
                              : "bg-black border-black text-white shadow"
                            : isDarkMode
                            ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800"
                            : "bg-stone-50 border-gray-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>

                  {/* Input for Custom URLs if style chosen is custom */}
                  {imageStyle === "custom" && (
                    <div className="space-y-4 mt-2 p-3 rounded border border-dashed border-stone-800 animate-slide-up bg-stone-900/10">
                      {/* Custom Dante Portrait */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-stone-400 uppercase select-none font-bold block">
                          {t("Ritratto Dante (File da PC o URL)", "Dante Portrait (PC File or URL)")}
                        </label>
                        <div className="flex items-start gap-2.5">
                          {customDanteImgUrl ? (
                            <div className="relative w-11 h-11 rounded border border-stone-700 overflow-hidden bg-stone-900 flex-shrink-0">
                              <img src={customDanteImgUrl} alt="Preview Dante" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setCustomDanteImgUrl("")}
                                className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 font-bold"
                                title={t("Rimuovi", "Remove")}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded border border-dashed border-stone-700 flex items-center justify-center bg-stone-900/40 text-stone-500 flex-shrink-0">
                              <Image size={15} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-bold uppercase cursor-pointer transition-all shadow ${
                              isDarkMode 
                                ? "bg-stone-850 hover:bg-stone-800 border-stone-750 text-white" 
                                : "bg-black hover:bg-stone-900 border-stone-950 text-white"
                            }`}>
                              <Upload size={10} />
                              {t("Scegli Immagine da PC", "Choose PC Image")}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      compressImageToDataUrl(reader.result as string).then((compressed) => {
                                        setCustomDanteImgUrl(compressed);
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder={t("oppure inserisci URL online...", "or paste online URL...")}
                              value={customDanteImgUrl}
                              onChange={(e) => setCustomDanteImgUrl(e.target.value)}
                              className={`w-full px-2 py-1 rounded border text-[10px] outline-none ${
                                isDarkMode ? "bg-stone-950 border-stone-800 text-white" : "bg-white border-gray-300 text-stone-900"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Custom Journey Image */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-800/20">
                        <label className="text-[9px] font-mono text-stone-400 uppercase select-none font-bold block">
                          {t("Illustrazione Viaggio Dante (File da PC o URL)", "Dante Journey Illustration (PC File or URL)")}
                        </label>
                        <div className="flex items-start gap-2.5">
                          {customJourneyImgUrl ? (
                            <div className="relative w-11 h-11 rounded border border-stone-700 overflow-hidden bg-stone-900 flex-shrink-0">
                              <img src={customJourneyImgUrl} alt="Preview Journey" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setCustomJourneyImgUrl("")}
                                className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 font-bold"
                                title={t("Rimuovi", "Remove")}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded border border-dashed border-stone-700 flex items-center justify-center bg-stone-900/40 text-stone-500 flex-shrink-0">
                              <Image size={15} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-bold uppercase cursor-pointer transition-all shadow ${
                              isDarkMode 
                                ? "bg-stone-850 hover:bg-stone-800 border-stone-750 text-white" 
                                : "bg-black hover:bg-stone-900 border-stone-950 text-white"
                            }`}>
                              <Upload size={10} />
                              {t("Scegli Immagine da PC", "Choose PC Image")}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      compressImageToDataUrl(reader.result as string).then((compressed) => {
                                        setCustomJourneyImgUrl(compressed);
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder={t("oppure inserisci URL online...", "or paste online URL...")}
                              value={customJourneyImgUrl}
                              onChange={(e) => setCustomJourneyImgUrl(e.target.value)}
                              className={`w-full px-2 py-1 rounded border text-[10px] outline-none ${
                                isDarkMode ? "bg-stone-950 border-stone-800 text-white" : "bg-white border-gray-300 text-stone-900"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Thin Horizontal Splitter Line */}
                      <hr className={`border-t ${isDarkMode ? "border-stone-800/60" : "border-stone-200"}`} />

                      {/* Section Custom Backgrounds Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-stone-400 block tracking-wider">
                          🌄 {t("Sfondi Sezioni Personalizzati", "Custom Section Backgrounds")}
                        </label>
                      </div>

                      {/* Hero Background */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-stone-400 uppercase select-none font-bold block">
                          {t("Sfondo Sezione HERO (PC o URL)", "HERO Section Background (PC or URL)")}
                        </label>
                        <div className="flex items-start gap-2.5">
                          {heroBgImgUrl ? (
                            <div className="relative w-11 h-11 rounded border border-stone-750 overflow-hidden bg-stone-900 flex-shrink-0">
                              <img src={heroBgImgUrl} alt="Preview Hero BG" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setHeroBgImgUrl("")}
                                className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 font-bold"
                                title={t("Rimuovi", "Remove")}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded border border-dashed border-stone-750 flex items-center justify-center bg-stone-900/40 text-stone-500 flex-shrink-0">
                              <Image size={15} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-bold uppercase cursor-pointer transition-all shadow ${
                              isDarkMode 
                                ? "bg-stone-850 hover:bg-stone-800 border-stone-750 text-white" 
                                : "bg-black hover:bg-stone-900 border-stone-950 text-white"
                            }`}>
                              <Upload size={10} />
                              {t("Carica da PC", "Upload from PC")}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      compressImageToDataUrl(reader.result as string).then((compressed) => {
                                        setHeroBgImgUrl(compressed);
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder={t("oppure inserisci URL online...", "or paste online URL...")}
                              value={heroBgImgUrl}
                              onChange={(e) => setHeroBgImgUrl(e.target.value)}
                              className={`w-full px-2 py-1 rounded border text-[10px] outline-none ${
                                isDarkMode ? "bg-stone-950 border-stone-800 text-white focus:border-stone-600" : "bg-white border-gray-300 text-stone-900 focus:border-stone-800"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Commedia Background */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-800/20">
                        <label className="text-[9px] font-mono text-stone-400 uppercase select-none font-bold block">
                          {t("Sfondo DIVINA COMMEDIA (PC o URL)", "DIVINA COMMEDIA Background (PC or URL)")}
                        </label>
                        <div className="flex items-start gap-2.5">
                          {commediaBgImgUrl ? (
                            <div className="relative w-11 h-11 rounded border border-stone-750 overflow-hidden bg-stone-900 flex-shrink-0">
                              <img src={commediaBgImgUrl} alt="Preview Commedia BG" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setCommediaBgImgUrl("")}
                                className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 font-bold"
                                title={t("Rimuovi", "Remove")}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded border border-dashed border-stone-750 flex items-center justify-center bg-stone-900/40 text-stone-500 flex-shrink-0">
                              <Image size={15} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-bold uppercase cursor-pointer transition-all shadow ${
                              isDarkMode 
                                ? "bg-stone-850 hover:bg-stone-800 border-stone-750 text-white" 
                                : "bg-black hover:bg-stone-900 border-stone-950 text-white"
                            }`}>
                              <Upload size={10} />
                              {t("Carica da PC", "Upload from PC")}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      compressImageToDataUrl(reader.result as string).then((compressed) => {
                                        setCommediaBgImgUrl(compressed);
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder={t("oppure inserisci URL online...", "or paste online URL...")}
                              value={commediaBgImgUrl}
                              onChange={(e) => setCommediaBgImgUrl(e.target.value)}
                              className={`w-full px-2 py-1 rounded border text-[10px] outline-none ${
                                isDarkMode ? "bg-stone-950 border-stone-800 text-white focus:border-stone-600" : "bg-white border-gray-300 text-stone-900 focus:border-stone-800"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dante Explorer Background */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-800/20">
                        <label className="text-[9px] font-mono text-stone-400 uppercase select-none font-bold block">
                          {t("Sfondo DANTE EXPLORER (PC o URL)", "DANTE EXPLORER Background (PC or URL)")}
                        </label>
                        <div className="flex items-start gap-2.5">
                          {explorerBgImgUrl ? (
                            <div className="relative w-11 h-11 rounded border border-stone-750 overflow-hidden bg-stone-900 flex-shrink-0">
                              <img src={explorerBgImgUrl} alt="Preview Explorer BG" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setExplorerBgImgUrl("")}
                                className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 font-bold"
                                title={t("Rimuovi", "Remove")}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded border border-dashed border-stone-750 flex items-center justify-center bg-stone-900/40 text-stone-500 flex-shrink-0">
                              <Image size={15} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-bold uppercase cursor-pointer transition-all shadow ${
                              isDarkMode 
                                ? "bg-stone-850 hover:bg-stone-800 border-stone-750 text-white" 
                                : "bg-black hover:bg-stone-900 border-stone-950 text-white"
                            }`}>
                              <Upload size={10} />
                              {t("Carica da PC", "Upload from PC")}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      compressImageToDataUrl(reader.result as string).then((compressed) => {
                                        setExplorerBgImgUrl(compressed);
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder={t("oppure inserisci URL online...", "or paste online URL...")}
                              value={explorerBgImgUrl}
                              onChange={(e) => setExplorerBgImgUrl(e.target.value)}
                              className={`w-full px-2 py-1 rounded border text-[10px] outline-none ${
                                isDarkMode ? "bg-stone-950 border-stone-800 text-white focus:border-stone-600" : "bg-white border-gray-300 text-stone-900 focus:border-stone-800"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick actions for setting save */}
                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={!newPersonalProfileName.trim()}
                    className={`flex-1 py-2.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider transition-colors justify-center flex items-center gap-1.5 ${
                      newPersonalProfileName.trim()
                        ? "bg-black border border-stone-800 hover:bg-stone-900 text-white cursor-pointer"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-850"
                    }`}
                  >
                    <Plus size={14} />
                    {t("Salva e Attiva Profilo", "Save & Activate Profile")}
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TEACHER CUSTOM QUIZ / VALIDATION EDITOR MODAL --- */}
      {isQuizEditorOpen && (
        <div
          id="custom-quiz-editor-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 sm:p-8 bg-black/70 backdrop-blur-sm"
        >
          <div
            className={`w-full max-w-2xl rounded-lg border-2 text-left shadow-2xl relative flex flex-col max-h-[90vh] ${
              isDarkMode ? "bg-stone-950 border-stone-800 text-[#f5f3f4]" : "bg-white border-stone-300 text-gray-800"
            }`}
          >
            {/* Elegant Close "X" Button */}
            <button
              onClick={() => setIsQuizEditorOpen(false)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-all border ${
                isDarkMode 
                  ? "border-stone-800 hover:border-stone-750 text-stone-400 hover:text-white bg-stone-900/80" 
                  : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100"
              }`}
              aria-label={t("Chiudi", "Close")}
            >
              <X size={16} />
            </button>

            {/* Locked Header */}
            <div className="p-6 pb-3 border-b border-stone-850/10 pr-10">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#a4161a] font-bold block mb-1">
                {t("Area Docente", "Teacher Area")}
              </span>
              <h3 className={`text-base sm:text-lg font-serif font-bold flex items-center gap-1.5 ${isDarkMode ? "text-stone-200" : "text-[#161a1d]"}`}>
                <FileQuestion className="text-[#a4161a]" size={18} />
                {t("Crea Verifica Personalizzata", "Create Custom Quiz Evaluation")}
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
                {t(
                  "Modifica le domande del quiz interattivo per questo alunno. Puoi adattare il livello dei quesiti alle sue capacità specifiche.",
                  "Modify the interactive quiz questions for this student. You can adapt the question difficulty level to their specific capabilities."
                )}
              </p>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Question Selection Tab Row */}
              <div className="flex items-center gap-1 border-b pb-2 border-stone-850/10 overflow-x-auto">
                {editingQuestions.map((eq, idx) => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => setEditingQuestionIdx(idx)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-mono uppercase font-bold transition-all border shrink-0 ${
                      editingQuestionIdx === idx
                        ? "bg-[#a4161a] border-[#a4161a] text-white"
                        : isDarkMode
                        ? "bg-stone-900 border-stone-850 text-stone-400 hover:bg-stone-850"
                        : "bg-stone-100 border-gray-200 text-stone-600 hover:bg-stone-150"
                    }`}
                  >
                    {t(`Domanda ${idx + 1}`, `Question ${idx + 1}`)}
                  </button>
                ))}
              </div>

              {/* Active editing question form */}
              {editingQuestions[editingQuestionIdx] && (() => {
                const q = editingQuestions[editingQuestionIdx];
                const updateField = (field: keyof QuizQuestion, value: any) => {
                  setEditingQuestions(prev => prev.map((item, idx) => idx === editingQuestionIdx ? { ...item, [field]: value } : item));
                };

                const updateOption = (optIdx: number, isEn: boolean, val: string) => {
                  setEditingQuestions(prev => prev.map((item, qIdx) => {
                    if (qIdx === editingQuestionIdx) {
                      const opts = isEn ? [...item.optionsEn] : [...item.options];
                      opts[optIdx] = val;
                      return isEn ? { ...item, optionsEn: opts } : { ...item, options: opts };
                    }
                    return item;
                  }));
                };

                return (
                  <div className="space-y-4 animate-fade-in" key={editingQuestionIdx}>
                    {/* Question text */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold block">
                          {t("Testo Domanda (Italiano)", "Question Text (Italian)")}
                        </label>
                        <textarea
                          rows={2}
                          value={q.question}
                          onChange={(e) => updateField("question", e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded border text-xs outline-none ${
                            isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold block">
                          {t("Testo Domanda (Inglese)", "Question Text (English)")}
                        </label>
                        <textarea
                          rows={2}
                          value={q.questionEn}
                          onChange={(e) => updateField("questionEn", e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded border text-xs outline-none ${
                            isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold block">
                        ⚙️ {t("Opzioni di Risposta e Traduzioni", "Answer Options and Translations")}
                      </span>
                      
                      {/* Option A */}
                      <div className="p-3 border rounded border-stone-850/10 space-y-2 bg-stone-900/5">
                        <span className="text-[10px] font-bold text-[#a4161a] font-mono uppercase">
                          {t("Opzione A", "Option A")}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Italiano"
                            value={q.options[0] || ""}
                            onChange={(e) => updateOption(0, false, e.target.value)}
                            className={`px-2 py-1 rounded border text-[11px] ${
                              isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="English"
                            value={q.optionsEn[0] || ""}
                            onChange={(e) => updateOption(0, true, e.target.value)}
                            className={`px-2 py-1 rounded border text-[11px] ${
                              isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Option B */}
                      <div className="p-3 border rounded border-stone-850/10 space-y-2 bg-stone-900/5">
                        <span className="text-[10px] font-bold text-[#a4161a] font-mono uppercase">
                          {t("Opzione B", "Option B")}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Italiano"
                            value={q.options[1] || ""}
                            onChange={(e) => updateOption(1, false, e.target.value)}
                            className={`px-2 py-1 rounded border text-[11px] ${
                              isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="English"
                            value={q.optionsEn[1] || ""}
                            onChange={(e) => updateOption(1, true, e.target.value)}
                            className={`px-2 py-1 rounded border text-[11px] ${
                              isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Option C */}
                      <div className="p-3 border rounded border-stone-850/10 space-y-2 bg-stone-900/5">
                        <span className="text-[10px] font-bold text-[#a4161a] font-mono uppercase">
                          {t("Opzione C", "Option C")}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Italiano"
                            value={q.options[2] || ""}
                            onChange={(e) => updateOption(2, false, e.target.value)}
                            className={`px-2 py-1 rounded border text-[11px] ${
                              isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="English"
                            value={q.optionsEn[2] || ""}
                            onChange={(e) => updateOption(2, true, e.target.value)}
                            className={`px-2 py-1 rounded border text-[11px] ${
                              isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Correct answer index */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-850/10">
                      <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold block">
                        ✔️ {t("Qual è la risposta corretta?", "Which is the correct answer?")}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateField("correctAnswerIndex", idx)}
                            className={`p-2 rounded border text-xs font-mono uppercase font-bold text-center transition-all ${
                              q.correctAnswerIndex === idx
                                ? "bg-emerald-700 border-emerald-500 text-white shadow font-extrabold"
                                : isDarkMode
                                ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800"
                                : "bg-stone-50 border-gray-200 text-[#161a1d] hover:bg-stone-100"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)} {idx === q.correctAnswerIndex ? "✔️" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Explanation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-850/10">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold block">
                          {t("Feedback Correttezza (Italiano)", "Correct Feedback Explanation (Italian)")}
                        </label>
                        <textarea
                          rows={2}
                          value={q.feedback || ""}
                          onChange={(e) => updateField("feedback", e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded border text-xs outline-none ${
                            isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold block">
                          {t("Feedback Correttezza (Inglese)", "Correct Feedback Explanation (English)")}
                        </label>
                        <textarea
                          rows={2}
                          value={q.feedbackEn || ""}
                          onChange={(e) => updateField("feedbackEn", e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded border text-xs outline-none ${
                            isDarkMode ? "bg-stone-900 border-stone-800 text-white focus:border-[#a4161a]" : "bg-white border-gray-300 text-stone-900 focus:border-[#a4161a]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Locked Footer with Actions */}
            <div className="p-6 pt-3 border-t border-stone-850/10 flex flex-col sm:flex-row gap-3 justify-between items-center bg-stone-900/5">
              <button
                type="button"
                onClick={() => {
                  if (confirm(t("Sei sicuro di voler ripristinare le domande predefinite per questo quiz?", "Are you sure you want to restore default questions for this quiz?"))) {
                    setEditingQuestions(JSON.parse(JSON.stringify(quizQuestions)));
                    setEditingQuestionIdx(0);
                  }
                }}
                className={`py-2 px-3.5 rounded text-xs font-mono uppercase tracking-wider font-bold border transition-colors ${
                  isDarkMode 
                    ? "border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white" 
                    : "border-gray-300 hover:border-gray-400 text-gray-600 hover:text-black"
                }`}
              >
                🔄 {t("Ripristina Predefinite", "Restore Defaults")}
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuizEditorOpen(false)}
                  className={`py-2 px-3.5 rounded text-xs font-mono uppercase tracking-wider font-bold border transition-colors ${
                    isDarkMode 
                      ? "border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white" 
                      : "border-gray-300 hover:border-gray-400 text-gray-600 hover:text-black"
                  }`}
                >
                  {t("Annulla", "Cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomQuestions(editingQuestions);
                    setIsQuizEditorOpen(false);
                    // Reset quiz to reflect new questions immediately
                    setUserAnswers({});
                    setSubmittedQuestions({});
                    setScore(0);
                    setActiveQuestionIndex(0);
                  }}
                  className="py-2 px-5 rounded text-white font-mono text-xs font-bold uppercase tracking-wider bg-[#a4161a] hover:bg-[#e5383b] transition-colors"
                >
                  💾 {t("Salva e Applica", "Save & Apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TEACHER COMPLETED QUIZZES / EVALUATION REPORTS MODAL --- */}
      {isReportsOpen && (
        <div
          id="custom-quiz-reports-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 sm:p-8 bg-black/70 backdrop-blur-sm"
        >
          <div
            className={`w-full max-w-2xl rounded-lg border-2 text-left shadow-2xl relative flex flex-col max-h-[90vh] ${
              isDarkMode ? "bg-stone-950 border-stone-800 text-[#f5f3f4]" : "bg-white border-stone-300 text-gray-800"
            }`}
          >
            {/* Elegant Close "X" Button */}
            <button
              onClick={() => {
                setIsReportsOpen(false);
                setExpandedReportId(null);
              }}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-all border ${
                isDarkMode 
                  ? "border-stone-800 hover:border-stone-750 text-stone-400 hover:text-white bg-stone-900/80" 
                  : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100"
              }`}
              aria-label={t("Chiudi", "Close")}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="p-6 pb-3 border-b border-stone-850/10 pr-10">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#a4161a] font-bold block mb-1">
                {t("Area Docente", "Teacher Area")}
              </span>
              <h3 className={`text-base sm:text-lg font-serif font-bold flex items-center gap-1.5 ${isDarkMode ? "text-stone-200" : "text-[#161a1d]"}`}>
                <History className="text-[#a4161a]" size={18} />
                {t("Report Verifiche Completate", "Completed Quizzes Report")}
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
                {t(
                  "Risultati e dati d'apprendimento registrati per l'alunno: ",
                  "Recorded quiz results and learning diagnostics for student: "
                )}
                <strong className="text-[#a4161a] font-bold">
                  {personalProfiles.find(p => p.id === activeProfileId)?.name}
                </strong>
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {quizReports.length === 0 ? (
                <div className={`p-8 rounded-lg border border-dashed text-center space-y-3 ${
                  isDarkMode ? "border-stone-800 bg-stone-900/10" : "border-gray-300 bg-gray-50"
                }`}>
                  <AlertCircle size={32} className="mx-auto text-stone-400" />
                  <div className="space-y-1">
                    <p className={`text-xs font-mono font-bold uppercase ${isDarkMode ? "text-stone-400" : "text-gray-600"}`}>
                      {t("Nessun Report Disponibile", "No Evaluation Reports Available")}
                    </p>
                    <p className={`text-[11px] leading-relaxed max-w-md mx-auto ${isDarkMode ? "text-stone-500" : "text-gray-500"}`}>
                      {t(
                        "L'alunno non ha ancora completato alcuna verifica. I risultati verranno registrati automaticamente qui non appena completerà il quiz finale.",
                        "The student has not completed any evaluations yet. Diagnostic scores and answers will be recorded here automatically once they submit the quiz."
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Bento Grid Stats Card */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg border text-center ${
                      isDarkMode ? "bg-stone-900/50 border-stone-850" : "bg-gray-50 border-gray-100"
                    }`}>
                      <span className="text-[9px] font-mono uppercase text-stone-400 block mb-1 select-none">
                        {t("Verifiche", "Quizzes")}
                      </span>
                      <span className="text-lg font-mono font-black text-[#a4161a]">
                        {quizReports.length}
                      </span>
                    </div>

                    <div className={`p-3 rounded-lg border text-center ${
                      isDarkMode ? "bg-stone-900/50 border-stone-850" : "bg-gray-50 border-gray-100"
                    }`}>
                      <span className="text-[9px] font-mono uppercase text-stone-400 block mb-1 select-none">
                        {t("Media Punti", "Avg Score")}
                      </span>
                      <span className="text-lg font-mono font-black text-emerald-600">
                        {(quizReports.reduce((acc, curr) => acc + curr.score, 0) / quizReports.length).toFixed(1)}
                      </span>
                    </div>

                    <div className={`p-3 rounded-lg border text-center ${
                      isDarkMode ? "bg-stone-900/50 border-stone-850" : "bg-gray-50 border-gray-100"
                    }`}>
                      <span className="text-[9px] font-mono uppercase text-stone-400 block mb-1 select-none">
                        {t("Punteggio Max", "Max Score")}
                      </span>
                      <span className="text-lg font-mono font-black text-amber-500">
                        {Math.max(...quizReports.map(r => r.score))}
                      </span>
                    </div>
                  </div>

                  {/* List of Report Sessions */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase text-[#a4161a] block tracking-wider font-bold">
                      📜 {t("Sessioni di Verifica Svolte", "Evaluation Attempt History")}
                    </span>
                    
                    {quizReports.map((report) => {
                      const isExpanded = expandedReportId === report.id;
                      const percent = (report.score / report.totalQuestions) * 100;
                      let badgeColor = "bg-red-500/10 text-red-500 border-red-500/20";
                      let badgeText = t("Insufficiente", "Need Study");

                      if (percent === 100) {
                        badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                        badgeText = t("Eccellente", "Excellent");
                      } else if (percent >= 80) {
                        badgeColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                        badgeText = t("Ottimo", "Very Good");
                      } else if (percent >= 60) {
                        badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                        badgeText = t("Superato", "Passed");
                      }

                      return (
                        <div
                          key={report.id}
                          className={`rounded border transition-all ${
                            isDarkMode 
                              ? "bg-stone-900/30 border-stone-850 hover:border-stone-800" 
                              : "bg-stone-50/50 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {/* Header Row */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setExpandedReportId(isExpanded ? null : report.id);
                              }
                            }}
                            className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer outline-none"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                                  {badgeText}
                                </span>
                                <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                                  <Calendar size={11} />
                                  {report.timestamp}
                                </span>
                              </div>
                              <p className={`text-xs font-serif font-bold ${isDarkMode ? "text-stone-300" : "text-gray-700"}`}>
                                {t("Verifica di Letteratura Dantesca", "Dante's Literature Quiz Evaluation")}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="text-right">
                                <span className="text-xs font-mono text-stone-400 block sm:inline mr-1">
                                  {t("Esito:", "Result:")}
                                </span>
                                <span className="text-sm font-mono font-bold text-[#a4161a]">
                                  {report.score} / {report.totalQuestions}
                                </span>
                              </div>
                              
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(t("Sei sicuro di voler rimuovere questo report?", "Are you sure you want to delete this report?"))) {
                                    setQuizReports(prev => prev.filter(r => r.id !== report.id));
                                    if (isExpanded) setExpandedReportId(null);
                                  }
                                }}
                                className="p-2 rounded text-stone-400 hover:text-red-500 hover:bg-stone-550/10 transition-colors"
                                title={t("Rimuovi Report", "Remove Report")}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Expandable Answers Details */}
                          {isExpanded && (
                            <div className={`p-4 border-t space-y-3 ${
                              isDarkMode ? "bg-stone-950/40 border-stone-850" : "bg-white border-gray-150"
                            }`}>
                              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block">
                                🕵️ {t("Dettaglio Risposte Alunno", "Student Answers Breakdown")}
                              </span>
                              
                              <div className="space-y-3">
                                {report.answers.map((ans, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded border text-xs space-y-2 ${
                                      ans.isCorrect
                                        ? isDarkMode
                                          ? "bg-emerald-950/20 border-emerald-905/30 text-stone-200"
                                          : "bg-emerald-50 border-emerald-200 text-gray-850"
                                        : isDarkMode
                                        ? "bg-red-955/20 border-red-905/30 text-stone-200"
                                        : "bg-red-50 border-red-200 text-gray-850"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="font-mono font-bold text-[#a4161a] select-none text-[10px]">
                                        Q{idx + 1}
                                      </span>
                                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                        ans.isCorrect ? "bg-emerald-600/10 text-emerald-500 border border-emerald-600/20" : "bg-red-600/10 text-red-500 border border-red-600/20"
                                      }`}>
                                        {ans.isCorrect ? "✔️ Esatta" : "❌ Errata"}
                                      </span>
                                    </div>

                                    <p className="font-serif font-bold leading-normal">
                                      {t(ans.question, ans.questionEn)}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                                      <div className="space-y-0.5">
                                        <span className="text-[9px] uppercase text-stone-450 block">
                                          {t("Risposta Alunno", "Student Answer")}
                                        </span>
                                        <p className={`p-1 rounded font-bold border ${
                                          ans.isCorrect
                                            ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-650"
                                            : "bg-red-500/5 border-red-500/10 text-red-655"
                                        }`}>
                                          {t(ans.selectedOption, ans.selectedOptionEn) || t("(Nessuna risposta)", "(No response)")}
                                        </p>
                                      </div>

                                      <div className="space-y-0.5">
                                        <span className="text-[9px] uppercase text-stone-450 block">
                                          {t("Risposta Corretta", "Correct Answer")}
                                        </span>
                                        <p className="p-1 rounded bg-stone-500/5 border border-stone-500/10 text-stone-500 font-bold">
                                          {t(ans.correctOption, ans.correctOptionEn)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with actions */}
            <div className="p-6 pt-3 border-t border-stone-850/10 flex flex-col sm:flex-row gap-3 justify-between items-center bg-stone-900/5">
              <button
                type="button"
                disabled={quizReports.length === 0}
                onClick={() => {
                  if (confirm(t("Sei sicuro di voler cancellare definitivamente TUTTI i report della classe?", "Are you sure you want to permanently clear ALL school report records?"))) {
                    setQuizReports([]);
                    setExpandedReportId(null);
                  }
                }}
                className={`py-2 px-3.5 rounded text-xs font-mono uppercase tracking-wider font-bold transition-all border ${
                  quizReports.length === 0
                    ? "opacity-35 cursor-not-allowed border-stone-850 text-stone-500"
                    : isDarkMode 
                      ? "border-stone-800 hover:border-red-900 hover:text-red-500 text-stone-400" 
                      : "border-gray-300 hover:border-red-300 hover:text-red-600 text-gray-600"
                }`}
              >
                🗑️ {t("Pulisci Tutto", "Clear All")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsReportsOpen(false);
                  setExpandedReportId(null);
                }}
                className="w-full sm:w-auto py-2 px-5 rounded text-white font-mono text-xs font-bold uppercase tracking-wider bg-[#a4161a] hover:bg-[#e5383b] transition-colors"
              >
                {t("Chiudi", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- A4. INTERACTIVE GLOSSARY COGNITIVE DETAIL MODAL --- */}
      {selectedGlossaryTerm && (
        <div
          id="glossary-detail-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedGlossaryTerm(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
        >
          <div
            className={`p-6 rounded-lg border max-w-md w-full relative space-y-4 shadow-2xl text-left scale-in transition-all ${
              isDarkMode ? "bg-stone-900 border-[#a4161a]/30 text-stone-200 animate-fade-in" : "bg-white border-gray-400 text-[#161a1d]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGlossaryTerm(null)}
              className="absolute top-3 right-3 p-1.5 rounded hover:bg-stone-500/10 text-stone-400 hover:text-stone-200 transition-colors"
              title={t("Chiudi", "Close")}
            >
              <span className="font-bold text-lg font-mono leading-none">×</span>
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase bg-[#e5383b]/10 text-[#e5383b] px-2 py-0.5 rounded font-bold tracking-wider inline-block mb-1">
                {t("Glossario • Parola Difficile", "Glossary • Difficult Word")}
              </span>
              <h3 className="text-2xl font-serif italic font-extrabold text-[#e5383b] tracking-wide">
                "{selectedGlossaryTerm.word}"
              </h3>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                {t("Significato:", "Meaning:")}
              </p>
              <p className={`text-sm sm:text-base font-light leading-relaxed p-4 rounded border ${
                isDarkMode ? "bg-stone-950/45 border-stone-800 text-stone-300" : "bg-stone-50 border-gray-250 text-stone-800 shadow-inner"
              }`}>
                {currentLang === "it" ? selectedGlossaryTerm.definitionIt : selectedGlossaryTerm.definitionEn}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#a4161a]/15">
              <span className="text-xs font-mono font-bold text-[#e5383b] uppercase tracking-wider block">
                {currentLang === "it" ? selectedGlossaryTerm.tercetLabelIt : selectedGlossaryTerm.tercetLabelEn}
              </span>
              
              {selectedGlossaryTerm.cantoIndex !== selectedCantoIndex ? (
                <button
                  onClick={() => {
                    setSelectedCantoIndex(selectedGlossaryTerm.cantoIndex);
                    setSelectedGlossaryTerm(null);
                    setTimeout(() => {
                      scrollToSection("canti-explorer-section");
                    }, 100);
                  }}
                  className="text-[10px] sm:text-xs font-mono uppercase bg-[#a4161a] hover:bg-[#e5383b] text-white px-3.5 py-2 rounded font-black tracking-widest transition-all shadow-md shadow-[#a4161a]/15"
                >
                  {t("Vai al Canto", "Go to Canto")}
                </button>
              ) : (
                <button
                  onClick={() => setSelectedGlossaryTerm(null)}
                  className="text-[10px] sm:text-xs font-mono uppercase border border-[#a4161a]/30 hover:bg-[#a4161a]/10 text-[#e5383b] px-3.5 py-2 rounded font-black tracking-widest transition-all"
                >
                  {t("Capito", "Understood")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
