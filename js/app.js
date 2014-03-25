/* EconoBebe | RINO3 (http://rino3.com.br) | Copyright 2014 sob a licença MIT */
var btCancel = $("#bt-cancel");
var btExcluir = $("#bt-excluir");
var btSalvar = $("#bt-salvar");
var nomeBebida = $("#nome-bebida");
var mlBebida = $("#ml-bebida");
var keyBebida = $("#key-bebida");
var listaBebida = $("#lista-bebida");
var listaResultado = $("#lista-resultado");
var addNomeBebida = $("#addnome-bebida");
var addMlBebida = $("#addml-bebida");
var itemCurrent;

$(document).ready(function() {
    initStorage();
    listByStorage();
    listAddEvents();
});

function initStorage() {

    if ($.jStorage.index().length === 0) {

        $.jStorage.set("1", JSON.stringify({nome: 'Latinha', ml: 269, reais: ''}));
        $.jStorage.set("2", JSON.stringify({nome: 'Lata', ml: 350, reais: ''}));
        $.jStorage.set("3", JSON.stringify({nome: 'long neck', ml: 355, reais: ''}));
        $.jStorage.set("4", JSON.stringify({nome: 'Latão', ml: 473, reais: ''}));
        $.jStorage.set("5", JSON.stringify({nome: 'Garrafa', ml: 600, reais: ''}));
        $.jStorage.set("6", JSON.stringify({nome: 'Litrão', ml: 1000, reais: ''}));

    }
}

function listByStorage() {

    var arrayStorage = $.jStorage.index();

    for (var i = 0; i < arrayStorage.length; i++) {
        var item = JSON.parse($.jStorage.get(arrayStorage[i]));
        listaBebida.append($('<li><aside class="input-wrap"><small>R$</small><input type="number" value="' + item['reais'] + '" placeholder="Ex.: 2.50 "></aside><a href="#" data-nome="' + item['nome'] + '" data-key="' + arrayStorage[i] + '" data-ml="' + item['ml'] + '" class="btn-confirm"><p>' + item['nome'] + '</p><p>' + item['ml'] + ' ml</p></a></li>'));
    }
}

function listAddEvents() {

    $(".btn-confirm").unbind("click");

    $('.btn-confirm').click(function() {
        mlBebida.val($(this).data('ml'));
        nomeBebida.val($(this).data('nome'));
        keyBebida.val($(this).data('key'));
        itemCurrent = $(this);
        document.querySelector('#confirm').className = 'fade-in';
    });
}



function formatNumber(number)
{
    number = number.toFixed(2) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}



function calcula() {

    //monta o html do hanking

    var bestPrice = [];
    var i = 0;

    listaBebida.find('li').each(function() {

        var current = $(this);
        var preco = formatNumber(parseFloat(current.children('aside').children('input').val()));

        if (!isNaN(preco)) {

            var ml = parseInt(current.children('a').data('ml'));
            var nome = current.children('a').data('nome');
            var precoLitro = formatNumber((1000 * (preco)) / ml);

            bestPrice[i] = {};
            bestPrice[i]["p"] = precoLitro * 100;
            bestPrice[i]["pl"] = precoLitro;
            bestPrice[i]["n"] = nome;
            bestPrice[i]["m"] = ml;

            i++;
        }
    });

    listaResultado.html('');

    if (bestPrice.length === 0) {
        listaResultado.append($('<li><p>Ops...</p><p>Diga o preço das bebidas.</p></li>'));
    } else {

        bestPrice.sort(function(a, b) {
            return parseInt(a.p, 10) - parseInt(b.p, 10);
        });

        for (var x = 0; x < bestPrice.length; x++) {
            var item = bestPrice[x];

            listaResultado.append($('<li><span class="position-drink">' + (x + 1) + '.</span><aside class="input-wrap"><small>R$/L</small><input type="text" value="' + item["pl"].replace('.', ',') + '" readonly></aside><p>' + item['n'] + '</p><p>' + item['m'] + ' ml</p></li>'));
        }
    }
}

//headers
document.querySelector('#btn-calc').addEventListener('click', function() {

    calcula();
    document.querySelector('#result').className = 'current';
    document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#btn-calc-back').addEventListener('click', function() {
    document.querySelector('#result').className = 'right';
    document.querySelector('[data-position="current"]').className = 'current';
});



btCancel.click(function() {
    document.querySelector('#confirm').className = 'fade-out';
});

btSalvar.click(function() {
    if (nomeBebida.val().trim().length > 0 && mlBebida.val().trim().length > 0 && (!isNaN(mlBebida.val()))) {

        //atualiza no storage 
        var item = JSON.parse($.jStorage.get(keyBebida.val()));
        $.jStorage.set(keyBebida.val(), JSON.stringify({nome: nomeBebida.val(), ml: mlBebida.val(), reais: item['reais']}));

        //atualiza no html
        itemCurrent.data('ml', mlBebida.val());
        itemCurrent.data('nome', nomeBebida.val());
        itemCurrent.html('<p>' + nomeBebida.val() + '</p><p>' + mlBebida.val() + ' ml</p>');

        document.querySelector('#confirm').className = 'fade-out';
    }
});

btExcluir.click(function() {
    //remove no storage 
    $.jStorage.deleteKey(keyBebida.val())

    //remove no html
    itemCurrent.parent().remove()

    document.querySelector('#confirm').className = 'fade-out';
});

$('#btn-add').click(function() {
    addNomeBebida.val('');
    addMlBebida.val('');
    document.querySelector('#add').className = 'fade-in';
});

$('#addbt-cancel').click(function() {
    document.querySelector('#add').className = 'fade-out';
});

$('#addbt-salvar').click(function() {

    if (addNomeBebida.val().trim().length > 0 && addMlBebida.val().trim().length > 0 && (!isNaN(addMlBebida.val()))) {

        //insere no storage 
        $.jStorage.set(addNomeBebida.val(), JSON.stringify({nome: addNomeBebida.val(), ml: addMlBebida.val(), reais: ''}));
        //append no html       
        listaBebida.append($('<li><aside class="input-wrap"><small>R$</small><input type="number" placeholder="Ex.: 2.50 "></aside><a href="#" data-nome="' + addNomeBebida.val() + '" data-key="' + addNomeBebida.val() + '" data-ml="' + addMlBebida.val() + '" class="btn-confirm"><p>' + addNomeBebida.val() + '</p><p>' + addMlBebida.val() + ' ml</p></a></li>'));
        //atualiza eventos
        listAddEvents();
        document.querySelector('#add').className = 'fade-out';
    }
});




