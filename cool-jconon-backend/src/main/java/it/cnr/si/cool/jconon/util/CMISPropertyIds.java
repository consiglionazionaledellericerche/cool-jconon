package it.cnr.si.cool.jconon.util;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum CMISPropertyIds {

    // ---- base ----
    /**
     * CMIS property {@code cmis:name}: name of the object.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    NAME("cmis:name"),
    /**
     * CMIS property {@code cmis:objectId}: ID of the object.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    OBJECT_ID("cmis:objectId"),
    /**
     * CMIS property {@code cmis:objectTypeId}: ID of primary type of the
     * object.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    OBJECT_TYPE_ID("cmis:objectTypeId"),
    /**
     * CMIS property {@code cmis:baseTypeId}: ID of the base type of the object.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    BASE_TYPE_ID("cmis:baseTypeId"),
    /**
     * CMIS property {@code cmis:createdBy}: creator of the object.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    CREATED_BY("cmis:createdBy"),
    /**
     * CMIS property {@code cmis:creationDate}: creation date.
     * <p>
     * CMIS data type: datetime<br>
     * Java type: GregorianCalendar
     *
     * @cmis 1.0
     */
    CREATION_DATE("cmis:creationDate"),
    /**
     * CMIS property {@code cmis:lastModifiedBy}: last modifier of the object.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    LAST_MODIFIED_BY("cmis:lastModifiedBy"),
    /**
     * CMIS property {@code cmis:lastModificationDate}: last modification date.
     * <p>
     * CMIS data type: datetime<br>
     * Java type: GregorianCalendar
     *
     * @cmis 1.0
     */
    LAST_MODIFICATION_DATE("cmis:lastModificationDate"),
    /**
     * CMIS property {@code cmis:changeToken}: change token of the object.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    CHANGE_TOKEN("cmis:changeToken"),
    /**
     * CMIS property {@code cmis:description}: description of the object.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.1
     */
    DESCRIPTION("cmis:description"),
    /**
     * CMIS property {@code cmis:secondaryObjectTypeIds} (multivalue): list of
     * IDs of the secondary types of the object.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.1
     */
    SECONDARY_OBJECT_TYPE_IDS("cmis:secondaryObjectTypeIds"),

    // ---- document ----
    /**
     * CMIS document property {@code cmis:isImmutable}: flag the indicates if
     * the document is immutable.
     * <p>
     * CMIS data type: boolean<br>
     * Java type: Boolean
     *
     * @cmis 1.0
     */
    IS_IMMUTABLE("cmis:isImmutable"),
    /**
     * CMIS document property {@code cmis:isLatestVersion}: flag the indicates
     * if the document is the latest version.
     * <p>
     * CMIS data type: boolean<br>
     * Java type: Boolean
     *
     * @cmis 1.0
     */
    IS_LATEST_VERSION("cmis:isLatestVersion"),
    /**
     * CMIS document property {@code cmis:isMajorVersion}: flag the indicates if
     * the document is a major version.
     * <p>
     * CMIS data type: boolean<br>
     * Java type: Boolean
     *
     * @cmis 1.0
     */
    IS_MAJOR_VERSION("cmis:isMajorVersion"),
    /**
     * CMIS document property {@code cmis:isLatestMajorVersion}: flag the
     * indicates if the document is the latest major version.
     * <p>
     * CMIS data type: boolean<br>
     * Java type: Boolean
     *
     * @cmis 1.0
     */
    IS_LATEST_MAJOR_VERSION("cmis:isLatestMajorVersion"),
    /**
     * CMIS document property {@code cmis:versionLabel}: version label of the
     * document.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    VERSION_LABEL("cmis:versionLabel"),
    /**
     * CMIS document property {@code cmis:versionSeriesId}: ID of the version
     * series.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    VERSION_SERIES_ID("cmis:versionSeriesId"),
    /**
     * CMIS document property {@code cmis:isVersionSeriesCheckedOut}: flag the
     * indicates if the document is checked out.
     * <p>
     * CMIS data type: boolean<br>
     * Java type: Boolean
     *
     * @cmis 1.0
     */
    IS_VERSION_SERIES_CHECKED_OUT("cmis:isVersionSeriesCheckedOut"),
    /**
     * CMIS document property {@code cmis:versionSeriesCheckedOutBy}: user who
     * checked out the document, if the document is checked out.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    VERSION_SERIES_CHECKED_OUT_BY("cmis:versionSeriesCheckedOutBy"),
    /**
     * CMIS document property {@code cmis:versionSeriesCheckedOutId}: ID of the
     * PWC, if the document is checked out.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    VERSION_SERIES_CHECKED_OUT_ID("cmis:versionSeriesCheckedOutId"),
    /**
     * CMIS document property {@code cmis:checkinComment}: check-in comment for
     * the document version.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    CHECKIN_COMMENT("cmis:checkinComment"),
    /**
     * CMIS document property {@code cmis:contentStreamLength}: length of the
     * content stream, if the document has content.
     * <p>
     * CMIS data type: integer<br>
     * Java type: BigInteger
     *
     * @cmis 1.0
     */
    CONTENT_STREAM_LENGTH("cmis:contentStreamLength"),
    /**
     * CMIS document property {@code cmis:contentStreamMimeType}: MIME type of
     * the content stream, if the document has content.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    CONTENT_STREAM_MIME_TYPE("cmis:contentStreamMimeType"),
    /**
     * CMIS document property {@code cmis:contentStreamFileName}: file name, if
     * the document has content.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    CONTENT_STREAM_FILE_NAME("cmis:contentStreamFileName"),
    /**
     * CMIS document property {@code cmis:contentStreamId}: content stream ID.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    CONTENT_STREAM_ID("cmis:contentStreamId"),
    /**
     * CMIS document property {@code cmis:isPrivateWorkingCopy}: flag the
     * indicates if the document is a PWC.
     * <p>
     * CMIS data type: boolean<br>
     * Java type: Boolean
     *
     * @cmis 1.1
     */
    IS_PRIVATE_WORKING_COPY("cmis:isPrivateWorkingCopy"),

    // ---- folder ----
    /**
     * CMIS folder property {@code cmis:parentId}: ID of the parent folder.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    PARENT_ID("cmis:parentId"),
    /**
     * CMIS folder property {@code cmis:allowedChildObjectTypeIds} (multivalue):
     * IDs of the types that can be filed in the folder.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    ALLOWED_CHILD_OBJECT_TYPE_IDS("cmis:allowedChildObjectTypeIds"),
    /**
     * CMIS folder property {@code cmis:path}: folder path.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    PATH("cmis:path"),

    // ---- relationship ----
    /**
     * CMIS relationship property {@code cmis:sourceId}: ID of the source
     * object.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    SOURCE_ID("cmis:sourceId"),
    /**
     * CMIS relationship property {@code cmis:targetId}: ID of the target
     * object.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    TARGET_ID("cmis:targetId"),

    // ---- policy ----
    /**
     * CMIS policy property {@code cmis:policyText}: policy text.
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis 1.0
     */
    POLICY_TEXT("cmis:policyText"),

    // ---- retention ----
    /**
     * CMIS retention property {@code cmis:rm_expirationDate}: expiration date.
     * <p>
     * CMIS data type: datetime<br>
     * Java type: GregorianCalendar
     *
     * @cmis 1.1
     */
    EXPIRATION_DATE("cmis:rm_expirationDate"),
    /**
     * CMIS retention property {@code cmis:rm_startOfRetention}: start date.
     * <p>
     * CMIS data type: datetime<br>
     * Java type: GregorianCalendar
     *
     * @cmis 1.1
     */
    START_OF_RETENTION("cmis:rm_startOfRetention"),
    /**
     * CMIS retention property {@code cmis:rm_destructionDate}: destruction
     * date.
     * <p>
     * CMIS data type: datetime<br>
     * Java type: GregorianCalendar
     *
     * @cmis 1.1
     */
    DESTRUCTION_DATE("cmis:rm_destructionDate"),
    /**
     * CMIS retention property {@code cmis:rm_holdIds} (multivalue): IDs of the
     * holds that are applied.
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis 1.1
     */
    HOLD_IDS("cmis:rm_holdIds"),

    // ---- extensions ----
    /**
     * Content Hash property {@code cmis:contentStreamHash} (multivalue): hashes
     * of the content stream
     * <p>
     * CMIS data type: string<br>
     * Java type: String
     *
     * @cmis Extension
     */
    CONTENT_STREAM_HASH("cmis:contentStreamHash"),

    /**
     * Latest accessible state property {@code cmis:latestAccessibleStateId}: ID
     * of the latest accessible version of a document
     * <p>
     * CMIS data type: id<br>
     * Java type: String
     *
     * @cmis Extension
     */
    LATEST_ACCESSIBLE_STATE_ID("cmis:latestAccessibleStateId"),


    ALFCMIS_NODEREF("alfcmis:nodeRef");

    private final String value;

    CMISPropertyIds(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }


    public static List<String> ids() {
        return Arrays.asList(CMISPropertyIds.values())
                .stream()
                .map(CMISPropertyIds::value)
                .collect(Collectors.toList());
    }
}
