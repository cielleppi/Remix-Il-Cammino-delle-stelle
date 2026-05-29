/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VerseLine {
  text: string;
  lineNumber?: number;
}

export interface Tercet {
  id: number;
  verses: VerseLine[];
  paraphraseText: string;
  // Simplified text supported by CAA (Augmentative and Alternative Communication) symbols
  caaSimplifiedText: string;
  caaSymbols: {
    word: string;
    symbol: string; // Emoji character or small visual glyph
    type: 'character' | 'setting' | 'action' | 'feeling' | 'concept' | 'object';
  }[];
}

export interface CantoDetail {
  number: number;
  romanNumeral: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  focusBes: string; // Specific pedagogical focus for students with SEN
  focusBesEn: string;
  tercets: Tercet[];
}

export interface BioInfo {
  name: string;
  title: string;
  birthDeath: string;
  summary: string;
  summaryEn: string;
  keyConcepts: {
    title: string;
    titleEn: string;
    desc: string;
    descEn: string;
    icon: string;
  }[];
}

export interface CommediaSection {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  desc: string;
  descEn: string;
  structure: {
    part: string;
    partEn: string;
    cantos: string;
    guide: string;
    guideEn: string;
    theme: string;
    themeEn: string;
    color: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correctAnswerIndex: number;
  feedback: string;
  feedbackEn: string;
}

export interface QuizReportAnswer {
  question: string;
  questionEn: string;
  selectedOption: string;
  selectedOptionEn: string;
  correctOption: string;
  correctOptionEn: string;
  isCorrect: boolean;
}

export interface QuizReport {
  id: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  answers: QuizReportAnswer[];
}

export interface DuotoneOverlayColor {
  id: string;
  name: string;
  nameEn: string;
  bgHex: string; // Full CSS style duotone filter overlay
  textColor: string;
  blendMode: string;
}
