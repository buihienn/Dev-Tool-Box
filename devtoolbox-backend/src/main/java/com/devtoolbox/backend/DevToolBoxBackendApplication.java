package com.devtoolbox.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan
public class DevToolBoxBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DevToolBoxBackendApplication.class, args);
	}

}
