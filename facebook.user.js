// ==UserScript==
// @name        Facebook auto reply
// @namespace   http://www.bigservers.square7.ch/blog
// @description a facebook wishing post, auto reply tool made for the glory of jquery
// @include     https://m.facebook.com/<your.username>*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-1.11.1.min.js
// ==/UserScript==

var messageContent = /(xronia polla)|(χρ(ό|ο)νια πολλ(ά|α))/i;
var messageList    = ['Eyxaristw re', 'Se euxaristw poly trele mou','Na sai kala kai ta sxetika :)'];
var defaultMessage = 'Se Euxaristw poly';

var responceGroups = {
    'memas.kal' : 1,
    'nikosGlxSouzesMexriAurio' : 1,
    'random.id': 0
};


// Gentlemen start your engines
$(document).ready(function() {  
    
    /**
    *   Parses the form and make the final post
    **/
    function messagePost(page, message) {
        
        var form = $(page).find('form');
        
        // Find form's post url
        var postFormUrl = form.attr('action');
        // Set the message
        form.find('#composerInput').val(message);
                
        // Post the responce
        $.post(postFormUrl, $(form).serialize());
    }
    
    
    /**
    *  Iterates throught the visible posts
    **/
    $('div[id^=u_0]').each(function() {
        
        // Find poster's id, username and text message
        var story       = $(this);
        var postedById  = story.find('strong a');
        var posterName  = postedById.eq(0).text();        
            postedById  = postedById.attr('href').split('?')[0].substring(1);
        var postMessage = story.children('div').eq(1).text();
        
        // Search the post for keywords
        var matchFound  = postMessage.match(messageContent);
        if(matchFound) {
            
           // Find the appropriate responce
           var respIndex = responceGroups[postedById];
           var responce  = (respIndex != undefined) ? messageList[respIndex] : defaultMessage;
            
           // Prompt user for confirmation
           var confirm   = prompt("Do you want to post onto " + posterName + " 's wall?" , responce);
           if ( confirm != null) {
                            
               // Get the link of the comment page
               var commentPage = story.children('div').eq(2).find('a').attr('href');
               // Feth the target page. No fail handler, we live in a perfect world
               $.ajax({                           
                   url : commentPage,
                   success: function(result) {
                       messagePost (result,confirm);
                   },
                   async : false
               });          
           }
        }
    });
});