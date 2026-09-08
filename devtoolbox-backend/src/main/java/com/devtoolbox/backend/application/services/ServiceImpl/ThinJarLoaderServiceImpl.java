package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.ThinJarLoaderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

@Service
public class ThinJarLoaderServiceImpl implements ThinJarLoaderService {

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    @Value("${app.plugins.runtime-loading-enabled:false}")
    private boolean runtimeLoadingEnabled;

    private final Map<String, Object> dynamicServices = new ConcurrentHashMap<>();
    private final List<URLClassLoader> pluginClassLoaders = new CopyOnWriteArrayList<>();

    @Override
    public void loadJarFile(MultipartFile jarFile) throws Exception {
        if (!runtimeLoadingEnabled) {
            throw new IllegalStateException(
                "Runtime plugin loading is disabled. Set PLUGIN_RUNTIME_LOADING_ENABLED=true only for trusted plugins.");
        }

        String originalFilename = jarFile.getOriginalFilename();
        if (jarFile.isEmpty() || originalFilename == null || !originalFilename.toLowerCase().endsWith(".jar")) {
            throw new IllegalArgumentException("Invalid file: " + originalFilename);
        }

        String safeFilename = Paths.get(originalFilename).getFileName().toString();
        Path jarDirectory = Paths.get("uploaded-thin-jars").toAbsolutePath().normalize();
        Path path = jarDirectory.resolve(safeFilename).normalize();
        if (!path.startsWith(jarDirectory)) {
            throw new IllegalArgumentException("Invalid JAR filename");
        }

        Files.createDirectories(jarDirectory);
        Files.write(path, jarFile.getBytes());
        System.out.println("Thin JAR file saved to: " + path.toAbsolutePath());

        // Đọc dependencies từ MANIFEST.MF
        List<String> dependencies = getDependenciesFromManifest(path.toAbsolutePath().toString());

        // Tải dependencies
        List<URL> dependencyUrls = resolveDependencies(path.getParent(), dependencies);

        // Nạp Thin JAR và dependencies vào runtime
        URLClassLoader classLoader = createThinJarClassLoader(path.toAbsolutePath().toString(), dependencyUrls);
        pluginClassLoaders.add(classLoader);

        // Đăng ký các bean từ Thin JAR
        registerBeansFromJar(path.toAbsolutePath().toString(), classLoader);
    }

    private List<String> getDependenciesFromManifest(String jarFilePath) throws Exception {
        List<String> dependencies = new ArrayList<>();
        try (JarFile jarFile = new JarFile(jarFilePath)) {
            Manifest manifest = jarFile.getManifest();
            if (manifest != null) {
                String classPath = manifest.getMainAttributes().getValue("Class-Path");
                if (classPath != null) {
                    dependencies.addAll(Arrays.asList(classPath.split(" ")));
                }
            }
        }
        return dependencies;
    }

    private List<URL> resolveDependencies(Path jarDirectory, List<String> dependencies) throws Exception {
        List<URL> dependencyUrls = new ArrayList<>();
        for (String dependency : dependencies) {
            Path dependencyPath = jarDirectory.resolve(dependency).normalize();
            if (!dependencyPath.startsWith(jarDirectory) || !Files.isRegularFile(dependencyPath)) {
                throw new IllegalArgumentException(
                    "Missing or invalid local dependency from MANIFEST.MF: " + dependency);
            }
            dependencyUrls.add(dependencyPath.toUri().toURL());
        }
        return dependencyUrls;
    }

    private URLClassLoader createThinJarClassLoader(String jarFilePath, List<URL> dependencyUrls) throws Exception {
        File jarFile = new File(jarFilePath);
        if (!jarFile.exists()) {
            throw new IllegalArgumentException("Jar file does not exist: " + jarFilePath);
        }

        URL jarUrl = jarFile.toURI().toURL();
        dependencyUrls.add(jarUrl);

        return new URLClassLoader(dependencyUrls.toArray(new URL[0]), getClass().getClassLoader());
    }

    private void registerBeansFromJar(String jarFilePath, ClassLoader classLoader) throws Exception {
        System.out.println("Starting to register beans from Thin JAR: " + jarFilePath);
        List<Class<?>> classes = getClassesFromJar(jarFilePath, classLoader);
        System.out.println("Total classes found: " + classes.size());

        for (Class<?> clazz : classes) {
            System.out.println("Processing class: " + clazz.getName());
            if (clazz.isAnnotationPresent(org.springframework.stereotype.Service.class) ||
                clazz.isAnnotationPresent(org.springframework.stereotype.Component.class)) {
                try {
                    Object bean = applicationContext.getAutowireCapableBeanFactory().createBean(clazz);
                    applicationContext.getBeanFactory().registerSingleton(clazz.getName(), bean);
                    applicationContext.getAutowireCapableBeanFactory().initializeBean(bean, clazz.getName());
                    dynamicServices.put(clazz.getSimpleName(), bean);
                    System.out.println("Registered bean: " + clazz.getName());
                } catch (Exception e) {
                    System.err.println("Failed to register bean: " + clazz.getName());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Class " + clazz.getName() + " is not annotated with @Service or @Component. Skipping.");
            }
        }
        System.out.println("Finished registering beans from Thin JAR: " + jarFilePath);
    }

    private List<Class<?>> getClassesFromJar(String jarFilePath, ClassLoader classLoader) throws Exception {
        System.out.println("Starting to get classes from Thin JAR: " + jarFilePath);
        List<Class<?>> classes = new ArrayList<>();
        try (JarFile jarFile = new JarFile(jarFilePath)) {
            jarFile.stream()
                .filter(entry -> entry.getName().endsWith(".class"))
                .forEach(entry -> {
                    String className = entry.getName()
                        .replace("/", ".")
                        .replace(".class", "");

                    if (className.startsWith("com.")) {
                        try {
                            Class<?> clazz = Class.forName(className, true, classLoader);
                            classes.add(clazz);
                        } catch (Exception e) {
                            System.err.println("Failed to load class: " + className);
                        }
                    }
                });
        }
        return classes;
    }

    @Override
    public Map<String, Object> getDynamicServices() {
        return dynamicServices;
    }

}
