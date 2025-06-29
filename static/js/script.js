// Existing code
// prevents the user from entering bad characters in input that could break the python code :(
$('input').on('keypress', function (e) {
    if(e.keyCode==13){return true};
    if (e.which < 48 && e.which!=32|| 
    (e.which > 57 && e.which < 65) || 
    (e.which > 90 && e.which < 97) ||
    e.which > 122) {
        e.preventDefault();
    }
});

var wordArrayJson=[];
// makes a li for available words in signFiles

function test_list()
{
    let ul = document.querySelector(".test_list");
    fetch('static/js/sigmlFiles.json')
    .then(response => response.json())
    .then((data)=>
    {
        data.forEach((e)=>
        {
            let tempjson = {word:e.name};
            wordArrayJson.push(tempjson);
            let li=document.createElement("li");
            li.className = "bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg p-2 text-center transition-colors cursor-pointer";
            li.innerHTML = `<a href="#player" onclick="setSiGMLURL('SignFiles/${e.name}.sigml');" class="block w-full h-full">${e.name}</a>`;
            ul.appendChild(li);
        });
    });
}
test_list();

// word array for playing words
var wordArray=[];

// stops a tag from redirecting
$('a').click(function(event){
    event.preventDefault();
});

// stops submit button from submitting the form 
let form =  document.getElementById('form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
});


let sub =  document.getElementById('submit');
sub.addEventListener('click',()=>
{
    processInputText();
});

// Function to process input text (used by both text input and speech)
function processInputText() {
    let input =  document.getElementById('text').value;
    console.log("INPUT is ",input);

    // ajax request to get the response from flask in json and play the words
    $.ajax({
        url:'/',
        type:'POST',
        data:{text: input, language: selectedLanguage},
        success: function(res)
        {
            convert_json_to_arr(res);
            play_each_word();
            display_isl_text(res);
        },
        error: function(xhr)
        {
            console.log(xhr);
        }
    });
}

// displays isl text 
function display_isl_text(words)
{
    let p = document.getElementById("isl_text");
    p.textContent="";
    Object.keys(words).forEach(function(key) 
    {
        p.textContent+= words[key]+" ";
    });
}

// displays currently playing word/letter
function display_curr_word(word)
{
    let p = document.querySelector(".curr_word_playing");
    p.textContent=word;
    p.className = "curr_word_playing ml-2 text-xl font-bold text-yellow-400";
}

// displays error message if some error is there
function display_err_message()
{
    let p = document.querySelector(".curr_word_playing");
    p.textContent="Some error occurred (Probably Sigml file of the word/letter is not proper)";
    p.className = "curr_word_playing ml-2 text-lg font-bold text-red-500";
}

// converts the returned json to array
function convert_json_to_arr(words)
{
    wordArray=[];
    console.log("wordArray",words);
    Object.keys(words).forEach(function(key) {
        wordArray.push(words[key]);
    });
    console.log("wordArray",wordArray);
}


// plays each word
function play_each_word(){
    totalWords = wordArray.length;
    i = 0;
    var int = setInterval(function () {
        if(i == totalWords) {
            if(playerAvailableToPlay) {
                clearInterval(int);
                finalHint = $("#inputText").val();
                $("#textHint").html(finalHint);
                document.querySelector("#submit").disabled=false;
                document.querySelector("#submit").classList.remove("opacity-50", "cursor-not-allowed");
                if (micButton) {
                    micButton.disabled = false;
                    micButton.classList.remove("opacity-50", "cursor-not-allowed");
                }
            }
            else{
                display_err_message();
                document.querySelector("#submit").disabled=false;
                document.querySelector("#submit").classList.remove("opacity-50", "cursor-not-allowed");
                if (micButton) {
                    micButton.disabled = false;
                    micButton.classList.remove("opacity-50", "cursor-not-allowed");
                }
            }
        } else if(playerAvailableToPlay) {
            playerAvailableToPlay = false;
            startPlayer("SignFiles/" + wordArray[i]+".sigml");
            display_curr_word(wordArray[i]);
            console.log("CURRENTLY PLAYING",wordArray[i]);
            document.querySelector("#submit").disabled=true;
            document.querySelector("#submit").classList.add("opacity-50", "cursor-not-allowed");
            if (micButton) {
                micButton.disabled = true;
                micButton.classList.add("opacity-50", "cursor-not-allowed");
            }
            i++;
        }
        else {
            let errtext = $(".statusExtra").val(); 
            console.log("ERROR:- ", "Some error occurred (Probably Sigml file of the word/letter is not proper)");
            display_err_message();
            if(errtext.indexOf("invalid") != -1) {
                playerAvailableToPlay=true;
                document.querySelector("#submit").disabled=false;
                document.querySelector("#submit").classList.remove("opacity-50", "cursor-not-allowed");
                if (micButton) {
                    micButton.disabled = false;
                    micButton.classList.remove("opacity-50", "cursor-not-allowed");
                }
            }
        }
    }, 1000);
};


// sets the avatarLoaded to true 
var loadingTout = setInterval(function() {
    if(tuavatarLoaded) {
        // $("#loading").hide();
        clearInterval(loadingTout);
        console.log("Avatar loaded successfully !");
        
        // Initialize speech recognition once avatar is loaded
        initSpeechRecognition();
    }
}, 1500);

// SPEECH RECOGNITION IMPLEMENTATION
let recognition;
let micButton;
let isListening = false;

function initSpeechRecognition() {
    // Create microphone button
    micButton = document.createElement('button');
    micButton.id = 'speech-btn';
    micButton.className = 'bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center transition-colors';
    micButton.innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
    micButton.title = 'Click to speak';
    
    // Add button to form
    document.getElementById('form').appendChild(micButton);
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Initialize SpeechRecognition object
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLanguage === 'ta' ? 'ta-IN' : 'en-US';

        // Event for speech recognition results
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('text').value = transcript;
            console.log('Speech recognized:', transcript);
            
            // Process the recognized speech
            processInputText();
        };

        // Event for speech recognition end
        recognition.onend = function() {
            isListening = false;
            micButton.classList.remove('bg-red-600', 'hover:bg-red-700');
            micButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
            micButton.title = 'Click to speak';
            micButton.innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
        };

        // Event for speech recognition errors
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            micButton.classList.remove('bg-red-600', 'hover:bg-red-700');
            micButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
            micButton.title = 'Click to speak';
            micButton.innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
            
            // Create toast notification for error
            showToast('Speech recognition error: ' + event.error, 'error');
        };

        // Add click event to toggle speech recognition
        micButton.addEventListener('click', function () {
            if (isListening) {
                recognition.stop();
                isListening = false;
                micButton.classList.remove('bg-red-600', 'hover:bg-red-700');
                micButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
                micButton.title = 'Click to speak';
                micButton.innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
            } else {
                // Set language just before starting
                recognition.lang = selectedLanguage === 'ta' ? 'ta-IN' : 'en-US';
                recognition.start();
                isListening = true;
                micButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                micButton.classList.add('bg-red-600', 'hover:bg-red-700');
                micButton.title = 'Listening... Click to stop';
                micButton.innerHTML = '<i class="fa fa-microphone-slash" aria-hidden="true"></i>';
                
                showToast('Listening...', 'info');
            }
        });

    } else {
        // Browser doesn't support speech recognition
        console.error('Speech recognition not supported in this browser');
        micButton.disabled = true;
        micButton.title = 'Speech recognition not supported in this browser';
        micButton.classList.add('opacity-50', 'cursor-not-allowed');
        showToast('Speech recognition not supported in this browser', 'error');
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-2 transition-all duration-300 transform translate-x-full';
    
    // Set background color based on type
    if (type === 'error') {
        toast.classList.add('bg-red-600');
        toast.innerHTML = '<i class="fas fa-exclamation-circle"></i> ';
    } else if (type === 'success') {
        toast.classList.add('bg-green-600');
        toast.innerHTML = '<i class="fas fa-check-circle"></i> ';
    } else {
        toast.classList.add('bg-blue-600');
        toast.innerHTML = '<i class="fas fa-info-circle"></i> ';
    }
    
    // Add message
    toast.innerHTML += message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
let selectedLanguage = 'en';

document.getElementById('languageSelect').addEventListener('change', function () {
    selectedLanguage = this.value;
});
