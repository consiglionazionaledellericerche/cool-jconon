require(['jquery', 'header', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.ui', 'json!cache', 'i18n', 'cnr/cnr.ui.select', 'cnr/cnr.application', 'cnr/cnr.jconon', 'cnr/cnr.call', 'json!common'],
    function ($, header, CNR, URL, UI, cache, i18n, select, Application, jconon, Call, common) {
  "use strict";
    var playbackState, player;
    const status = function(event) {
        playbackState = event.playbackState;
        if (playbackState == 'unstarted' || playbackState == 'paused') {
            $('#play').prop('disabled', false).removeClass('disabled');
            $('#pause').prop('disabled', true);
        } else {
            $('#pause').prop('disabled', false).removeClass('disabled');
            $('#play').prop('disabled', true);
        }
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
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("fatto!"), 2000)
        });
        let result = await promise;

        const PeerTubePlayer = window['PeerTubePlayer'];

        player = new PeerTubePlayer(window.frames["video"]);
        await player.ready; // wait for the player to be ready
        console.log({player});
        $('#play').toggle();
        $('#pause').toggle();
        $('#play').on('click', function () {
            player.play();
            setTimeout(() => {
                if (playbackState && playbackState == 'unstarted') {
                    UI.alert(i18n['message.video.gender.browser']);
                }
            }, 1000);
        });
        $('#pause').on('click', function () {
            player.pause();
        });
        player.addEventListener('playbackStatusUpdate', status);
    }
    initialize();
});