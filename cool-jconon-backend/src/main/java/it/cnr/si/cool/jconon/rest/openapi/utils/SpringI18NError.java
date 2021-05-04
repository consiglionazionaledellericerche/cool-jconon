package it.cnr.si.cool.jconon.rest.openapi.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;
@Getter
@Setter
@AllArgsConstructor
public class SpringI18NError {
    public static String I18N = "i18n";
    private String key;
    private Map<String, String> params;
}
