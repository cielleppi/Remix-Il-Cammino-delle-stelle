import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface DanteUniverseExplorerProps {
  isLibraryOpen: boolean;
  setIsLibraryOpen: (open: boolean) => void;
  isDarkMode: boolean;
  currentLang?: string;
  selectedDisciplina?: string;
  t: (itText: string, enText: string) => string;
  setSelectedCantoIndex: (index: number) => void;
  scrollToSection: (id: string) => void;
  zoomLevel?: number;
  isCaaActive?: boolean;
}

export const DanteUniverseExplorer: React.FC<DanteUniverseExplorerProps> = ({
  isLibraryOpen,
  setIsLibraryOpen,
  isDarkMode,
  currentLang,
  selectedDisciplina,
  t,
  setSelectedCantoIndex,
  scrollToSection,
  zoomLevel = 1,
  isCaaActive = false,
}) => {
  const [universeCantica, setUniverseCantica] = useState<string>('all');
  const [universeSearch, setUniverseSearch] = useState<string>('');
  const [universeCanto, setUniverseCanto] = useState<string>('all');
  const [universePersonaggio, setUniversePersonaggio] = useState<string>('all');
  const [universePeccato, setUniversePeccato] = useState<string>('all');
  const [universeSelectedItem, setUniverseSelectedItem] = useState<any | null>(null);

  if (!isLibraryOpen) return null;

  // Typography zoom scaling calculations
  const getTitleSizeClass = () => {
    switch (zoomLevel) {
      case 2: return "text-5xl sm:text-6xl md:text-7xl";
      case 3: return "text-6xl sm:text-7xl md:text-8xl";
      case 4: return "text-7xl sm:text-8xl md:text-9xl";
      default: return "text-4xl sm:text-5xl md:text-6xl";
    }
  };

  const getBodySizeClass = () => {
    switch (zoomLevel) {
      case 2: return "text-sm sm:text-base leading-relaxed";
      case 3: return "text-base sm:text-lg leading-relaxed";
      case 4: return "text-lg sm:text-xl leading-relaxed font-medium";
      default: return "text-xs sm:text-sm leading-relaxed";
    }
  };

  const getSubTitleSizeClass = () => {
    switch (zoomLevel) {
      case 2: return "text-sm sm:text-base md:text-lg";
      case 3: return "text-base sm:text-lg md:text-xl";
      case 4: return "text-lg sm:text-xl md:text-2xl font-medium";
      default: return "text-xs sm:text-sm md:text-base";
    }
  };

  const getLabelSizeClass = () => {
    switch (zoomLevel) {
      case 2: return "text-[12px]";
      case 3: return "text-[14px]";
      case 4: return "text-[16px]";
      default: return "text-[10px]";
    }
  };

  // High accessibility simplified texts with support emojis
  const getCaaDescription = (id: number): string => {
    switch (id) {
      case 1:
        return t("🌳 Dante si perde in un bosco scuro. Incontra la sua guida Virgilio.", "🌳 Dante gets lost in a dark forest. He meets Virgil his guide.");
      case 10:
        return t("❓ Dante ha paura. Virgilio gli spiega che Beatrice lo protegge dal cielo.", "❓ Dante is afraid. Virgil explains that Beatrice protects him from heaven.");
      case 2:
        return t("💨 Persone trascinate nel vento forte per aver amato troppo.", "💨 People swept in a strong wind for loving too much.");
      case 3:
        return t("❄️ Il conte Ugolino intrappolato nel ghiaccio scuro.", "❄️ Count Ugolino trapped in dark freezing ice.");
      case 11:
        return t("🏛️ Personaggi saggi e buoni nati prima di Gesù Cristo.", "🏛️ Good and wise people born before Jesus Christ.");
      case 4:
        return t("🏖️ Una spiaggia solare dove inizia la salita di speranza.", "🏖️ A sunny beach where the climbing of hope begins.");
      case 5:
        return t("👑 Re importanti che si sono pentiti troppo tardi.", "👑 Important kings who repented too late.");
      case 6:
        return t("🌸 Un giardino meraviglioso in cima dove Dante riabbraccia Beatrice.", "🌸 A beautiful garden on top of the mountain where Dante meets Beatrice.");
      case 7:
        return t("🌙 Spiriti buoni che non hanno potuto mantenere i loro voti.", "🌙 Good spirits who could not keep their sacred vows.");
      case 8:
        return t("🛡️ L'incontro con un antenato coraggioso che predice il futuro.", "🛡️ Meeting a brave ancestor who predicts the future.");
      case 9:
        return t("✨ La grande visione di Dio, fatta di luce bianca e amore puro.", "✨ The final vision of God, made of white light and pure love.");
      default:
        return "";
    }
  };

  const danteUniverseData = [
    {
      id: 1,
      cantica: 'Inferno',
      titolo: t('La Selva Oscura', 'The Dark Wood'),
      canto: 'I',
      temi: t('Peccato, Smarrimento, Guida', 'Sin, Bewilderment, Guidance'),
      personaggi: t('Dante, Virgilio, Le tre fiere', 'Dante, Virgil, The three beasts'),
      descrizione: isCaaActive ? getCaaDescription(1) : t(
        'Dante si ritrova in una selva oscura. Incontra Virgilio, che lo guiderà attraverso l\'abisso infernale.',
        'Dante finds himself in a dark wood. He meets Virgil, who will guide him through the infernal abyss.'
      ),
      dettaglio: t(
        'Il viaggio inizia il Venerdì Santo del 1300. Le tre fiere rappresentano lussuria, superbia e cupidigia.',
        'The journey begins on Good Friday of 1300. The three beasts represent lust, pride, and avarice.'
      )
    },
    {
      id: 10,
      cantica: 'Inferno',
      titolo: t('Il Dubbio di Dante', "Dante's Doubt"),
      canto: 'II',
      temi: t('Missione, Grazia, Coraggio', 'Mission, Grace, Courage'),
      personaggi: t('Dante, Virgilio, Beatrice (citata), Lucia, Maria', 'Dante, Virgil, Beatrice (cited), Lucy, Mary'),
      descrizione: isCaaActive ? getCaaDescription(10) : t(
        'Dante esita, temendo di non essere all\'altezza. Virgilio rivela che Beatrice si è mossa per lui.',
        'Dante hesitates, fearing he is not up to the task. Virgil reveals Beatrice moved for him.'
      ),
      dettaglio: t(
        'Si delinea la "catena della salvezza": Maria, Lucia e Beatrice collaborano per salvare Dante dal peccato.',
        'The "chain of salvation" emerges: Mary, Lucy and Beatrice cooperate to save Dante from sin.'
      )
    },
    {
      id: 2,
      cantica: 'Inferno',
      titolo: t('Paolo e Francesca', 'Paolo and Francesca'),
      canto: 'V',
      temi: t('Lussuria, Amore tragico', 'Lust, Tragic Love'),
      personaggi: t('Minosse, Paolo Malatesta, Francesca da Polenta', 'Minos, Paolo Malatesta, Francesca da Polenta'),
      descrizione: isCaaActive ? getCaaDescription(2) : t(
        'Il cerchio dei lussuriosi, dove gli amanti sono travolti da una bufera eterna.',
        'The circle of the lustful, where lovers are swept by an eternal tempest.'
      ),
      dettaglio: t(
        '"Galeotto fu \'l libro e chi lo scrisse". Uno dei momenti più lirici e umani dell\'Inferno.',
        '"Galeotto was the book and he who wrote it". One of the most lyrical and human moments of Inferno.'
      )
    },
    {
      id: 3,
      cantica: 'Inferno',
      titolo: t('Il Conte Ugolino', 'Count Ugolino'),
      canto: 'XXXIII',
      temi: t('Tradimento, Vendetta', 'Betrayal, Revenge'),
      personaggi: t('Ugolino della Gherardesca, Arcivescovo Ruggieri', 'Ugolino della Gherardesca, Archbishop Ruggieri'),
      descrizione: isCaaActive ? getCaaDescription(3) : t(
        'Nel ghiaccio di Cocito, il conte Ugolino rode il cranio del suo traditore.',
        'In the ice of Cocytus, Count Ugolino gnaws the skull of his betrayer.'
      ),
      dettaglio: t(
        'La tragedia della fame e del tradimento politico nella zona dell\'Antenora.',
        'The tragedy of hunger and political betrayal in the Antenora zone.'
      )
    },
    {
      id: 11,
      cantica: 'Inferno',
      titolo: t('Il Limbo', 'Limbo'),
      canto: 'IV',
      temi: t('Nobiltà, Desiderio, Sapienza', 'Nobility, Desire, Wisdom'),
      personaggi: t('Omero, Orazio, Ovidio, Lucano, Aristotele', 'Homer, Horace, Ovid, Lucan, Aristotle'),
      descrizione: isCaaActive ? getCaaDescription(11) : t(
        'Il primo cerchio, dove risiedono i giusti non battezzati e i grandi spiriti dell\'antichità.',
        'The first circle, home to the unbaptized virtuous and the great spirits of antiquity.'
      ),
      dettaglio: t(
        'Le anime non soffrono pene fisiche, ma la pena del desiderio eterno di vedere Dio senza speranza.',
        'The souls suffer no physical torment, but the eternal desire to see God without hope.'
      )
    },
    {
      id: 4,
      cantica: 'Purgatorio',
      titolo: t("L'Antipurgatorio", 'Ante-Purgatory'),
      canto: 'I-II',
      temi: t('Libertà, Penitenza, Speranza', 'Freedom, Penance, Hope'),
      personaggi: t("Catone l'Uticense, Casella", 'Cato of Utica, Casella'),
      descrizione: isCaaActive ? getCaaDescription(4) : t(
        'Dante e Virgilio arrivano sulla spiaggia del Purgatorio, accolti da Catone.',
        'Dante and Virgil arrive on the shore of Purgatory, welcomed by Cato.'
      ),
      dettaglio: t(
        '"Libertà va cercando, ch\'è sì cara...". Inizia la salita verso la purificazione.',
        '"Liberty he goes searching, which is so dear...". The climb to purification begins.'
      )
    },
    {
      id: 5,
      cantica: 'Purgatorio',
      titolo: t("La Valletta dei Principi", 'The Valley of Rulers'),
      canto: 'VII-VIII',
      temi: t('Politica, Negligenza', 'Politics, Negligence'),
      personaggi: t('Sordello da Goito, Sovrani europei', 'Sordello of Goito, European Rulers'),
      descrizione: isCaaActive ? getCaaDescription(5) : t(
        'Un luogo di sosta per i sovrani che tardarono a pentirsi per i troppi impegni politici.',
        'A resting place for rulers who delayed repentance due to their political duties.'
      ),
      dettaglio: t(
        'Include la celebre invettiva "Ahi serva Italia, di dolore ostello".',
        'Includes the famous invective "Ah, slavish Italy, dwell of grief".'
      )
    },
    {
      id: 6,
      cantica: 'Purgatorio',
      titolo: t('Il Paradiso Terrestre', 'The Earthly Paradise'),
      canto: 'XXVIII-XXXIII',
      temi: t('Rinascita, Lete, Eunoè', 'Rebirth, Lethe, Eunoe'),
      personaggi: t('Matelda, Beatrice', 'Matelda, Beatrice'),
      descrizione: isCaaActive ? getCaaDescription(6) : t(
        'Sulla cima della montagna, Dante incontra Beatrice e si purifica nei fiumi sacri.',
        'At the top of the mountain, Dante meets Beatrice and is purified in the sacred rivers.'
      ),
      dettaglio: t(
        'Virgilio scompare: la ragione umana lascia il posto alla fede e alla grazia divina.',
        'Virgil disappears: human reason gives way to faith and divine grace.'
      )
    },
    {
      id: 7,
      cantica: 'Paradiso',
      titolo: t('Il Cielo della Luna', 'The Sphere of the Moon'),
      canto: 'III',
      temi: t('Incostanza, Voti mancati', 'Inconstancy, Broken Vows'),
      personaggi: t("Piccarda Donati, Costanza d'Altavilla", 'Piccarda Donati, Constance of Hauteville'),
      descrizione: isCaaActive ? getCaaDescription(7) : t(
        'Il primo cielo, dove risiedono le anime che mancarono ai voti religiosi.',
        'The first heaven, home to souls who failed in their religious vows.'
      ),
      dettaglio: t(
        'Piccarda spiega la gerarchia della beatitudine: "In la sua volontade è nostra pace".',
        'Piccarda explains the hierarchy of beatitude: "In His will is our peace".'
      )
    },
    {
      id: 8,
      cantica: 'Paradiso',
      titolo: t('Cacciaguida', 'Cacciaguida'),
      canto: 'XV-XVII',
      temi: t('Nobiltà, Esilio, Missione', 'Nobility, Exile, Mission'),
      personaggi: t('Cacciaguida (antenato di Dante)', 'Cacciaguida (ancestor of Dante)'),
      descrizione: isCaaActive ? getCaaDescription(8) : t(
        'Nel cielo di Marte, Dante incontra il suo antenato che gli profetizza l\'esilio.',
        'In the sphere of Mars, Dante meets his ancestor who prophesies his exile.'
      ),
      dettaglio: t(
        'Cacciaguida investe Dante della missione di scrivere il poema per il bene del mondo.',
        'Cacciaguida charges Dante with the mission of writing the poem for the world\'s benefit.'
      )
    },
    {
      id: 9,
      cantica: 'Paradiso',
      titolo: t("L'Empireo e la Candida Rosa", 'The Empyrean and the White Rose'),
      canto: 'XXX-XXXIII',
      temi: t('Visione di Dio, Amore Universale', 'Vision of God, Universal Love'),
      personaggi: t('San Bernardo, Vergine Maria, Dio', 'Saint Bernard, Virgin Mary, God'),
      descrizione: isCaaActive ? getCaaDescription(9) : t(
        'L\'ultimo traguardo: la visione della Trinità e l\'armonia dell\'universo.',
        'The final destination: the vision of the Trinity and the cosmic harmony of the universe.'
      ),
      dettaglio: t(
        'Il viaggio si conclude con "L\'amor che move il sole e l\'altre stelle".',
        'The journey concludes with "The love that moves the sun and the other stars".'
      )
    }
  ];

  // Apply all search filters
  const filtered = danteUniverseData.filter((item) => {
    const matchesCantica = universeCantica === 'all' || item.cantica === universeCantica;

    const text = universeSearch.toLowerCase();
    const matchesSearch = text === '' ||
      item.titolo.toLowerCase().includes(text) ||
      item.personaggi.toLowerCase().includes(text) ||
      item.temi.toLowerCase().includes(text) ||
      item.descrizione.toLowerCase().includes(text);

    const matchesCanto = universeCanto === 'all' || item.canto === universeCanto;
    const matchesPersonaggio = universePersonaggio === 'all' || item.personaggi.toLowerCase().includes(universePersonaggio.toLowerCase());
    const matchesPeccato = universePeccato === 'all' || item.temi.toLowerCase().includes(universePeccato.toLowerCase());

    return matchesCantica && matchesSearch && matchesCanto && matchesPersonaggio && matchesPeccato;
  });

  return (
    <div
      id="dante-universe-explorer-modal"
      role="dialog"
      aria-modal="true"
      className={`fixed inset-x-0 bottom-0 top-[57px] sm:top-[65px] z-50 flex items-start justify-center p-4 backdrop-blur-md overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden transition-all duration-300 ${isDarkMode ? "bg-black/95 text-stone-100" : "bg-stone-100/95 text-stone-900"}`}
      style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <div
        className={`w-full max-w-6xl rounded-3xl border text-left shadow-2xl relative flex flex-col my-8 transition-all duration-300 ${
          isDarkMode ? "bg-[#0c0c0e] border-stone-850 text-stone-100" : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        {/* Elegant header */}
        <div className={`p-6 sm:p-8 pb-4 border-b shrink-0 text-center relative font-sans ${isDarkMode ? "border-white/10" : "border-stone-100"}`}>
          <button
            onClick={() => setIsLibraryOpen(false)}
            className={`absolute top-6 right-6 p-2 rounded-full transition-colors border ${
              isDarkMode 
                ? "border-white/10 text-stone-400 hover:text-white hover:border-white/30" 
                : "border-stone-250 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <h1 className={`${getTitleSizeClass()} font-sans font-bold tracking-tight mb-2 leading-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>
            {t("Dante explorer", "Dante Explorer")}
          </h1>
          <div className="h-[1.5px] w-12 bg-red-600 mx-auto my-4 text-center"></div>
          <p className={`max-w-2xl mx-auto italic font-light font-sans ${getSubTitleSizeClass()} ${isDarkMode ? "text-stone-300" : "text-stone-600"}`}>
            {t(
              "Un viaggio interattivo attraverso i gironi, le cornici e i cieli della Divina Commedia.",
              "An interactive journey through the circles, terraces, and spheres of the Divine Comedy."
            )}
          </p>
        </div>

        {/* Filters Block (glass style) */}
        <div className={`p-4 sm:p-6 mx-4 sm:mx-8 my-4 rounded-3xl shrink-0 space-y-4 border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-stone-50 border-stone-200/85"}`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Cantica tabs */}
            <div className="flex flex-row flex-wrap gap-2 w-full lg:w-auto overflow-x-auto justify-start">
              <button
                onClick={() => setUniverseCantica('all')}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                  universeCantica === 'all'
                    ? isDarkMode 
                      ? 'bg-white text-black border-white' 
                      : 'bg-stone-900 text-white border-stone-900'
                    : isDarkMode 
                      ? 'border-stone-700 text-stone-300 hover:border-stone-300 hover:bg-stone-850' 
                      : 'border-stone-350 text-stone-700 hover:border-stone-500 hover:bg-stone-200 bg-white'
                }`}
              >
                {t('Tutte', 'All')}
              </button>
              <button
                onClick={() => setUniverseCantica('Inferno')}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                  universeCantica === 'Inferno'
                    ? 'bg-[#ef4444] text-white border-[#ef4444]'
                    : isDarkMode
                      ? 'border-red-950/40 text-red-400 hover:border-red-500/50 hover:bg-red-950/10'
                      : 'border-red-200 text-red-750 hover:border-red-400 hover:bg-red-50 bg-white'
                }`}
              >
                {t('Inferno', 'Inferno')}
              </button>
              <button
                onClick={() => setUniverseCantica('Purgatorio')}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                  universeCantica === 'Purgatorio'
                    ? 'bg-[#10b981] text-white border-[#10b981]'
                    : isDarkMode
                      ? 'border-green-950/40 text-green-400 hover:border-green-500/50 hover:bg-green-950/10'
                      : 'border-green-200 text-green-750 hover:border-green-400 hover:bg-green-50 bg-white'
                }`}
              >
                {t('Purgatorio', 'Purgatorio')}
              </button>
              <button
                onClick={() => setUniverseCantica('Paradiso')}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                  universeCantica === 'Paradiso'
                    ? 'bg-[#f59e0b] text-white border-[#f59e0b]'
                    : isDarkMode
                      ? 'border-yellow-950/40 text-yellow-400 hover:border-yellow-500/50 hover:bg-yellow-950/10'
                      : 'border-yellow-250 text-yellow-750 hover:border-yellow-400 hover:bg-yellow-50 bg-white'
                }`}
              >
                {t('Paradiso', 'Paradiso')}
              </button>
            </div>

            {/* Search input field */}
            <div className="relative w-full lg:w-64">
              <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${isDarkMode ? "text-white/50" : "text-stone-500"}`}>
                <Search size={14} />
              </div>
              <input
                type="text"
                value={universeSearch}
                onChange={(e) => setUniverseSearch(e.target.value)}
                placeholder={t('Cerca...', 'Search...')}
                className={`w-full text-xs px-2.5 py-2 pl-9 rounded-xl border border-solid outline-none transition-colors ${
                  isDarkMode 
                    ? "border-stone-800 bg-[#141416] text-stone-300 placeholder-stone-500 hover:border-red-500/40 focus:border-red-500/80" 
                    : "border-stone-300 bg-white text-stone-900 placeholder-stone-400 hover:border-red-600 focus:border-red-600"
                }`}
              />
            </div>
          </div>

          {/* Grid of drop-downs for options */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t ${isDarkMode ? "border-white/10" : "border-stone-200"}`}>
            <div className="space-y-1">
              <label className={`uppercase tracking-wider font-semibold font-sans ml-1 block ${getLabelSizeClass()} ${isDarkMode ? "text-white" : "text-stone-700"}`}>
                {t("Canti", "Cantos")}
              </label>
              <select
                value={universeCanto}
                onChange={(e) => setUniverseCanto(e.target.value)}
                className={`w-full border rounded-xl py-1.5 px-3 text-xs outline-none transition-all cursor-pointer ${
                  isDarkMode 
                    ? "bg-stone-950 border-stone-800 text-white focus:border-stone-400" 
                    : "bg-white border-stone-300 text-stone-800 focus:border-stone-400"
                }`}
              >
                <option value="all">{t('Tutti i Canti', 'All Cantos')}</option>
                <option value="I">Canto I</option>
                <option value="II">Canto II</option>
                <option value="III">Canto III</option>
                <option value="IV">Canto IV</option>
                <option value="V">Canto V</option>
                <option value="XV-XVII">Canti XV-XVII</option>
                <option value="XXVIII-XXXIII">Canti XXVIII-XXXIII</option>
                <option value="XXXIII">Canto XXXIII</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={`uppercase tracking-wider font-semibold font-sans ml-1 block ${getLabelSizeClass()} ${isDarkMode ? "text-white" : "text-stone-700"}`}>
                {t("Personaggi", "Characters")}
              </label>
              <select
                value={universePersonaggio}
                onChange={(e) => setUniversePersonaggio(e.target.value)}
                className={`w-full border rounded-xl py-1.5 px-3 text-xs outline-none transition-all cursor-pointer ${
                  isDarkMode 
                    ? "bg-stone-950 border-stone-800 text-white focus:border-stone-400" 
                    : "bg-white border-stone-300 text-stone-800 focus:border-stone-400"
                }`}
              >
                <option value="all">{t('Tutti i Personaggi', 'All Characters')}</option>
                <option value="Dante">Dante</option>
                <option value="Virgilio">Virgilio</option>
                <option value="Beatrice">Beatrice</option>
                <option value="Lucia">Santa Lucia</option>
                <option value="Maria">Vergine Maria</option>
                <option value="Omero">Omero / Grandi Poeti</option>
                <option value="Aristotele">Aristotele / Filosofi</option>
                <option value="Francesca">Paolo e Francesca</option>
                <option value="Ugolino">Ugolino</option>
                <option value="Cacciaguida">Cacciaguida</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={`uppercase tracking-wider font-semibold font-sans ml-1 block ${getLabelSizeClass()} ${isDarkMode ? "text-white" : "text-stone-700"}`}>
                {t("Peccati / Temi", "Sins / Themes")}
              </label>
              <select
                value={universePeccato}
                onChange={(e) => setUniversePeccato(e.target.value)}
                className={`w-full border rounded-xl py-1.5 px-3 text-xs outline-none transition-all cursor-pointer ${
                  isDarkMode 
                    ? "bg-stone-950 border-stone-800 text-white focus:border-stone-400" 
                    : "bg-white border-stone-300 text-stone-800 focus:border-stone-400"
                }`}
              >
                <option value="all">{t('Tutti i Peccati / Temi', 'All Sins / Themes')}</option>
                <option value="Peccato">Peccato</option>
                <option value="Missione">Missione / Grazia</option>
                <option value="Sapienza">Sapienza / Nobiltà</option>
                <option value="Lussuria">Lussuria</option>
                <option value="Tradimento">Tradimento</option>
                <option value="Libertà">Libertà</option>
                <option value="Politica">Politica</option>
                <option value="Visione">Visione Divina</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid content section */}
        <div className="px-6 sm:px-8 pb-8">
          {filtered.length === 0 ? (
            <div className={`p-16 text-center space-y-3 ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
              <div className="text-4xl">📭</div>
              <h4 className="font-display text-base font-bold">{t("Nessun risultato trovato", "No results found")}</h4>
              <p className="text-xs max-w-sm mx-auto">
                {t(
                  "Non ci sono canti o cerchi che corrispondono alla ricerca e ai filtri selezionati. Prova a reimpostare i filtri!",
                  "There are no cantos or circles matching the selected search criteria and filters. Try resetting the filters!"
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filtered.map((item) => {
                const isInferno = item.cantica === 'Inferno';
                const isPurgatorio = item.cantica === 'Purgatorio';

                let cardStyle = '';
                let textStyle = '';

                if (isInferno) {
                  cardStyle = isDarkMode
                    ? 'border border-red-500/20 bg-[#140000]/60 hover:bg-red-950/20'
                    : 'border border-red-200 bg-red-50/30 hover:bg-red-50/80';
                  textStyle = 'text-[#ef4444] dark:text-[#f87171]';
                } else if (isPurgatorio) {
                  cardStyle = isDarkMode
                    ? 'border border-emerald-500/20 bg-[#00140a]/60 hover:bg-emerald-950/20'
                    : 'border border-emerald-250 bg-emerald-50/30 hover:bg-emerald-50/80';
                  textStyle = 'text-[#10b981] dark:text-[#34d399]';
                } else {
                  cardStyle = isDarkMode
                    ? 'border border-amber-500/20 bg-[#140f00]/60 hover:bg-amber-950/20'
                    : 'border border-amber-250 bg-amber-50/30 hover:bg-amber-50/80';
                  textStyle = 'text-[#f59e0b] dark:text-[#fbbf24]';
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => setUniverseSelectedItem(item)}
                    className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group ${cardStyle}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider border border-current/30 px-2.5 py-0.5 rounded-full ${textStyle}`}>
                          {item.cantica}
                        </span>
                        <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider ${isDarkMode ? "text-stone-300" : "text-stone-600"}`}>
                          Canto {item.canto}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 font-sans group-hover:translate-x-1 transition-transform duration-300 ${textStyle}`}>
                        {item.titolo}
                      </h3>
                      <p className={`font-sans leading-relaxed mb-4 line-clamp-3 ${getBodySizeClass()} ${isDarkMode ? "text-stone-300" : "text-stone-600"}`}>
                        {item.descrizione}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      <span className={`text-[9.5px] py-0.5 px-2.5 rounded-full uppercase tracking-widest font-mono font-bold ${isDarkMode ? "bg-white/5 text-stone-300" : "bg-stone-100 text-stone-600"}`}>
                        {item.temi.split(',')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sub-modal: Selected Item Detail */}
        {universeSelectedItem && (() => {
          const item = universeSelectedItem;
          const isPurgatorio = item.cantica === 'Purgatorio';
          let colorClass = 'text-[#ef4444] dark:text-[#f87171]';
          let accentBorder = 'border-[#ef4444]';
          let bulletBg = 'bg-[#ef4444]';
          if (isPurgatorio) {
            colorClass = 'text-[#10b981] dark:text-[#34d399]';
            accentBorder = 'border-[#10b981]';
            bulletBg = 'bg-[#10b981]';
          } else if (item.cantica === 'Paradiso') {
            colorClass = 'text-[#f59e0b] dark:text-[#fbbf24]';
            accentBorder = 'border-[#f59e0b]';
            bulletBg = 'bg-[#f59e0b]';
          }

          return (
            <div className={`fixed inset-0 flex items-center justify-center p-4 z-[60] backdrop-blur-md transition-all duration-300 ${isDarkMode ? "bg-black/90" : "bg-[#0b090a]/40"}`}>
              <div className={`w-full max-w-2xl border p-8 sm:p-10 rounded-[2rem] relative shadow-2xl animate-in fade-in zoom-in duration-200 ${
                isDarkMode ? "bg-stone-950 border-stone-800 text-stone-100" : "bg-white border-stone-250 text-stone-900"
              }`}>
                <button
                  onClick={() => setUniverseSelectedItem(null)}
                  className={`absolute top-6 right-6 text-3xl leading-none transition-colors ${
                    isDarkMode ? "text-stone-500 hover:text-white" : "text-stone-400 hover:text-stone-900"
                  }`}
                  aria-label="Close detail"
                >
                  &times;
                </button>

                <div className="space-y-6 text-left font-sans">
                  <div className="space-y-1.5">
                    <span className={`text-xs font-sans font-bold uppercase tracking-widest ${colorClass}`}>
                      {item.cantica} • Canto {item.canto}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight">
                      {item.titolo}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-stone-50 border-stone-150"}`}>
                      <span className={`block uppercase text-[9px] tracking-wider font-mono font-bold mb-1 ${isDarkMode ? "text-stone-550" : "text-stone-400"}`}>
                        {t("Personaggi", "Characters")}
                      </span>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                        {item.personaggi}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-stone-50 border-stone-150"}`}>
                      <span className={`block uppercase text-[9px] tracking-wider font-mono font-bold mb-1 ${isDarkMode ? "text-stone-550" : "text-stone-400"}`}>
                        {t("Temi Chiave", "Key Themes")}
                      </span>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                        {item.temi}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase tracking-widest text-[#a4161a] font-bold font-mono">
                      {t("Narrazione", "Narration")}
                    </h4>
                    <p className={`leading-relaxed ${getBodySizeClass()} ${isDarkMode ? "text-stone-300" : "text-stone-700"}`}>
                      {item.descrizione}
                    </p>
                  </div>

                  <div className={`p-5 rounded-xl border-l-4 ${accentBorder} ${isDarkMode ? "bg-white/[0.02]" : "bg-stone-50"}`}>
                    <h4 className="font-bold text-xs uppercase font-mono mb-1.5 tracking-wider">
                      {t("Simbolismo e Critica", "Symbolism & Critical Analysis")}
                    </h4>
                    <p className={`text-xs sm:text-sm leading-relaxed italic ${isDarkMode ? "text-stone-400" : "text-stone-600"}`}>
                      {item.dettaglio}
                    </p>
                  </div>

                  <div className={`pt-4 border-t flex justify-end ${isDarkMode ? "border-white/10" : "border-stone-150"}`}>
                    <button
                      onClick={() => {
                        if (item.canto === 'I') {
                          setSelectedCantoIndex(0);
                        } else if (item.canto === 'II') {
                          setSelectedCantoIndex(1);
                        } else if (item.canto === 'V') {
                          setSelectedCantoIndex(2);
                        }
                        setUniverseSelectedItem(null);
                        setIsLibraryOpen(false);
                        scrollToSection('canti-explorer-section');
                      }}
                      className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all tracking-wider text-white ${bulletBg} hover:opacity-90 active:scale-95`}
                    >
                      {t('Vai al testo del canto', 'Go to canto text')} →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
