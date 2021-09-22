<html>
    <body>
        <div class="alert alert-error">
            <#if args.message??>
                <h2>ERROR: ${args.message}</h2>
            </#if>
            <#if args.failureMessage??>
                <h1>ERROR: ${args.failureMessage}</h1>
            </#if>
        </div>
    </body>
</html>