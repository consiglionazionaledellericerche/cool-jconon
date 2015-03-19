{
    "rest/content": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "rest/search": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "rest/drop": {
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "rest/drop-update": {
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "rest/common": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "activiti$flussoApprovvigionamentiIT": {
        "GET": {
            "whitelist": {
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS",
                    "GROUP_00041100000000000000000000"
                ]
            }
        }
    },
    "activiti$flussoAttestati": {
        "GET": {
            "whitelist": {
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS"
                ]
            }
        }
    },
    "activiti$flussoDocumentaleDSFTM": {
        "GET": {
            "whitelist": {
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS",
                    "GROUP_50700099000300000000000000",
                    "GROUP_50700099000400000000000000"
                ]
            }
        }
    },
    "activiti$flussoMissioni": {
        "GET": {
            "whitelist": {
                "user": [
                    "app.missioni"
                ],
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS"
                ]
            }
        }
    }
}