package it.cnr.si.service.dto;

public class PrintParam {
    private PrintParamKey key;
    private String valoreParam;
    private String paramType;

    public PrintParamKey getKey() {
        return key;
    }

    public PrintParam key(PrintParamKey key) {
        this.key = key;
        return this;
    }

    public String getValoreParam() {
        return valoreParam;
    }

    public PrintParam valoreParam(String valoreParam) {
        this.valoreParam = valoreParam;
        return this;
    }

    public String getParamType() {
        return paramType;
    }

    public PrintParam paramType(String paramType) {
        this.paramType = paramType;
        return this;
    }

}
