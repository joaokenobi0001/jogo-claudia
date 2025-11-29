Jogo de Caça-Níquel (Slot Machine)

Este é um projeto simples de jogo de caça-níquel feito com Node.js e JavaScript.
O jogo roda no terminal e mostra três símbolos aleatórios.
Se todos os três forem iguais, o jogador ganha. Caso contrário, perde.

 Como funciona

O jogador digita um comando para rodar a máquina.

O sistema sorteia três numeros aleatórios do um (1) ao seis (6).

O terminal mostra o resultado.

Se os três símbolos forem iguais, aparece uma mensagem de vitória.

Caso não sejam iguais, aparece uma mensagem de derrota.

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Caça-Níquel</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #222;
            color: white;
            font-family: Arial, sans-serif;
        }

        h1 {
            margin-bottom: 20px;
        }

        .slot {
            display: flex;
            gap: 20px;
            font-size: 5rem;
            margin: 20px 0;
        }

        button {
            padding: 10px 20px;
            font-size: 1.2rem;
            cursor: pointer;
        }

        #result {
            margin-top: 15px;
            font-size: 1.5rem;
        }
    </style>
</head>
<body>

    <h1> Jogo de Caça-Níquel</h1>

    <div class="slot">
        <div id="s1">?</div>
        <div id="s2">?</div>
        <div id="s3">?</div>
    </div>

    <button onclick="play()">Girar</button>

    <div id="result"></div>

    <script>
        const symbols = ["1", "2", "3", "4", "5"];

        function randomSymbol() {
            return symbols[Math.floor(Math.random() * symbols.length)];
        }

        function play() {
            const s1 = randomSymbol();
            const s2 = randomSymbol();
            const s3 = randomSymbol();

            document.getElementById("s1").textContent = s1;
            document.getElementById("s2").textContent = s2;
            document.getElementById("s3").textContent = s3;

            if (s1 === s2 && s2 === s3) {
                document.getElementById("result").textContent = "Você ganhou!";
            } else {
                document.getElementById("result").textContent = " Tente novamente!";
            }
        }
    </script>

</body>
</html>

 Objetivo

O objetivo é apenas testar a sorte e se divertir!
Toda vez que você rodar o jogo, o resultado será diferente.
