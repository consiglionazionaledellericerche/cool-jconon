package it.cnr.si.repository;

import feign.Headers;
import feign.RequestLine;
import feign.Response;
import it.cnr.si.service.dto.PrintRequestBody;

@Headers({"Content-Type: application/json; charset=UTF-8"})
public interface Print {

    @RequestLine("POST /api/v1/get/print")
    Response execute(PrintRequestBody body);

}
