{
    "i18n": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "login": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "common": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "finalZip/main": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_CONCORSI", "GROUP_COMMISSIONI_CONCORSO", "GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "call/final": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "frontOffice": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        },
        "POST": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_CONCORSI", "GROUP_RDP_CONCORSO", "GROUP_GESTORI_BANDI"]
            }
        },
        "DELETE": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "frontOffice/main": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "frontOfficeCreateModify": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "frontOfficeCreateModify/main": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "frontOffice/notice": {
        "POST": {
            "whitelist": {
                "user": []
            }
        },
        "DELETE": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        },
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "zipperReader": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "zipperReader/main": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "zipper": {
        "POST": {
            "whitelist": {}
        },
        "DELETE": {
            "whitelist": {
                "user": []
            }
        },
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "workflow/definitions": {
        "GET": {
            "whitelist": {}
        }
    },
    "header": {
        "GET": {
            "whitelist": {
                "all": true
            }
        },
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "footer": {
        "GET": {
            "whitelist": {
                "all": true
            }
        },
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "loginPage": {
        "GET": {
            "whitelist": {
                "all": true
            }
        },
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "home": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "home/main": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "search/folder/root": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "search/query": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "search/folder/children": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "workflowHistory": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "workflow/history": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "jsConsole": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "jsRemote": {
        "POST": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "jsConsole/main": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "workflowAssociation": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "workflow/association": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "rbac": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        },
        "POST": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        },
        "DELETE": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "accounting": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "accounting/main": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "jbpm$wfcnr:review": {
        "GET": {
            "whitelist": {}
        }
    },
    "jbpm$wfcnr:adhoc": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "workflow": {
        "GET": {
            "whitelist": {}
        }
    },
    "workflow/main": {
        "GET": {
            "whitelist": {}
        }
    },
    "folder": {
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "node": {
        "POST": {
            "whitelist": {
                "all": true
            }
        },
        "DELETE": {
            "whitelist": {
                "all": true
            }
        }
    },
    "view/": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "crud/cmis/object": {
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "acl": {
        "GET": {
            "whitelist": {
                "all": true
            }
        },
        "POST": {
            "whitelist": {
                "all": true
            }
        },
        "DELETE": {
            "whitelist": {
                "all": true
            }
        }
    },
    "jbpm$14025": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "activiti$activitiReview": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "activiti$activitiInvitationModerated": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "jbpm$wcmwf:changerequest": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "activiti$activitiAdhoc": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "search": {
        "POST": {
            "whitelist": {
                "all": true
            }
        },
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "search/main": {
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "dictionary/type/": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "activiti$publishWebContent": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "search/prova": {
        "POST": {
            "whitelist": {}
        }
    },
    "search/prova2": {
        "POST": {
            "whitelist": {}
        }
    },
    "security/forgotPassword": {
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "faq/main": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "faq": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "contact-us/main": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "contact-us": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "create-account/main": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "create-account": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "search/prova3": {
        "POST": {
            "whitelist": {}
        }
    },
    "search/prova8": {
        "POST": {
            "whitelist": {}
        }
    },
    "activiti$activitiCnrAdhoc": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "activiti$activitiCnrReview": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "jbpm$wcmwf:submit": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "jbpm$wcmwf:submitdirect": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "activiti$activitiParallelReview": {
        "GET": {
            "whitelist": {
                "user": []
            }
        }
    },
    "groups": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_CONCORSI"]
            }
        }
    },
    "groups/main": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_CONCORSI"]
            }
        }
    },
    "security/change-password": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "change-password": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "manage-call": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_CONCORSI", "GROUP_GESTORI_BANDI","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "manage-call/main": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_CONCORSI", "GROUP_GESTORI_BANDI","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        },
        "POST": {
            "whitelist": {
                "group": ["GROUP_CONCORSI", "GROUP_GESTORI_BANDI","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        },
        "DELETE": {
            "whitelist": {
                "group": ["GROUP_CONCORSI", "GROUP_GESTORI_BANDI","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "manage-call/publish": {
        "POST": {
            "whitelist": {
                "group": ["GROUP_CONCORSI", "GROUP_GESTORI_BANDI","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "manage-call/child": {
        "POST": {
            "whitelist": {
                "group": ["GROUP_CONCORSI", "GROUP_GESTORI_BANDI","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "manage-application": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "manage-application/main": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "DELETE": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "manage-application/send": {
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "manage-application/reopen": {
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "helpdesk": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "applications": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_CONCORSI", "GROUP_COMMISSIONI_CONCORSO", "GROUP_GESTORI_BANDI", "GROUP_APPLICATION_CONSUMER", "GROUP_RDP_CONCORSO","GROUP_ALFRESCO_ADMINISTRATORS"],
                "user": []
            }
        }
    },
    "my-applications": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_EVERYONE"]
            }
        }
    },
    "my-applications/main": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_EVERYONE"]
            }
        }
    },
    "my-applications/query": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_EVERYONE"]
            }
        }
    },
    "search-call": {
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "search-call/main": {
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "scheda-valutazione": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_COMMISSIONI_CONCORSO","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "scheda-valutazione/main": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_COMMISSIONI_CONCORSO","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "error-generic": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "error/generic": {
        "GET": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        },
        "DELETE": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "manage-application/paste": {
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "manage-application/move_prodotto": {
        "POST": {
            "whitelist": {
                "all": ["true"]
            }
        }
    },
    "rbac-admin/main": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "rbac-admin": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "gestione-utenti/main": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "gestione-utenti": {
        "GET": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "buttami": {
        "GET": {
            "whitelist": {}
        }
    },
    "frontOffice/faq": {
        "GET": {
            "whitelist": {
                "all": true
            }
        },
        "POST": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        },
        "DELETE": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "frontOffice/log": {
        "POST": {
            "whitelist": {
                "all": true
            }
        },
        "GET": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "content": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "helpdest/send": {
        "POST": {
            "whitelist": {}
        }
    },
    "helpdesk/send": {
        "GET": {
            "whitelist": {}
        },
        "POST": {
            "whitelist": {
                "all": true
            }
        }
    },
    "gestori": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_LDAP-DIRETTORI-ALL"]
            }
        }
    },
    "helpdesk/categorie": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "helpdesk/esperti": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_RDP_CONCORSO", "GROUP_GESTORI_BANDI", "GROUP_CONCORSI"]
            }
        },
        "PUT": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_RDP_CONCORSO", "GROUP_GESTORI_BANDI", "GROUP_CONCORSI"]
            }
        },
        "DELETE": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_RDP_CONCORSO", "GROUP_GESTORI_BANDI", "GROUP_CONCORSI"]
            }
        }
    },
    "manage-call-labels": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_GESTORI_BANDI"]
            }
        }
    },
    "manuali": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "graduatorie": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_LDAP-DIRETTORI-ALL", "GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_LDAP_DIRETTORI_MANCANTI"]
            }
        }
    },
    "search/folder/by-path": {
        "GET": {
            "whitelist": {
                "all": true
            }
        }
    },
    "schede-anonime": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_RDP_CONCORSO", "GROUP_COMMISSIONI_CONCORSO", "GROUP_CONCORSI", "GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "convocazione": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_ALFRESCO_ADMINISTRATORS", "GROUP_RDP_CONCORSO"]
            }
        }
    },
    "show-convocazione": {
        "GET": {
            "whitelist": {
                "group": ["GROUP_RDP_CONCORSO", "GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    },
    "F:jconon_call_oiv:folder": {
        "PUT": {
            "whitelist": {
                "user": [],
                "group": ["GROUP_CONCORSI", "GROUP_GESTORI_F_JCONON_CALL_OIV_FOLDER","GROUP_ALFRESCO_ADMINISTRATORS"]
            }
        }
    }    
}
