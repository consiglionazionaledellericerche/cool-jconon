require(['jquery', 'header', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.ui', 'json!cache', 'i18n', 'cnr/cnr.ui.select', 'cnr/cnr.application', 'cnr/cnr.jconon', 'cnr/cnr.call', 'json!common'],
    function ($, header, CNR, URL, UI, cache, i18n, select, Application, jconon, Call, common) {
  "use strict";
    const PeerTubePlayer = window['PeerTubePlayer'];

    let player = new PeerTubePlayer(window.frames["video"]);

    const status = function(event) {
        if (event.playbackState == 'ended' && event.position == event.duration) {
            player.removeEventListener('playbackStatusUpdate', status);
            URL.Data.proxy.metadataNode({
              placeholder: {
                'store_type' : common.User['store-protocol'],
                'store_id' : common.User['store-identifier'],
                'id' : common.User['node-uuid']
              },
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({
                "properties" : {"jconon_commissione:whatch_video_gender": true}
              }),
              success: function () {
                  UI.info(i18n['message.video.gender.enabled'], function () {
                    window.location.href = document.referrer;
                  });
              }
            });
        }
    }

    const initialize = async () => {
        await player.ready; // wait for the player to be ready
        console.log({player});
        player.addEventListener('playbackStatusUpdate', status);
    }
    initialize();
});