package com.devtoolbox.backend;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootTest
class DevToolBoxBackendApplicationTests {

	@BeforeAll
    static void loadEnv() {
        // Tải các biến từ file .env
        Dotenv dotenv = Dotenv.configure().load();
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_URL", dotenv.get("DB_URL"));
    }
	@Test
	void contextLoads() {
	}

}
