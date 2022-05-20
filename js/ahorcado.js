/*
Tipo de juego
    - Automático (Palabras predefinidas)
    - Manual (Ingresar palabras)
*/
var currentWord = "";
var intentos = 0;
var gameStatus = "playing";
var palabras = ["asterisco","dinosaurio","cabello","ganancia","susurro","gabinete","azulejo","visión",
    "bilingüe","salsa de tomate","muñeca de trapo","detergente","aguas termales"
];

$(document).ready(function() {
    newGame();
});

function newGame() {
    if (currentWord != "") {
        $("#popup-container").fadeOut(300);
        
        intentos = 0;
        gameStatus = "playing";

        $("#words-container").html("");
        $(".letter-button").removeClass("incorrect");
        $(".letter-button").removeClass("correct");

        // Eliminar palabra actual del array
        palabras = jQuery.grep(palabras, function(value) {
            return value != currentWord;
        });
    };

    // Recargar página si el array está vacio
    if (palabras.length != 0) {
        drawBase();
        drawSpaces();
    } else {
        window.location.reload();
    }
}

function drawBase() {
    var canvas = document.getElementById("buddy");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,300,300);
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";

    ctx.beginPath();

    ctx.moveTo(0, 290);
    ctx.lineTo(80,290);
    ctx.stroke();

    ctx.moveTo(40,290);
    ctx.lineTo(40,10);
    ctx.lineTo(160,10);
    ctx.stroke();

    ctx.moveTo(150,10);
    ctx.lineTo(150,30);
    ctx.stroke();
}

function drawBuddy(step = 0) {
    var buddy = document.getElementById("buddy");
    var ctx = buddy.getContext("2d");
    ctx.fillStyle = "#000";

    switch (step) {
        case 0: // cabeza
            ctx.beginPath();
            ctx.arc(150, 60, 30, 0, 2 * Math.PI);
            ctx.stroke(); 
        break;
        case 1: // torso
            ctx.moveTo(150,90);
            ctx.lineTo(150,180);
            ctx.stroke();
        break;
        case 2: // pierna der
            ctx.moveTo(150,180);
            ctx.lineTo(180,240);
            ctx.stroke();
        break;
        case 3: // pierna izq
            ctx.moveTo(150,180);
            ctx.lineTo(120,240);
            ctx.stroke();
        break;
        case 4: // brazo der
            ctx.moveTo(150,100);
            ctx.lineTo(190,160);
            ctx.stroke();
        break;
        case 5: // brazo izq
            ctx.moveTo(150,100);
            ctx.lineTo(110,160);
            ctx.stroke();
        break;
    }
}

/* Automático */
function drawSpaces() {

    currentWord = getWord();
    var wordCounter = 0;

    $("#words-container").append('<div class="word-content"></div>');

    for (i = 0; i < currentWord.length; i++) {
        
        if (currentWord[i] != " ") {
            $(".word-content").eq(wordCounter).append('<div class="letter-content"><span class="letter"></span></div>');
        } else {
            $(".word-content").eq(wordCounter).append('<div class="letter-content space"><span class="letter filled"></span></div>');
            $("#words-container").append('<div class="word-content"></div>');
            wordCounter++;
        };
    };
};

function getWord() {
    var num = randomizer(palabras.length);
    return palabras[num];
}

function randomizer(maxLimit){
    let rand = Math.random() * maxLimit; // say 99.81321410836433.
    rand = Math. floor(rand); // 99.
    return rand;
};


/* JUGABILIDAD */
function checkLetter(letra) {
    if ((normalize(currentWord).toUpperCase()).includes(letra)) {
        // Añadir letra
        for(i = 0; i < currentWord.length; i++) {
            if (normalize(currentWord[i]).toUpperCase() == letra) {
                $(".letter-content .letter").eq(i).text(currentWord[i].toUpperCase());
                $(".letter-content .letter").eq(i).addClass("filled");
            };
        }

        return true;
    } else {
        // Dibujar buddy
        if (intentos < 6) {
            drawBuddy(intentos);
            intentos++;  
        };
        return false;
        
    };
};

function lostGame() {
    if (intentos < 6) { return false } else { return true };
}

function winGame() {
    var letrasTotales = currentWord.length;
    var letrasCorrectas = $(".letter.filled").length;

    if (letrasCorrectas == letrasTotales) {
        return true;
    } else {
        return false;
    };
}

function checkStatus() {
    if (winGame()) {
        gameStatus = "finished";
        finishedGame("win");
    } else if (lostGame()) {
        gameStatus = "finished";
        finishedGame("lost");
    } else {
        gameStatus = "playing";
    }
}

function finishedGame(result) {
    $("#result-panel").html("");

    if (result == "win") {
        $("#result-panel").append('<h2>¡Ganaste!</h2>');
    } else if (result == "lost") {
        $("#result-panel").append('<h2>¡Perdiste!</h2>');
    }

    $("#result-panel").append('<div class="button-container"><button id="new-game" class="button">Nueva palabra</button></div>');

    $("#popup-container").fadeIn(300).css("display","flex");
    $("#new-game").focus();
}

$(function() {
    $(".letter-button").click(function() {
        var letra = $(this).attr("data-letter");
        var clases = $(this).attr("class");
        if (!clases.includes("correct")) {
            checkLetter(letra) ? $(this).addClass("correct") : $(this).addClass("incorrect");
        };

        checkStatus();
    });

    $(window).keypress(function(e) {
        if (gameStatus == "playing") {
            var key = String.fromCharCode(e.which);
            key = normalize(key).toUpperCase();
    
            // Solo tomar letras de la lista
            try {
                var index = $("[data-letter=" + key + "]").index();
    
                var clase = $(".letter-button").eq(index).attr("class");
                if (!clase.includes("correct")) {
                    checkLetter(key) ? $(".letter-button").eq(index).addClass("correct") : $(".letter-button").eq(index).addClass("incorrect");
                };
    
                checkStatus();
    
            } catch (error) {
                // No hacer nada
            };
        };
    });

    $("#result-panel").on("click","#new-game",function() {
        newGame();
    });    
})


var normalize = (function() {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÇç", 
        to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuucc",
        mapping = {};
   
    for(var i = 0, j = from.length; i < j; i++ )
        mapping[ from.charAt( i ) ] = to.charAt( i );
   
    return function( str ) {
        var ret = [];
        for( var i = 0, j = str.length; i < j; i++ ) {
            var c = str.charAt( i );
            if( mapping.hasOwnProperty( str.charAt( i ) ) )
                ret.push( mapping[ c ] );
            else
                ret.push( c );
        }      
        return ret.join( '' );
    }
})();
