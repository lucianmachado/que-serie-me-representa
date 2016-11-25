const fs = require('fs')
const url = require('url')
module.exports.routes = {
        /**
         * Redireciona para o index.html caso acesse a raiz.
         * @param req
         * @param res
         */
        '/': function(req, res) {
            res.writeHead(301, {
                Location: 'http://localhost:8000/index.html'
            });
            res.end();
        },
        /**
         * Lista todas as questões
         * @param req
         * @param res
         */
        '/api/questions': function(req, res) {
            try {
                let contentData = JSON.parse(fs.readFileSync(process.cwd() + '/backend/fixtures/questions.json', 'utf8'));
                // contentData = shuffle(contentData)
                contentData.forEach(function(item) {
                    item.alternatives = shuffle(item.alternatives)
                })
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify(contentData))
            } catch (e) {
                console.log(e);
                res.end(JSON.stringify({
                    error: e
                }))
            }
        },
        /**
         * Calcula o resultado do teste
         * @param req
         * @param res
         */
        '/api/questions/test': function(req, res) {
            try {
                req.on('data', function(body) {
                    let contagem = [];
                    let respostas = JSON.parse(body)
                    let valores = respostas.map(item => item.valor)
                    let contestWinner;
                    let winner = [...new Set(valores)].map((value) => [value, valores.filter((v) => v === value).length]) //qtd por resposta
                        .sort((a, b) => a[1] - b[1]) //ordena por qtd
                        .reverse().filter((v, i, a) => v[1] === a[0][1]).map((v) => v[0]) //Deixa só o(s) ganhador(es)
                    if (winner.length == respostas.length) {
                        respostas = respostas.sort(function(item) {
                            return item.peso
                        })
                        contestWinner = respostas[0].valor;
                    } else if (winner.length > 1) {
                        let sums = {}
                        winner.forEach(function(item) {
                            let target = respostas.filter(function(entry) {
                                return entry.valor == item
                            })
                            sums[item] = target.reduce((a, b) => a.peso + b.peso)
                        })
                        var arr = Object.keys(sums).map(function(key) {
                            return sums[key];
                        });
                        var max = Math.max.apply(null, arr);
                        for (let k in sums) {
                            if (sums[k] == max) contestWinner = k
                        }
                    } else {
                        contestWinner = winner[0]
                    }
                    let responseValues = JSON.parse(fs.readFileSync(process.cwd() + '/backend/fixtures/responses.json', 'utf8'));
                    res.setHeader('content-type', 'application/json');
                    res.end(JSON.stringify(responseValues[contestWinner]))
                })
            } catch (e) {
                console.log(e);
                res.end(JSON.stringify({
                    error: e
                }))
            }
        }
}
/**
 * Randomiza as posições de um array
 * @param array
 */
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}