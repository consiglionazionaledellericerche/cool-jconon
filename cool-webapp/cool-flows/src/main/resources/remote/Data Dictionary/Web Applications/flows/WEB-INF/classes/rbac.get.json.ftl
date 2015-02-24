{
    "content": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "security/login": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "activiti$flussoDocumentaleDSFTM": {
        "GET": {
            "whitelist": {
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS"
                ]
            }
        }
    },
    "rbac": {
        "GET": {
            "whitelist": {
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS"
                ]
            }
        },
        "POST": {
            "whitelist": {
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS"
                ]
            }
        },
        "DELETE": {
            "whitelist": {
                "group": [
                    "GROUP_ALFRESCO_ADMINISTRATORS"
                ]
            }
        }
    }
}
