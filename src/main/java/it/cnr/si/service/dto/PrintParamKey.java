package it.cnr.si.service.dto;

public class PrintParamKey {
    public String nomeParam;

    public String getNomeParam() {
        return nomeParam;
    }

    public PrintParamKey nomeParam(String nomeParam) {
        this.nomeParam = nomeParam;
        return this;
    }
}
