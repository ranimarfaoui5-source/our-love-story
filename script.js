const $ = (id) => document.getElementById(id);
let lang = "en";
let questionIndex = 0;
let score = 0;
let answered = false;

const questions = [
  {
    en: "Where was our first kiss?",
    fr: "Où était notre premier baiser ?",
    answers: [
      { en: "At the beach, by the sea", fr: "À la plage, au bord de la mer", correct: true },
      { en: "In a little café", fr: "Dans un petit café", correct: false },
      { en: "On a mountain trip", fr: "Pendant une randonnée en montagne", correct: false },
      { en: "At home watching a movie", fr: "À la maison devant un film", correct: false }
    ],
    right: { en: "Our first kiss by the sea… a memory to keep close. ♡", fr: "Notre premier baiser au bord de la mer… un souvenir précieux. ♡" },
    wrong: { en: "It was by the sea! Keep that sweet memory close. ♡", fr: "C’était au bord de la mer ! Garde ce doux souvenir près de toi. ♡" }
  },
  {
    en: "Which country is on our honeymoon dream list?",
    fr: "Quel pays figure sur notre liste de rêves pour la lune de miel ?",
    answers: [
      { en: "Japan", fr: "Le Japon", correct: true },
      { en: "Canada", fr: "Le Canada", correct: false },
      { en: "Brazil", fr: "Le Brésil", correct: false },
      { en: "Iceland", fr: "L’Islande", correct: false }
    ],
    right: { en: "Japan, cherry blossoms, and a thousand memories together. 🌸", fr: "Le Japon, les cerisiers en fleurs et mille souvenirs ensemble. 🌸" },
    wrong: { en: "Japan is waiting on our dream list. 🌸", fr: "Le Japon nous attend sur notre liste de rêves. 🌸" }
  },
  {
    en: "Which Italian place do we dream of visiting on our honeymoon?",
    fr: "Quel endroit en Italie rêvons-nous de visiter pendant notre lune de miel ?",
    answers: [
      { en: "The Amalfi Coast", fr: "La côte amalfitaine", correct: true },
      { en: "Milan", fr: "Milan", correct: false },
      { en: "Turin", fr: "Turin", correct: false },
      { en: "Bologna", fr: "Bologne", correct: false }
    ],
    right: { en: "Little cafés, sea views, and sunsets on the Amalfi Coast. ♡", fr: "Les petits cafés, la mer et les couchers de soleil sur la côte amalfitaine. ♡" },
    wrong: { en: "Our answer is the beautiful Amalfi Coast. ♡", fr: "La réponse est la magnifique côte amalfitaine. ♡" }
  },
  {
    en: "What sweet business do we want to open together?",
    fr: "Quel commerce gourmand voulons-nous ouvrir ensemble ?",
    answers: [
      { en: "A little bakery", fr: "Une petite boulangerie", correct: true },
      { en: "A flower shop", fr: "Une boutique de fleurs", correct: false },
      { en: "A bookshop", fr: "Une librairie", correct: false },
      { en: "A coffee truck", fr: "Un camion-café", correct: false }
    ],
    right: { en: "Our own bakery: shared dreams, warm bread, and sweet beginnings. 🥐", fr: "Notre boulangerie : des rêves partagés, du pain chaud et de doux débuts. 🥐" },
    wrong: { en: "A bakery is our little business dream. 🥐", fr: "Une boulangerie est notre petit rêve professionnel. 🥐" }
  },
  {
    en: "What kind of home do we imagine for our future?",
    fr: "Quel genre de maison imaginons-nous pour notre avenir ?",
    answers: [
      { en: "A big, warm home filled with love", fr: "Une grande maison chaleureuse remplie d’amour", correct: true },
      { en: "A tiny cabin in the woods", fr: "Une petite cabane dans les bois", correct: false },
      { en: "A hotel room forever", fr: "Une chambre d’hôtel pour toujours", correct: false },
      { en: "A house with no kitchen", fr: "Une maison sans cuisine", correct: false }
    ],
    right: { en: "A home full of laughter, peace, and memories we make together. 🏡", fr: "Un foyer plein de rires, de paix et de souvenirs créés ensemble. 🏡" },
    wrong: { en: "We dream of a big, warm home to call ours. 🏡", fr: "Nous rêvons d’une grande maison chaleureuse à nous. 🏡" }
  },
  {
    en: "What is one of the family dreams we talk about?",
    fr: "Quel est l’un des rêves de famille dont nous parlons ?",
    answers: [
      { en: "Having children together one day", fr: "Avoir des enfants ensemble un jour", correct: true },
      { en: "Living on a boat forever", fr: "Vivre sur un bateau pour toujours", correct: false },
      { en: "Never having a home", fr: "Ne jamais avoir de maison", correct: false },
      { en: "Moving to the moon", fr: "Déménager sur la lune", correct: false }
    ],
    right: { en: "A family of our own, when the time is right and life allows. ♡", fr: "Notre petite famille, quand le moment sera bon et si la vie nous le permet. ♡" },
    wrong: { en: "One of our dreams is to have children together one day. ♡", fr: "L’un de nos rêves est d’avoir des enfants ensemble un jour. ♡" }
  }
];

function setLanguage(nextLang) {
  lang = nextLang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-en][data-fr]").forEach(el => {
    el.textContent = el.dataset[lang];
  });
  document.querySelectorAll(".letter-copy").forEach(el => {
    el.classList.toggle("hidden", !el.hasAttribute(`data-${lang}`));
  });
  document.querySelectorAll(".lang").forEach(el => el.classList.toggle("active", el.dataset.lang === lang));
  if (!answered || $("result").classList.contains("hidden")) renderQuestion(false);
}
document.querySelectorAll(".lang").forEach(btn => btn.addEventListener("click", () => setLanguage(btn.dataset.lang)));

$("openLetter").addEventListener("click", () => {
  $("letter").classList.remove("hidden");
  $("letter").scrollIntoView({behavior:"smooth"});
});
$("readAgain").addEventListener("click", () => $("letter").scrollIntoView({behavior:"smooth"}));
$("musicToggle").addEventListener("click", () => $("musicPanel").classList.toggle("hidden"));
$("closeMusic").addEventListener("click", () => $("musicPanel").classList.add("hidden"));

function renderQuestion(resetFeedback = true) {
  if (questionIndex >= questions.length) return showResult();
  const q = questions[questionIndex];
  $("questionCount").textContent = `${lang === "en" ? "QUESTION" : "QUESTION"} ${String(questionIndex + 1).padStart(2,"0")} / ${String(questions.length).padStart(2,"0")}`;
  $("scoreLive").textContent = `♡ ${score}`;
  $("progressBar").style.width = `${(questionIndex / questions.length) * 100}%`;
  $("questionText").textContent = q[lang];
  $("answers").innerHTML = "";
  $("feedback").textContent = "";
  $("nextQuestion").disabled = true;
  $("nextQuestion").textContent = questionIndex === questions.length - 1 ? (lang === "en" ? "See my result ♡" : "Voir mon résultat ♡") : (lang === "en" ? "Next question →" : "Question suivante →");
  answered = false;
  q.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = `${String.fromCharCode(65 + i)}.  ${answer[lang]}`;
    btn.addEventListener("click", () => chooseAnswer(btn, answer, q));
    $("answers").appendChild(btn);
  });
}
function chooseAnswer(btn, answer, q) {
  if (answered) return;
  answered = true;
  const buttons = [...$("answers").querySelectorAll("button")];
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (q.answers[i].correct) b.classList.add("correct");
  });
  if (answer.correct) {
    score++;
    btn.classList.add("selected");
    $("feedback").textContent = q.right[lang];
  } else {
    btn.classList.add("wrong");
    $("feedback").textContent = q.wrong[lang];
  }
  $("scoreLive").textContent = `♡ ${score}`;
  $("nextQuestion").disabled = false;
}
$("nextQuestion").addEventListener("click", () => {
  if (!answered) return;
  questionIndex++;
  if (questionIndex >= questions.length) showResult();
  else renderQuestion();
});
function showResult() {
  $("questionArea").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("progressBar").style.width = "100%";
  let title, message;
  if (score === 6) {
    title = lang === "en" ? "Our memories live in your heart. ♡" : "Nos souvenirs vivent dans ton cœur. ♡";
    message = lang === "en" ? "6 out of 6! You remembered every little dream. But my favorite part of our story is still the one we're writing together." : "6 sur 6 ! Tu te souviens de tous nos petits rêves. Mais ma partie préférée de notre histoire reste celle que nous écrivons ensemble.";
  } else if (score >= 3) {
    title = lang === "en" ? "You know our little world. ♡" : "Tu connais notre petit monde. ♡";
    message = lang === "en" ? `${score} out of 6! Every answer is a little reminder that our story is made of memories and dreams. Let's keep making more.` : `${score} sur 6 ! Chaque réponse rappelle que notre histoire est faite de souvenirs et de rêves. Continuons à en créer.`;
  } else {
    title = lang === "en" ? "Let's make more memories. ♡" : "Créons encore plus de souvenirs. ♡";
    message = lang === "en" ? `${score} out of 6—and that's okay. The best part is that we still have so many beautiful moments and dreams ahead of us.` : `${score} sur 6 — et ce n’est pas grave. Le plus beau, c’est qu’il nous reste tant de beaux moments et de rêves à vivre.`;
  }
  $("resultTitle").textContent = title;
  $("resultText").textContent = message;
}
$("restartQuiz").addEventListener("click", () => {
  questionIndex = 0; score = 0; answered = false;
  $("result").classList.add("hidden");
  $("questionArea").classList.remove("hidden");
  renderQuestion();
});
renderQuestion();
setLanguage("en");
