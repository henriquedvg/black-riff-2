/*==================================================
 BLACK RIFF - SCRIPT PRINCIPAL
==================================================*/

// LOADING
window.addEventListener("load", () => {
    const loading = document.getElementById("loading");
    setTimeout(() => {
        loading.classList.add("esconder");
    }, 2500);
});

// ANO AUTOMÁTICO
document.getElementById("ano").textContent = new Date().getFullYear();

// REVEAL ANIMATION
const reveals = document.querySelectorAll(".reveal");
function revelar() {
    reveals.forEach(sec => {
        const topo = sec.getBoundingClientRect().top;
        if (topo < window.innerHeight - 100) {
            sec.classList.add("active");
        }
    });
}
window.addEventListener("scroll", revelar);
revelar();

// BOTÃO TOPO
const btnTopo = document.getElementById("btnTopo");
window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        btnTopo.classList.add("mostrar");
    } else {
        btnTopo.classList.remove("mostrar");
    }
});
btnTopo.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// MENU MOBILE
const menuBtn = document.getElementById("menuBtn");
const menu = document.querySelector("nav ul");
const menuLinks = document.querySelectorAll("nav ul li a");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("ativo");
    });
}

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (menu.classList.contains("ativo")) {
            menu.classList.remove("ativo");
        }
    });
});

/*==================================================
 PLAYER DE ÁUDIO & PLAYLIST
==================================================*/
const playlist = [
    {
        titulo: "Comfortably Numb",
        artista: "Pink Floyd",
        arquivo: "musicas/comfortably-numb.mp3",
        capa: "imagens/capa.jpg"
    },
    {
        titulo: "November Rain",
        artista: "Guns N' Roses",
        arquivo: "musicas/november-rain.mp3",
        capa: "imagens/capa2.jpg"
    }
];

let indice = 0;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const anterior = document.getElementById("anterior");
const proxima = document.getElementById("proxima");
const aleatorio = document.getElementById("aleatorio");
const titulo = document.getElementById("titulo-musica");
const artista = document.getElementById("artista");
const capa = document.getElementById("capa");
const barra = document.getElementById("barraProgresso");
const inicio = document.getElementById("inicio");
const fim = document.getElementById("fim");
const volume = document.getElementById("volume");
const listaPlaylistUI = document.getElementById("lista-playlist");

// Renderizar lista na interface
function renderizarPlaylist() {
    listaPlaylistUI.innerHTML = "";
    playlist.forEach((track, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${i + 1}. ${track.titulo}</span> <small>${track.artista}</small>`;
        if (i === indice) li.classList.add("tocando-agora");

        li.addEventListener("click", () => {
            indice = i;
            carregarMusica(indice);
            audio.play();
        });

        listaPlaylistUI.appendChild(li);
    });
}

function carregarMusica(i) {
    audio.src = playlist[i].arquivo;
    titulo.textContent = playlist[i].titulo;
    artista.textContent = playlist[i].artista;
    capa.src = playlist[i].capa;
    renderizarPlaylist();
}

carregarMusica(indice);

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

audio.addEventListener("play", () => {
    playBtn.innerHTML = "⏸";
    capa.classList.add("tocando");
});

audio.addEventListener("pause", () => {
    playBtn.innerHTML = "▶";
    capa.classList.remove("tocando");
});

proxima.addEventListener("click", () => {
    proximaFaixa();
});

anterior.addEventListener("click", () => {
    indice--;
    if (indice < 0) indice = playlist.length - 1;
    carregarMusica(indice);
    audio.play();
});

aleatorio.addEventListener("click", () => {
    indice = Math.floor(Math.random() * playlist.length);
    carregarMusica(indice);
    audio.play();
});

function proximaFaixa() {
    indice++;
    if (indice >= playlist.length) indice = 0;
    carregarMusica(indice);
    audio.play();
}

audio.addEventListener("loadedmetadata", () => {
    barra.max = Math.floor(audio.duration);
    fim.textContent = formatar(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    barra.value = Math.floor(audio.currentTime);
    inicio.textContent = formatar(audio.currentTime);
});

barra.addEventListener("input", () => {
    audio.currentTime = barra.value;
});

volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

audio.addEventListener("ended", () => {
    proximaFaixa();
});

function formatar(seg) {
    if (isNaN(seg) || seg === Infinity) return "0:00";
    const min = Math.floor(seg / 60);
    const sec = Math.floor(seg % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Botões "Ouvir" da Discografia integrados com o Player
const btnsOuvir = document.querySelectorAll(".btn-ouvir");
btnsOuvir.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.getAttribute("data-index"));
        if (!isNaN(idx) && playlist[idx]) {
            indice = idx;
            carregarMusica(indice);
            audio.play();
            document.getElementById("player").scrollIntoView({ behavior: "smooth" });
        }
    });
});

/*==================================================
 MODAL DE INGRESSOS (SHOWS)
==================================================*/
const modal = document.getElementById("modalIngresso");
const fecharModal = document.querySelector(".fechar-modal");
const btnTickets = document.querySelectorAll(".btn-ticket");
const modalTitulo = document.getElementById("modalTitulo");
const btnConfirmarIngresso = document.getElementById("btnConfirmarIngresso");
const modalFeedback = document.getElementById("modalFeedback");

btnTickets.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const nomeShow = e.target.getAttribute("data-show");
        modalTitulo.textContent = `Ingressos: ${nomeShow}`;
        modalFeedback.style.display = "none";
        modal.style.display = "flex";
    });
});

fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

btnConfirmarIngresso.addEventListener("click", () => {
    const email = document.getElementById("emailIngresso").value;
    if (email) {
        modalFeedback.style.color = "#00ff88";
        modalFeedback.textContent = "Reserva confirmada! Verifique seu e-mail. 🤘";
        modalFeedback.style.display = "block";
        setTimeout(() => {
            modal.style.display = "none";
            document.getElementById("emailIngresso").value = "";
        }, 2000);
    }
});

/*==================================================
 FORMULÁRIO DE CONTATO
==================================================*/
const formContato = document.getElementById("formContato");
const feedbackContato = document.getElementById("feedbackContato");

formContato.addEventListener("submit", (e) => {
    e.preventDefault();
    feedbackContato.style.display = "block";
    feedbackContato.textContent = "Mensagem enviada com sucesso! O Rock jamais morrerá 🤘";
    formContato.reset();

    setTimeout(() => {
        feedbackContato.style.display = "none";
    }, 4000);
});