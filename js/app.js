const tabuleiro = document.getElementById("tabuleiro");
const form = document.getElementById("addPergunta")
const fundoForm = document.querySelector(".fundo-addPergunta")

let jogo = {
    quantiaTentativa: 0,
    estadoInicio: false,
    quantiaCards: 0
}

let primeiraCarta = null
let segundaCarta = null
let bloquiar = false;
let reiniciarCards = false;

let cards = [
    {
        indice: 0,
        informacao: 'Pergunta 1?',
        indiceResposta: 1
    },
    {
        indice: 1,
        informacao: 'Resposta 1',
        indiceResposta: 0
    },
    {
        indice: 3,
        informacao: 'Pergunta 2?',
        indiceResposta: 2
    },
    {
        indice: 2,
        informacao: 'Resposta 2',
        indiceResposta: 3
    }
]

function verificarIgualdade(indeceCardUm, indiceCardDois) {
    console.log(cards[indeceCardUm])
    console.log(cards[indiceCardDois])
    if (cards[indeceCardUm].indiceResposta == cards[indiceCardDois].indice && cards[indiceCardDois].indiceResposta == cards[indeceCardUm].indice) {
        console.log("Você acertou a combinação")
        return true
    }
    else {
        console.log("Combinação errada")
        return false
    }
}

function renderizarCards() {

    tabuleiro.innerHTML = ""

    cards.forEach((element, index) => {
        const card = document.createElement("button")
        card.classList.add("card")
        card.dataset.indice = index

        const front = document.createElement("div")
        front.classList.add("front")

        const back = document.createElement("div")
        back.classList.add("back")

        const texto = document.createElement("p")
        texto.innerText = element.informacao

        back.appendChild(texto)

        card.appendChild(front)
        card.appendChild(back)

        card.addEventListener("click", () => virarCard(index, card))

        tabuleiro.appendChild(card)
    })
}

function renderizarCardsContrario() {
    tabuleiro.innerHTML = ''
    cards.forEach((element) => {
        const card = document.createElement("button")
        card.classList.add("card")
        card.classList.add('virado')
        card.dataset.indice = element.indice

        const front = document.createElement("div")
        front.classList.add("front")

        const back = document.createElement("div")
        back.classList.add("back")

        const texto = document.createElement("p")
        texto.innerText = element.informacao

        back.appendChild(texto)

        card.appendChild(front)
        card.appendChild(back)

        card.addEventListener("click", () => virarCard(element.indice, card))

        tabuleiro.appendChild(card)
    })
}

function reinicar() {
    if(cards.length < 4){
        mostrarMensagem("Adicione perguntas para iniciar o jogo", "error")
        return
    }
    
    cards.forEach((element) => {
        document.querySelector(`[data-indice='${element.indice}']`).classList.remove("virado")
        document.querySelector(`[data-indice='${element.indice}']`).classList.remove("virado")
    })
}

function mudarOrdem() {
    for (var i = 0; i < cards.length; i++) {
        let novoindice = Math.floor(Math.random() * cards.length);

        if (novoindice == i) {
            i--;
        } else {
            let cardIntermediario = {
                indice: cards[novoindice].indice,
                informacao: cards[novoindice].informacao,
                indiceResposta: cards[novoindice].indiceResposta
            }
            cards[novoindice] = cards[i];
            cards[i] = cardIntermediario;
        }
    }
}

function iniciar() {
    if(cards.length < 4){
        mostrarMensagem("Adicione perguntas para iniciar o jogo", "error")
        return
    }
    mudarOrdem();
    cards.forEach((element) => {
        document.querySelector(`[data-indice='${element.indice}']`).classList.remove("virado")
    })

    renderizarCards()
}


function virarCard(indice, elemento) {
    if (bloquiar) {
        mostrarMensagem("Aguarde para virar outra carta", "error")
        return
    }
    if (primeiraCarta == indice) {
        mostrarMensagem("Você ja selecionou essa carta", "error")
        return
    }
    if (elemento.classList.contains("virado")) return

    elemento.classList.add("virado")

    if (primeiraCarta == null) {
        primeiraCarta = indice
    }
    else {
        segundaCarta = indice;
        bloquiar = true;
        console.log('verificar')
        verificarJogada()
    }

}

async function verificarJogada() {
    if (verificarIgualdade(primeiraCarta, segundaCarta)) {
        mostrarMensagem("Parabéns, você acertou a combinação!", "success")
        bloquiar = false;
    }
    else {
        const card1 = primeiraCarta;
        const card2 = segundaCarta
        setTimeout(() => {
            document.querySelector(`[data-indice='${card1}']`).classList.remove("virado")
            document.querySelector(`[data-indice='${card2}']`).classList.remove("virado")
            bloquiar = false;
        }, 1500)
    }
    primeiraCarta = null
    segundaCarta = null
}

form.addEventListener("submit", (e) => {
    if(!reiniciarCards){
        cards = []
        reiniciarCards = true;
    }

    e.preventDefault()

    const pergunta = form.children[1].value
    const resposta = form.children[3].value

    const indicePergunta = cards.length
    const indiceResposta = cards.length + 1

    cards.push({
        indice: indicePergunta,
        informacao: pergunta,
        indiceResposta: indiceResposta
    })

    cards.push({
        indice: indiceResposta,
        informacao: resposta,
        indiceResposta: indicePergunta
    })

    renderizarCardsContrario()

    fundoForm.style.display = 'none'
    form.reset();
})

document.addEventListener('DOMContentLoaded', () => {
    renderizarCardsContrario()
})

