"use strict";
const request = require('superagent')
const should = require('should')

//Buscar perguntas
describe('api/questions', () => {
    it('Deverá retornar uma lista com todas as questões [5]', done => {
        request.get("http://localhost:8000/api/questions").end(function(err, res) {
            let questions = res.body
            questions.length.should.be.eql(5)
            done();
        });
    });
        it('Deverá retornar listas de perguntas diferentes', done => {
        request.get("http://localhost:8000/api/questions").end(function(err, res) {
            let questions = res.body
            request.get("http://localhost:8000/api/questions").end(function(err, res) {
                let questions2 = res.body
                questions.should.be.not.eql(questions2)
                done();
            });
        });
    });
});

//Caso de Testes Especificado
describe('api/questions/test', () => {
    it('Resposta do teste deverá ser Lost', done => {
        request.post("http://localhost:8000/api/questions/test").send([{
            "valor": "breaking-bad",
            "alternativa": "1"
        }, {
            "valor": "game-of-thrones",
            "alternativa": "2"
        }, {
            "valor": "house-of-cards",
            "alternativa": "3"
        }, {
            "valor": "lost",
            "alternativa": "4"
        }, {
            "valor": "lost",
            "alternativa": "5"
        }]).end(function(err, res) {
            let nome = res.body.nome
            nome.should.be.eql("Lost")
            done()
        });
    });
});