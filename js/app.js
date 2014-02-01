/* EconoBreja | RINO3 (http://rino3.com.br) | Copyright 2014 sob a licença MIT */

var bt = $("#bt-calc");
var inputValid = 0;
var result = new Array();
var names = new Array();

bt.click(function() {

    if (inputValid < 2) {
        bt.removeClass('ui-btn-active');
    } else {
        var i = 0;
        $('[data-behaviour="money"]').each(function() {

            var valor = parseFloat($(this).val());
            if (valor > 0) {
                var ml = parseInt($(this).data("ml"));

                result[i] = parseFloat(((valor * 1000) / ml).toFixed(2));
                names[i] = $(this).data("name");
                i++;
            }
        });

        result.sort(function(a, b) {
            return a - b;
        });
        var html = "";
        var j = 0;
        while (j < i) {
           // html += "<p>" " " + names[j] + " (Preço por litro: " + result[j].toMoney() + ")<p>";
            html += "<li class=\"item-list-beer "+ (j==0?'special-beer':'normal-beer')+ "\">";
            html += "<div class=\"title-beer\">";
            html += "<b>" + (j + 1) + ".</b> <span>" +names[j]+"</span>";
            html += "</div>";
            html += "<div class=\"description-beer\">";
            html += "<p>Preço por Litro: R$ "+result[j].toMoney()+"</p>"
            html += "</div>";
            html += "</li>";
            j++;
        }

        $("#list-result").html(html);

        document.location.href = "#result";
        bt.attr("href", "#calc");
    }
});

function validNext() {
    //dois campos devem ser estar preenchidos

    inputValid = 0;

    $('[data-behaviour="money"]').each(function() {
        if (parseInt($(this).val().replace(".", "")) > 0) {
            inputValid++;
        }
    });
    
    if (inputValid < 2) {
        bt.addClass('inactive');
        bt.removeClass('ui-btn-active');
        bt.attr("href", "#calc");
    } else {
        bt.removeClass('inactive');
        bt.attr("href", "#result");
    }
}

Number.prototype.toMoney = function()
{
    var n = this,
            c = 2,
            d = ',', t = ".",
            sign = (n < 0) ? '-' : '',
            i = parseInt(n = Math.abs(n).toFixed(c)) + '',
            j = ((j = i.length) > 3) ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}

$(document).ready(function() {
    $('[data-behaviour="money"]').on("keyup", validNext);
});