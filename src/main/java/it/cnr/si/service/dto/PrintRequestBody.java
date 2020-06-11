package it.cnr.si.service.dto;

import java.util.Collections;
import java.util.List;

public class PrintRequestBody {
    public static String REPORT_DATA_SOURCE = "REPORT_DATA_SOURCE";
    private String report;
    private String nomeFile;
    private List<PrintParam> params;

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    public String getNomeFile() {
        return nomeFile;
    }

    public PrintRequestBody setNomeFile(String nomeFile) {
        this.nomeFile = nomeFile;
        return this;
    }

    public List<PrintParam> getParams() {
        return params;
    }

    public void setParams(List<PrintParam> params) {
        this.params = params;
    }

    public static PrintRequestBody create(String report, String nomeFile, String jsonDatasource) {
        PrintRequestBody requestBody = new PrintRequestBody();
        requestBody.setReport(report);
        requestBody.setNomeFile(nomeFile);
        requestBody.setParams(Collections.singletonList(
            new PrintParam()
                .key(new PrintParamKey().nomeParam(REPORT_DATA_SOURCE))
                .valoreParam(jsonDatasource)
                .paramType(String.class.getTypeName())
        ));
        return requestBody;
    }
}
