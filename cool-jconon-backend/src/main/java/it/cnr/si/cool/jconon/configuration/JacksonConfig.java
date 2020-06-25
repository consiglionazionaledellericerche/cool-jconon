package it.cnr.si.cool.jconon.configuration;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.format.Formatter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;

@Configuration
public class JacksonConfig {

  @Value("${spring.mvc.date-format:yyyy-MM-dd}")
  private Optional<String> dateFormat;

  @Bean
  @Primary
  public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
    ObjectMapper objectMapper = builder.createXmlMapper(false).build();
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        .enable(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY)
        .findAndRegisterModules();
    return objectMapper;
  }

  /**
   * Spring deserializes a LocalDate in a @RequestBody differently from one in a @RequestParam - why, and can they be the same?
   *
   * @return Formetter per i LocalDate, utilizzato specialmente nei @RequestParam.
   * @see https://stackoverflow.com/questions/43684306/spring-deserializes-a-localdate-in-a-requestbody-differently-from-one-in-a-req/43726183
   * @see https://stackoverflow.com/questions/45440919/how-to-globally-configure-datetimeformat-pattern-in-spring-boot/45453492#45453492
   * @see https://github.com/spring-projects/spring-boot/pull/9930
   */
  @Bean
  public Formatter<LocalDate> localDateFormatter() {
    return new Formatter<LocalDate>() {
      @Override
      public LocalDate parse(String text, Locale locale) {
        return LocalDate.parse(text, DateTimeFormatter.ofPattern(dateFormat.get(), locale));
      }

      @Override
      public String print(LocalDate object, Locale locale) {
        return DateTimeFormatter.ofPattern(dateFormat.get(), locale).format(object);
      }
    };
  }
}
