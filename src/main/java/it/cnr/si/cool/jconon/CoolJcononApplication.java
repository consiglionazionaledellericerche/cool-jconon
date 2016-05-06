package it.cnr.si.cool.jconon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource({"classpath:/META-INF/spring/cool-jconon-context.xml"})

public class CoolJcononApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoolJcononApplication.class, args);
	}
}
