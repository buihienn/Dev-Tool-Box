package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.JarLoaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class JarLoaderServiceImpl implements JarLoaderService {

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    // Lưu trữ các service đã nạp
    private final Map<String, Object> dynamicServices = new ConcurrentHashMap<>();

    @Override
    public void loadJarFile(MultipartFile jarFile) throws Exception {
        String jarDir = "uploaded-jars/";
        String originalFilename = jarFile.getOriginalFilename();
        if (originalFilename == null || !originalFilename.endsWith(".jar")) {
            throw new IllegalArgumentException("Invalid file: " + originalFilename);
        }

        Path path = Paths.get(jarDir + originalFilename);
        Files.createDirectories(path.getParent());
        Files.write(path, jarFile.getBytes());
        System.out.println("Jar file saved to: " + path.toAbsolutePath());

        // Nạp file .jar vào runtime
        loadJarIntoRuntime(path.toAbsolutePath().toString());

        // Đăng ký các bean từ file .jar
        registerBeansFromJar(path.toAbsolutePath().toString());
    }

    private void loadJarIntoRuntime(String jarFilePath) throws Exception {
        File jarFile = new File(jarFilePath);
        if (!jarFile.exists()) {
            throw new IllegalArgumentException("Jar file does not exist: " + jarFilePath);
        }

        System.out.println("Loading jar file: " + jarFilePath);
        URL jarUrl = jarFile.toURI().toURL();
        System.out.println("Jar URL: " + jarUrl);

        // Sử dụng URLClassLoader để xử lý Spring Boot fat jar
        try (URLClassLoader classLoader = new URLClassLoader(new URL[]{jarUrl}, getClass().getClassLoader())) {
            Thread.currentThread().setContextClassLoader(classLoader);
            System.out.println("Jar file loaded into runtime using LaunchedURLClassLoader: " + jarFilePath);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load jar file into runtime: " + jarFilePath, e);
        }
    }

    private void registerBeansFromJar(String jarFilePath) throws Exception {
        System.out.println("Starting to register beans from jar: " + jarFilePath);
        List<Class<?>> classes = getClassesFromJar(jarFilePath);
        System.out.println("Total classes found: " + classes.size());

        for (Class<?> clazz : classes) {
            System.out.println("Processing class: " + clazz.getName());
            if (clazz.isAnnotationPresent(org.springframework.stereotype.Service.class) ||
                clazz.isAnnotationPresent(org.springframework.stereotype.Component.class)) {
                try {
                    // Sử dụng Spring để khởi tạo bean với dependency injection
                    Object bean = applicationContext.getAutowireCapableBeanFactory().createBean(clazz);
                    applicationContext.getBeanFactory().registerSingleton(clazz.getName(), bean);
                    applicationContext.getAutowireCapableBeanFactory().initializeBean(bean, clazz.getName());
                    dynamicServices.put(clazz.getSimpleName(), bean); // Lưu service vào Map
                    System.out.println("Registered bean: " + clazz.getName() + "Simple name:" + clazz.getSimpleName());
                } catch (Exception e) {
                    System.err.println("Failed to register bean: " + clazz.getName());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Class " + clazz.getName() + " is not annotated with @Service or @Component. Skipping.");
            }
        }
        System.out.println("Finished registering beans from jar: " + jarFilePath);
    }

    private List<Class<?>> getClassesFromJar(String jarFilePath) throws Exception {
        System.out.println("Starting to get classes from jar: " + jarFilePath);
        List<Class<?>> classes = new ArrayList<>();
        try (java.util.jar.JarFile jarFile = new java.util.jar.JarFile(jarFilePath)) {
            jarFile.stream()
                .filter(entry -> entry.getName().startsWith("BOOT-INF/classes/") && entry.getName().endsWith(".class"))
                .forEach(entry -> {
                    String className = entry.getName()
                        .replace("BOOT-INF/classes/", "") // Loại bỏ tiền tố BOOT-INF/classes/
                        .replace("/", ".") // Thay dấu "/" bằng "."
                        .replace(".class", ""); // Loại bỏ đuôi .class

                    // Chỉ lấy các lớp trong 3 package cần thiết
                    if (className.startsWith("com.")) {
                        try {
                            System.out.println("Attempting to load class: " + className);
                            Class<?> clazz = Class.forName(className, true, Thread.currentThread().getContextClassLoader());
                            classes.add(clazz);
                            System.out.println("Successfully loaded class: " + className);
                        } catch (ClassNotFoundException e) {
                            System.err.println("Class not found: " + className);
                        } catch (Exception e) {
                            System.err.println("Failed to load class: " + className);
                        }
                    } else {
                        System.out.println("Class " + className + " does not match required packages. Skipping.");
                    }
                });
        } catch (Exception e) {
            System.err.println("Error while reading jar file: " + jarFilePath);
            e.printStackTrace();
        }
        System.out.println("Finished getting classes from jar. Total classes loaded: " + classes.size());
        return classes;
    }

    public Map<String, Object> getDynamicServices() {
        return dynamicServices;
    }
}