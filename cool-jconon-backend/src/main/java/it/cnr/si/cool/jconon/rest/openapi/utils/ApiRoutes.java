package it.cnr.si.cool.jconon.rest.openapi.utils;

public final class ApiRoutes {
    private static final String ALPHANUMERIC_DIGITS_SPECIALS_REGEX = "^\\d*[a-zA-Z1-9\\W].*$";
    private static final String ID_REGEX = "{id:" + ALPHANUMERIC_DIGITS_SPECIALS_REGEX + "}";

    private static final String OPENAPI = "/openapi";
    public static final String VERSION_1 = OPENAPI + "/v1";
    public static final String V1_SECURITY = OPENAPI + "/security";
    public static final String SELECT2 = "/select2";
    public static final String SHOW = "/" + ID_REGEX;
    public static final String COMUNI = "/comuni";
    public static final String EXAM_SESSIONS = "/exam-sessions/" + ID_REGEX;
    public static final String EXAM_MOODLE_SESSIONS = "/exam-moodle-sessions/" + ID_REGEX;
    public static final String COMMISSIONS = "/commissions";
    public static final String SAME_TAX_CODE = "/same-tax-code";
    public static final String CHANGE_USER = "/change/" + ID_REGEX;

    public static final String V1_CACHE = VERSION_1 + "/cache";
    public static final String V1_PCHECK = VERSION_1 + "/pcheck";
    public static final String V1_FAQ = VERSION_1 + "/faq";
    public static final String V1_USER = VERSION_1 + "/user";
    public static final String V1_CHILDREN = VERSION_1 + "/children";
    public static final String V1_CALL = VERSION_1 + "/call";
    public static final String V1_APPLICATION = VERSION_1 + "/application";
    public static final String V1_DOCUMENT = VERSION_1 + "/document";
    public static final String V1_OBJECT_TYPE = VERSION_1 + "/objecttype";
    public static final String V1_ATTACHMENT = VERSION_1 + "/attachment";

    public static final String UPDATE = "/update";
    public static final String CREATE = "/create";

}
