<div class="container">
    <div class="row-fluid">
        <div class="container-fluid">
            <h5>${message('label.commission-gender.1')}</h5>
            <h5>${message('label.commission-gender.2')}</h5>
            <h5>${message('label.commission-gender.3')}</h5>
            <#if locale_suffix != 'it'>
                <iframe id="video" src="${videoGenderURL_en}" style="height:60vh;width:100%"></iframe>
            <#else>
                <iframe id="video" src="${videoGenderURL_it}" style="height:60vh;width:100%"></iframe>
            </#if>
            <h5>${message('label.commission-gender.4')}</h5>
            <div class="btn-block">
                <button class="btn btn-large span6 btn-primary hide" id="play"><i class="icon-play icon-white"></i> Play</button>
                <button class="btn btn-large span6 btn-danger hide" id="pause"><i class="icon-pause icon-white"></i> Pause</button>
            </div>
        </div>
    </div>
</div>