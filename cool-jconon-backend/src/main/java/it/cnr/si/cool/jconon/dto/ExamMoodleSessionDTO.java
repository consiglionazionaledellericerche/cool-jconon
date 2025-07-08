package it.cnr.si.cool.jconon.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.google.gson.annotations.Expose;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Calendar;

@Getter
@Setter
@Builder
@JsonPropertyOrder({
        "username", "firstname", "lastname", "password", "course1",
        "role1", "course2",	"role2", "enrolstatus2", "email"
})
public class ExamMoodleSessionDTO {
    private String username;
    private String firstname;
    private String lastname;
    private String password;
    private String course1;
    private String role1;
    private String course2;
    private String role2;
    private String enrolstatus2;
    private String email;
}
