#TODO#
* verificare caching nei browser oltre che in mod_cache
* disabilitare temporaneamente mod_expires

##CACHE ABILITATA##
* css
* javascript
* handlebars *devono avere la versione dell'artefatto nella querystring!*
* bulkinfo (mimetype application/json ?) *devono avere la versione dell'artefatto nella querystring!*
* font (e.g. fontawesome)
* avvisi per i non-admin
* faq per i non-admin

##CACHE DISABILITATA##
* html
* query al documentale

###ATTENZIONE###
####Le risorse seguenti non hanno la versione nella URL####

* js/thirdparty/ace/*.js

* js/thirdparty/fallback/*.js

* img/select2*
* css/select2.css

* img/email.png
* img/mimetype-16.png
* img/favicon.ico

* img/logo*.png

* js/thirdparty/require.js